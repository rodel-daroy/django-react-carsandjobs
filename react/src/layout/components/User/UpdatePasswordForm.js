import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, propTypes, Field } from 'redux-form';
import { ReduxPasswordField } from 'components/Forms/PasswordField';
import { required, passwordLength, fieldsMatch } from 'utils/validation';
import Localized from 'components/Localization/Localized';
import CommandBar from 'components/Layout/CommandBar';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import LoadingOverlay from 'components/Common/LoadingOverlay';
import { parseMarkdown } from 'utils/format';
import './UpdatePasswordForm.css';

const passwordsMatch = fieldsMatch(['password', 'confirmPassword'], { key: 'SamePasswordError' });

const UpdatePasswordForm = ({ handleSubmit, loading, onCancel }) => (
	<Localized names="Common">
		{({ NewPasswordLabel, ConfirmPasswordLabel, UpdatePasswordLabel, CancelLabel, UpdatePasswordMessage }) => (
			<form className="update-password-form" noValidate onSubmit={handleSubmit}>
				<div dangerouslySetInnerHTML={{ __html: parseMarkdown(UpdatePasswordMessage) }}></div>

				<Field
					name="password"
					label={NewPasswordLabel}
					component={ReduxPasswordField}
					validate={[required, passwordLength]}
					disabled={loading}
					autoComplete="new-password" />

				<Field
					name="confirmPassword"
					label={ConfirmPasswordLabel}
					component={ReduxPasswordField}
					validate={[required, passwordsMatch]}
					disabled={loading}
					hideMeter
					autoComplete="new-password" />

				<CommandBar>
					<PrimaryButton type="submit" disabled={loading}>
						{UpdatePasswordLabel}
					</PrimaryButton>

					<PrimaryLink as="button" type="button" hasIcon iconClassName="icon icon-cancel" onClick={onCancel} disabled={loading}>
						{CancelLabel}
					</PrimaryLink>
				</CommandBar>

				{loading && <LoadingOverlay />}
			</form>
		)}
	</Localized>
);

UpdatePasswordForm.propTypes = {
	...propTypes,

	loading: PropTypes.bool,
	onCancel: PropTypes.func.isRequired
};
 
export default reduxForm({
	form: 'updatePassword'
})(UpdatePasswordForm);