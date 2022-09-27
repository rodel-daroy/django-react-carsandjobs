import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, propTypes } from 'redux-form';
import { ReduxTextField } from 'components/Forms/TextField';
import { ReduxTextAreaField } from 'components/Forms/TextAreaField';
import DropdownField, { ReduxDropdownField } from 'components/Forms/DropdownField';
import CommandBar from 'components/Layout/CommandBar';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import { required, email, phoneNumber } from 'utils/validation';
import { loadCoverLetters, loadResumes } from 'redux/actions/profile';
import { connect } from 'react-redux';
import LocaleLink from 'components/Localization/LocaleLink';
import LabelAside from 'components/Forms/LabelAside';
import FormSection from 'components/Forms/FormSection';
import Localized from 'components/Localization/Localized';
import { parseMarkdown } from 'utils/format';
import './JobApplicationForm.css';

class JobApplicationForm extends Component {
	constructor(props) {
		super(props);

		props.loadCoverLetters();
		props.loadResumes();
	}

	state = {}

	getDropdownOptions(list) {
		return (list || []).filter(item => item.active).map(item => ({
			label: item.name,
			value: item.id
		}));
	}

	handleCoverLetterChange = coverLetterId => {
		const { coverLetters, autofill } = this.props;
		const coverLetterText = (coverLetters.find(cl => cl.id === coverLetterId) || {}).text;

		autofill('coverLetterText', coverLetterText);
		this.setState({ coverLetterId });
	}

	render() {
		const { handleSubmit, loading, onCancel } = this.props;
		const { coverLetterId } = this.state;

		const coverLetters = this.getDropdownOptions(this.props.coverLetters);
		const resumes = this.getDropdownOptions(this.props.resumes);

		return (
			<Localized names={['Common', 'Jobs']}>
				{({ 
					FirstNameLabel, 
					LastNameLabel, 
					EmailLabel, 
					MobileLabel,
					CoverLetterLabel,
					ManageCoverLettersLabel,
					SelectCoverLetterPlaceholder,
					EnterCoverLetterLabel,
					ResumeLabel,
					ManageResumesLabel,
					SelectResumePlaceholder,
					OnlyProcessedResumesMessage,
					VideoLinkLabel,
					OptionalLabel,
					SubmitLabel,
					CancelLabel
				}) => (
					<form className="job-application-form" noValidate onSubmit={handleSubmit}>
						<FormSection className="job-application-form-section" first>
							<Field
								name="firstName"
								label={FirstNameLabel}
								component={ReduxTextField}
								required
								validate={[required]}
								disabled={loading}
								readOnly />
							<Field
								name="lastName"
								label={LastNameLabel}
								component={ReduxTextField}
								required
								validate={[required]}
								disabled={loading}
								readOnly />

							<Field
								name="email"
								label={EmailLabel}
								component={ReduxTextField}
								type="email"
								required
								validate={[required, email]}
								disabled={loading}
								readOnly />

							<Field
								name="cellphone"
								label={MobileLabel}
								component={ReduxTextField}
								type="tel"
								required
								validate={[phoneNumber]}
								disabled={loading} />
						</FormSection>

						<FormSection className="job-application-form-section">
							<DropdownField
								label={(
									<div>
										{CoverLetterLabel}

										<LabelAside>
											<PrimaryLink as={LocaleLink} to="/profile/cover-letters">
												{ManageCoverLettersLabel}
											</PrimaryLink>
										</LabelAside>
									</div>
								)}
								options={coverLetters}
								searchable={false}
								placeholder={SelectCoverLetterPlaceholder}
								disabled={loading}
								onChange={this.handleCoverLetterChange}
								value={coverLetterId} />

							<Field
								name="coverLetterText"
								label={EnterCoverLetterLabel}
								component={ReduxTextAreaField}
								disabled={loading} />

							<Field
								name="resumeId"
								label={(
									<div>
										{ResumeLabel}

										<LabelAside>
											<PrimaryLink as={LocaleLink} to="/profile/resumes">
												{ManageResumesLabel}
											</PrimaryLink>
										</LabelAside>
									</div>
								)}
								component={ReduxDropdownField}
								options={resumes}
								searchable={false}
								placeholder={SelectResumePlaceholder}
								required
								validate={[required]}
								disabled={loading} />

							<div className="job-application-form-resume-note" dangerouslySetInnerHTML={{ __html: parseMarkdown(OnlyProcessedResumesMessage) }}>
							</div>
						</FormSection>

						<FormSection className="job-application-form-section">
							<Field
								name="videoUrl"
								label={(
									<div>
										{VideoLinkLabel}

										<LabelAside>
											{OptionalLabel}
										</LabelAside>
									</div>
								)}
								component={ReduxTextField}
								placeholder="http://"
								disabled={loading} />
						</FormSection>

						<CommandBar>
							<PrimaryButton type="submit" disabled={loading}>
								{SubmitLabel}
							</PrimaryButton>
							<PrimaryLink disabled={loading} as="button" type="button" onClick={onCancel} iconClassName="icon icon-cancel" hasIcon>
								{CancelLabel}
							</PrimaryLink>
						</CommandBar>
					</form>
				)}
			</Localized>
		);
	}
}

JobApplicationForm.propTypes = {
	...propTypes,

	onCancel: PropTypes.func.isRequired,

	loadCoverLetters: PropTypes.func.isRequired,
	loadResumes: PropTypes.func.isRequired,
	autofill: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	coverLetters: state.profile.coverLetters.list.result,
	resumes: state.profile.resumes.list.result
});
 
export default connect(mapStateToProps, { loadCoverLetters, loadResumes })(
	reduxForm({ 
		enableReinitialize: true
	})(JobApplicationForm));