import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, propTypes } from 'redux-form';
import { ReduxDropdownField } from 'components/Forms/DropdownField';
import FormSection from 'components/Forms/FormSection';
import { loadLookups } from 'redux/actions/jobs';
import { connect } from 'react-redux';
import omit from 'lodash/omit';
import Localized from 'components/Localization/Localized';

class ProfileInterestsForm extends Component {
	constructor(props) {
		super(props);

		props.loadLookups();
	}

	getOptions(noneLabel) {
		const { departments, language } = this.props;

		let options = [{
			value: null,
			label: noneLabel
		}];
		if(departments)
			options.push(...departments.map(spec => ({
				value: spec.id,
				label: spec.name[language]
			})));

		return options;
	}

	render() {
		/* eslint-disable no-unused-vars */
		const { departments, loading, loadLookups, ...otherProps } = this.props;
		/* eslint-enable */

		return (
			<Localized names={['Common', 'Profile']}>
				{({ InterestsTitle, NoneLabel, PreferredRole1stLabel, PreferredRole2ndLabel, PreferredRole3rdLabel }) => {
					const options = this.getOptions(NoneLabel);

					return (
						<FormSection {...omit(otherProps, Object.keys(propTypes))} title={<h2>{InterestsTitle}</h2>}>
							<Field
								name="choices[0]"
								label={PreferredRole1stLabel}
								component={ReduxDropdownField}
								options={options}
								disabled={loading}
								placeholder={NoneLabel} />
			
							<Field
								name="choices[1]"
								label={PreferredRole2ndLabel}
								component={ReduxDropdownField}
								options={options}
								disabled={loading}
								placeholder={NoneLabel} />
			
							<Field
								name="choices[2]"
								label={PreferredRole3rdLabel}
								component={ReduxDropdownField}
								options={options}
								disabled={loading}
								placeholder={NoneLabel} />
						</FormSection>
					);
				}}
			</Localized>
		);
	}
}

ProfileInterestsForm.propTypes = {
	loading: PropTypes.bool,

	loadLookups: PropTypes.func.isRequired,
	departments: PropTypes.array,
	language: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
	departments: state.jobs.lookups.departments,
	language: state.localization.current.language
});
 
const ReduxProfileInterestsForm = connect(mapStateToProps, { loadLookups })(ProfileInterestsForm);

ReduxProfileInterestsForm.shortTitle = 'InterestsShortTitle';
ReduxProfileInterestsForm.formName = 'interests';

export default ReduxProfileInterestsForm;