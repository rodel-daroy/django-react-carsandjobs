import React from 'react';
import PropTypes from 'prop-types';
import { Field, propTypes } from 'redux-form';
import { ReduxTextField } from 'components/Forms/TextField';
import { ReduxPasswordField } from 'components/Forms/PasswordField';
import { required, passwordLength, fieldsMatch, email } from 'utils/validation';
import FormSection from 'components/Forms/FormSection';
import omit from 'lodash/omit';
import Localized from 'components/Localization/Localized';

const passwordsMatch = fieldsMatch(['password', 'confirmPassword'], { key: 'SamePasswordError' });

const ProfileAccountForm = ({ loading, ...otherProps }) => (
	<Localized names={['Common', 'Profile']}>
		{({ EmailLabel, PasswordLabel, AccountTitle, ConfirmPasswordLabel }) => {
			return (
				<FormSection {...omit(otherProps, Object.keys(propTypes))} title={<h2>{AccountTitle}</h2>}>
					<Field
						name="email"
						label={EmailLabel}
						component={ReduxTextField}
						validate={[required, email]}
						disabled={loading} />

					<Field
						name="password"
						label={PasswordLabel}
						component={ReduxPasswordField}
						validate={[required, passwordLength]}
						disabled={loading}
						autoComplete="new-password" />

					<Field
						name="confirmPassword"
						label={ConfirmPasswordLabel}
						component={ReduxPasswordField}
						hideMeter
						validate={[required, passwordsMatch]}
						disabled={loading}
						autoComplete="new-password" />
				</FormSection>
			);
		}}
	</Localized>
);

ProfileAccountForm.propTypes = {
	loading: PropTypes.bool
};

ProfileAccountForm.shortTitle = 'AccountShortTitle';
ProfileAccountForm.formName = 'account';

export default ProfileAccountForm;