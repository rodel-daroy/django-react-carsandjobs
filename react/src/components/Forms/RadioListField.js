import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Field, { AllFieldPropTypes } from './Field';
import { makeReduxField } from './common';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import omit from 'lodash/omit';
import Localized from 'components/Localization/Localized';
import './RadioListField.css';

class RadioListField extends Component {
	state = {
		expanded: false
	}

	renderInput = ({ id }) => {
		const { options, value, onChange } = this.props;
		const { expanded } = this.state;

		let visibleOptions;
		if(expanded)
			visibleOptions = options;
		else {
			const checkedIndex = options.findIndex(option => option.value === value);
			if(checkedIndex >= this.props.visibleOptions)
				visibleOptions = options;
			else
				visibleOptions = options.slice(0, this.props.visibleOptions);
		}

		const showExpand = visibleOptions.length < options.length;

		return (
			<Localized names="Common">
				{({ ShowMoreOptionsLabel }) => (
					<div className="radio-list-field-inner">
						{visibleOptions.map((option, i) => (
							<label key={i} className={`radio-list-field-label ${option.value === value ? 'checked' : ''}`}>
								<input 
									type="radio" 
									name={id} 
									value={option.value} 
									checked={option.value === value}
									onChange={() => onChange(option.value)} /> 
									
								{option.label}
							</label>
						))}

						{showExpand && (
							<PrimaryLink onClick={() => this.setState({ expanded: true })}>{ShowMoreOptionsLabel}</PrimaryLink>
						)}
					</div>
				)}
			</Localized>
		);
	}

	render() {
		/* eslint-disable no-unused-vars */
		const { options, visibleOptions, value, className, onChange, ...otherProps } = this.props;
		/* eslint-enable */
	
		return (
			<Field {...otherProps} className={`radio-list-field ${className || ''}`} inputComponent={this.renderInput} />
		);
	}
}

RadioListField.propTypes = {
	options: PropTypes.arrayOf(PropTypes.shape({
		label: PropTypes.node,
		value: PropTypes.any
	})).isRequired,
	visibleOptions: PropTypes.number,
	value: PropTypes.any,
	className: PropTypes.string,
	onChange: PropTypes.func,

	...omit(AllFieldPropTypes, ['inputComponent'])
};

RadioListField.defaultProps = {
	visibleOptions: 4
};

export default RadioListField;
export const ReduxRadioListField = makeReduxField(RadioListField);