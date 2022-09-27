import React from 'react';
import PropTypes from 'prop-types';
import { Field, propTypes, formValueSelector } from 'redux-form';
import FormSection from 'components/Forms/FormSection';
import omit from 'lodash/omit';
import { ReduxTextField } from 'components/Forms/TextField';
import { required, email } from 'utils/validation';
import { ReduxDropdownField } from 'components/Forms/DropdownField';
import { ReduxCheckboxField } from 'components/Forms/CheckboxField';
import Localized from 'components/Localization/Localized';
import { connect } from 'react-redux';
import { parseMarkdown } from 'utils/format';
import './JobNotificationsForm.css';

export const EMAIL_IMMEDIATELY = 'Instant email';
export const EMAIL_DAILY = 'Daily email';
export const DO_NOT_EMAIL = 'Do not email';

const validateNotificationEmail = (value, allValues) => {
	if(allValues.emailNotification !== DO_NOT_EMAIL)
		return required(value);
	else
		return undefined;
};

// eslint-disable-next-line no-unused-vars
const JobNotificationsForm = ({ loading, readOnly, emailNotification, validate, ...otherProps }) => (
	<Localized names={['Common', 'Jobs', 'Employer']}>
		{({ 
			NotificationsTitle, 
			ApplicationNotificationLabel, 
			NotificationEmailLabel,
			EmailImmediatelyLabel,
			EmailDailyLabel,
			DoNotEmailLabel,
			SelectPlaceholder,
			PostOnIndeedLabel,
			IndeedConfidentialMessage,
			FromTemplateLabel
		}) => (
			<FormSection 
				{...omit(otherProps, Object.keys(propTypes))} 
				
				title={<h2>{NotificationsTitle}</h2>}
				className="job-notifications-form">

				<Field
					name="emailNotification"
					label={ApplicationNotificationLabel}
					component={ReduxDropdownField}
					options={[
						{
							label: EmailImmediatelyLabel,
							value: EMAIL_IMMEDIATELY
						},
						{
							label: EmailDailyLabel,
							value: EMAIL_DAILY
						},
						{
							label: DoNotEmailLabel,
							value: DO_NOT_EMAIL
						}
					]}
					searchable={false}
					validate={[required]}
					placeholder={SelectPlaceholder}
					disabled={loading}
					readOnly={readOnly}
					autofilledText={FromTemplateLabel} />

				{emailNotification !== DO_NOT_EMAIL && (
					<Field
						name="notificationEmail"
						label={NotificationEmailLabel}
						component={ReduxTextField}
						validate={[email, validateNotificationEmail]}
						disabled={loading}
						readOnly={readOnly}
						autofilledText={FromTemplateLabel} />
				)}

				<Field
					name="postOnIndeed"
					label={PostOnIndeedLabel}
					component={ReduxCheckboxField}
					disabled={loading}
					readOnly={readOnly}
					autofilledText={FromTemplateLabel} />

				<div className="job-notifications-form-indeed-message" 
					dangerouslySetInnerHTML={{ __html: parseMarkdown(IndeedConfidentialMessage) }}>
				</div>
			</FormSection>
		)}
	</Localized>
);

JobNotificationsForm.propTypes = {
	loading: PropTypes.bool,
	readOnly: PropTypes.bool,
	validate: PropTypes.func,

	emailNotification: PropTypes.any
};

const mapStateToProps = (state, { form }) => ({
	emailNotification: formValueSelector(form)(state, 'emailNotification')
});

JobNotificationsForm.shortTitle = 'NotificationsShortTitle';
JobNotificationsForm.formName = 'notifications';
 
export default connect(mapStateToProps)(JobNotificationsForm);