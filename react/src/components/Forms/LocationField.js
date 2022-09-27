import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Field, { AllFieldPropTypes } from './Field';
import { makeReduxField } from './common';
import DropdownField from './DropdownField';
import omit from 'lodash/omit';
import { connect } from 'react-redux';
import { autoCompleteLocation } from 'redux/actions/geolocation';
import { apiPromise } from 'utils/redux';
import Localized from 'components/Localization/Localized';
import './LocationField.css';

let LocationField = 
	class LocationField extends Component {
		state = {}

		static getDerivedStateFromProps(props) {
			const { value } = props;

			if(value && typeof value === 'object') {
				const { city, province } = value;

				return {
					value: `${city}, ${province}`,
					result: value
				};
			}
			else {
				if(!value)
					return {
						value: null,
						result: null
					};
			}

			return { value };
		}

		handleLoadOptions = async search => {
			const { autoCompleteLocation } = this.props;

			autoCompleteLocation({ search });
			const result = await apiPromise(() => this.props.locations);

			return { 
				options: result.map(({ city, province, locationId }) => ({
					label: `${city}, ${province}`,
					value: `${city}, ${province}`,

					city,
					province,
					locationId
				}))
			};
		}

		handleLoadOption = async value => {
			if(value)
				return {
					value,
					label: value
				};

			return null;
		}

		handleChange = (value, obj) => {
			const { onChange } = this.props;
			const result = obj || value;

			this.setState({ result });
			if(onChange)
				onChange(result);
		}

		handleBlur = value => {
			const { onBlur } = this.props;
			const { result } = this.state;

			if(onBlur)
				onBlur(result || value);
		}

		render() { 
			// eslint-disable-next-line
			const { autoCompleteLocation, locations, placeholder, ...props } = this.props;
			const { value } = this.state;

			return (
				<Localized names="Common">
					{({ LocationPlaceholder }) => (
						<DropdownField 
							{...props}
							value={value}
							options={this.handleLoadOptions}
							loadOption={this.handleLoadOption}
							onChange={this.handleChange}
							onBlur={this.handleBlur}
							placeholder={placeholder || LocationPlaceholder}
							noArrow />
					)}
				</Localized>
			);
		}
	};

LocationField.propTypes = {
	onChange: PropTypes.func,
	readOnly: PropTypes.bool,

	...omit(AllFieldPropTypes, ['inputComponent']),

	autoCompleteLocation: PropTypes.func.isRequired,
	locations: PropTypes.object.isRequired
};

LocationField.defaultProps = {
	...Field.defaultProps
};

const mapStateToProps = state => ({
	locations: state.geolocation.autoCompleteLocation
});

LocationField = connect(mapStateToProps, { autoCompleteLocation })(LocationField);

export default LocationField;
export const ReduxLocationField = makeReduxField(LocationField);