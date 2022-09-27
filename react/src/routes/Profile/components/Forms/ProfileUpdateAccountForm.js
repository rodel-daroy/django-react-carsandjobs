import React from 'react';
import PropTypes from 'prop-types';
import { Field, propTypes } from 'redux-form';
import { ReduxTextField } from 'components/Forms/TextField';
import { ReduxPasswordField } from 'components/Forms/PasswordField';
import { required, passwordLength, fieldsMatch, email } from 'utils/validation';
import FormSection from 'components/Forms/FormSection';
import omit from 'lodash/omit';
import Localized from 'components/Localization/Localized';
import { parseMarkdown } from 'utils/format';

const validatePassword = value => {
	if((value || '').length > 0)
		return passwordLength(value);
	else
		return undefined;
};

const passwordsMatch = fieldsMatch(['password', 'confirmPassword'], { key: 'SamePasswordError' });

const validateOldPassword = (value, allValues) => {
	const { oldPassword, password } = allValues;

	if(password && !oldPassword)
		return { key: 'CurrentPasswordError' };
	else
		return undefined;
};

const ProfileUpdateAccountForm = ({ loading, ...otherProps }) => (
	<Localized names={['Common', 'Profile']}>
		{({ AccountTitle, EmailLabel, CurrentPasswordLabel, NewPasswordLabel, ConfirmPasswordLabel, UpdatePasswordMessage }) => (
			<FormSection {...omit(otherProps, Object.keys(propTypes))} title={<h2>{AccountTitle}</h2>}>
				<Field
					name="email"
					label={EmailLabel}
					component={ReduxTextField}
					validate={[required, email]}
					disabled={loading} />
				
				<div dangerouslySetInnerHTML={{ __html: parseMarkdown(UpdatePasswordMessage) }}></div>

				<Field
					name="oldPassword"
					label={CurrentPasswordLabel}
					component={ReduxPasswordField}
					validate={[validateOldPassword]}
					disabled={loading}
					hideMeter
					autoComplete="password" />

				<Field
					name="password"
					label={NewPasswordLabel}
					component={ReduxPasswordField}
					validate={[validatePassword]}
					disabled={loading}
					autoComplete="new-password" />

				<Field
					name="confirmPassword"
					label={ConfirmPasswordLabel}
					component={ReduxPasswordField}
					hideMeter
					validate={[passwordsMatch]}
					disabled={loading}
					autoComplete="new-password" />
			</FormSection>
		)}
	</Localized>
);

ProfileUpdateAccountForm.propTypes = {
	loading: PropTypes.bool
};

ProfileUpdateAccountForm.shortTitle = 'AccountShortTitle';
ProfileUpdateAccountForm.formName = 'account';

export default ProfileUpdateAccountForm;