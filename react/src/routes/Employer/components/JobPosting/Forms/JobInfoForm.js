import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, propTypes, formValueSelector } from 'redux-form';
import FormSection from 'components/Forms/FormSection';
import omit from 'lodash/omit';
import { ReduxTextField } from 'components/Forms/TextField';
import { required } from 'utils/validation';
import { ReduxDropdownField } from 'components/Forms/DropdownField';
import { connect } from 'react-redux';
import { loadLookups } from 'redux/actions/jobs';
import { language, authDealers } from 'redux/selectors';
import LabelAside from 'components/Forms/LabelAside';
import Localized from 'components/Localization/Localized';
import { ReduxMarkdownField } from 'components/Forms/Markdown/SimpleMarkdownField';
import { ReduxCheckboxField } from 'components/Forms/CheckboxField';
import { LANGUAGES } from 'config/constants';
import { ReduxDealerField } from '../../DealerField';
import { parseMarkdown } from 'utils/format';
import './JobInfoForm.css';

class JobInfoForm extends Component {
	constructor(props) {
		super(props);

		props.loadLookups();
	}

	state = {
		markdown: ''
	}

	getOptions(lookup) {
		const { language } = this.props;

		return (lookup || []).map(l => ({
			label: l.name[language],
			value: l.id
		}));
	}

	render() {
		/* eslint-disable no-unused-vars */
		const { 
			loading, 
			lookups: {
				departments, 
				positionTypes, 
				experiences, 
				educations 
			}, 
			loadLookups,
			dealers,
			readOnly,
			currentLanguage,
			validate,

			...otherProps 
		} = this.props;
		/* eslint-enable */

		//const currentLanguageLabel = (LANGUAGES.find(l => l[1] === currentLanguage) || [''])[0];

		return (
			<Localized names={['Common', 'Jobs', 'Employer']}>
				{({ 
					DealerLabel,
					ConfidentialDealerLabel,
					LanguageOfPostingLabel,
					JobInfoTitle, 
					JobTitleLabel, 
					SalaryLabel, 
					DepartmentsLabel, 
					DepartmentsSelectLabel, 
					PositionTypeLabel,
					EducationLabel,
					ExperienceLabel,
					DescriptionLabel,
					LanguageOfPostingMessage,
					FromTemplateLabel
				}) => (
					<FormSection 
						{...omit(otherProps, Object.keys(propTypes))} 
						
						title={<h2>{JobInfoTitle}</h2>}
						className="job-info-form">

						<FormSection>
							<Field
								name="dealer"
								label={DealerLabel}
								component={ReduxDealerField}
								validate={[required]}
								disabled={loading}
								readOnly={readOnly}
								showBalance
								autofilledText={FromTemplateLabel} />

							<Field
								name="confidential"
								label={ConfidentialDealerLabel}
								component={ReduxCheckboxField}
								disabled={loading}
								readOnly={readOnly}
								autofilledText={FromTemplateLabel} />
						</FormSection>

						<Field
							className="job-info-form-language"
							name="language"
							label={LanguageOfPostingLabel}
							component={ReduxDropdownField}
							validate={[required]}
							disabled={loading}
							searchable={false}
							options={LANGUAGES.map(lang => ({
								label: lang[0],
								value: lang[1]
							}))}
							readOnly={readOnly}
							autofilledText={FromTemplateLabel} />

						<div 
							className="job-info-form-language-message"
							dangerouslySetInnerHTML={{ __html: parseMarkdown(LanguageOfPostingMessage) }}>
						</div>


						<Field
							name="title"
							label={(
								<div>
									{JobTitleLabel}
									{/* <LabelAside>{currentLanguageLabel}</LabelAside> */}
								</div>
							)}
							component={ReduxTextField}
							validate={[required]}
							disabled={loading}
							readOnly={readOnly}
							autofilledText={FromTemplateLabel} />

						<Field
							name="salary"
							label={(
								<div>
									{SalaryLabel}
									{/* <LabelAside>{currentLanguageLabel}</LabelAside> */}
								</div>
							)}
							component={ReduxTextField}
							disabled={loading}
							readOnly={readOnly}
							autofilledText={FromTemplateLabel} />

						<FormSection>
							<Field
								name="department[0]"
								label={<div>{DepartmentsLabel} <LabelAside>{DepartmentsSelectLabel}</LabelAside></div>}
								component={ReduxDropdownField}
								options={this.getOptions(departments)}
								validate={[required]}
								disabled={loading}
								className="job-info-form-department"
								readOnly={readOnly}
								autofilledText={FromTemplateLabel} />

							<Field
								name="department[1]"
								component={ReduxDropdownField}
								options={this.getOptions(departments)}
								disabled={loading}
								className="job-info-form-department"
								readOnly={readOnly}
								autofilledText={FromTemplateLabel} />

							<Field
								name="department[2]"
								component={ReduxDropdownField}
								options={this.getOptions(departments)}
								disabled={loading}
								className="job-info-form-department"
								readOnly={readOnly}
								autofilledText={FromTemplateLabel} />
						</FormSection>

						<FormSection>
							<Field
								name="positionType"
								label={PositionTypeLabel}
								component={ReduxDropdownField}
								options={this.getOptions(positionTypes)}
								validate={[required]}
								disabled={loading}
								readOnly={readOnly}
								autofilledText={FromTemplateLabel} />

							<Field
								name="education"
								label={EducationLabel}
								component={ReduxDropdownField}
								options={this.getOptions(educations)}
								validate={[required]}
								disabled={loading}
								readOnly={readOnly}
								autofilledText={FromTemplateLabel} />

							<Field
								name="experience"
								label={ExperienceLabel}
								component={ReduxDropdownField}
								options={this.getOptions(experiences)}
								validate={[required]}
								disabled={loading}
								readOnly={readOnly}
								autofilledText={FromTemplateLabel} />
						</FormSection>
						
						<Field
							name="description"
							className="job-info-form-description"
							label={(
								<div>
									{DescriptionLabel}
									{/* <LabelAside>{currentLanguageLabel}</LabelAside> */}
								</div>
							)}
							component={ReduxMarkdownField}
							validate={[required]}
							disabled={loading}
							size="large"
							readOnly={readOnly}
							autofilledText={FromTemplateLabel}
							template />
					</FormSection>
				)}
			</Localized>
		);
	}
}

JobInfoForm.propTypes = {
	loading: PropTypes.bool,
	readOnly: PropTypes.bool,
	validate: PropTypes.func,

	loadLookups: PropTypes.func.isRequired,
	lookups: PropTypes.object,
	language: PropTypes.string.isRequired,
	dealers: PropTypes.array.isRequired,
	currentLanguage: PropTypes.string
};

JobInfoForm.shortTitle = 'JobInfoShortTitle';
JobInfoForm.formName = 'jobInfo';

const mapStateToProps = (state, { form }) => ({
	lookups: state.jobs.lookups,
	language: language(state),
	dealers: authDealers(state),
	currentLanguage: formValueSelector(form)(state, 'language')
});
 
export default connect(mapStateToProps, { loadLookups })(JobInfoForm);