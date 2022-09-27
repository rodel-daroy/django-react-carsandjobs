import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, propTypes } from 'redux-form';
import { ReduxLocationField } from 'components/Forms/LocationField';
import { ReduxDropdownField } from 'components/Forms/DropdownField';
import { ReduxTextField } from 'components/Forms/TextField';
import CommandBar from 'components/Layout/CommandBar';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import { connect } from 'react-redux';
import { loadLookups } from 'redux/actions/jobs';
import { lookupOptions } from 'redux/selectors';
import { ReduxCheckboxField } from 'components/Forms/CheckboxField';
import Localized from 'components/Localization/Localized';
import FormSection from 'components/Forms/FormSection';
import './ResumeFilterForm.css';

class ResumeFilterForm extends Component {
	constructor(props) {
		super(props);

		props.loadLookups();
	}

	handleClear = () => this.props.initialize();

	render() {
		const { handleSubmit, loading, departments } = this.props;

		return (
			<Localized names={['Common', 'Jobs', 'Employer']}>
				{({
					AnyLabel,
					KeywordsLabel,
					DepartmentLabel,
					LocationLabel,
					CoopStudentsLabel,
					NewGraduatesLabel,
					OrderLabel,
					OldestToNewestLabel,
					NewestToOldestLabel,
					AToZLabel,
					ZToALabel,
					SearchLabel,
					ClearLabel
				}) => {
					const options = [
						{
							value: null,
							label: AnyLabel
						},

						...departments
					];

					return (
						<form className="resume-filter-form" noValidate onSubmit={handleSubmit}>
							<div className="resume-filter-form-body">
								<Field
									name="keywords"
									label={KeywordsLabel}
									component={ReduxTextField}
									disabled={loading} />

								<Field
									name="department"
									label={DepartmentLabel}
									component={ReduxDropdownField}
									options={options}
									disabled={loading} />

								<Field
									name="location"
									label={LocationLabel}
									component={ReduxLocationField}
									disabled={loading} />

								<FormSection>
									<Field
										name="coopStudent"
										label={CoopStudentsLabel}
										component={ReduxCheckboxField}
										disabled={loading} />

									<Field
										name="newGraduate"
										label={NewGraduatesLabel}
										component={ReduxCheckboxField}
										disabled={loading} />
								</FormSection>

								<Field
									className="resume-filter-form-order"
									name="order"
									label={OrderLabel}
									component={ReduxDropdownField}
									options={[
										{
											value: '-modifiedDate',
											label: NewestToOldestLabel
										},
										{
											value: 'modifiedDate',
											label: OldestToNewestLabel
										},
										{
											value: 'lastName',
											label: AToZLabel
										},
										{
											value: '-lastName',
											label: ZToALabel
										}
									]}
									searchable={false}
									disabled={loading} />
							</div>

							<div className="resume-filter-form-commands">
								<CommandBar layout="alwaysMobile">
									<PrimaryButton type="submit">
										{SearchLabel}
									</PrimaryButton>

									<PrimaryLink as="button" type="button" hasIcon iconClassName="icon icon-cancel" onClick={this.handleClear}>
										{ClearLabel}
									</PrimaryLink>
								</CommandBar>
							</div>
						</form>
					);
				}}
			</Localized>
		);
	}
}

ResumeFilterForm.propTypes = {
	...propTypes,

	loading: PropTypes.bool,

	loadLookups: PropTypes.func.isRequired,
	departments: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
	departments: lookupOptions('departments')(state)
});

export default connect(mapStateToProps, { loadLookups })(reduxForm({
	form: 'resumeFilter'
})(ResumeFilterForm));