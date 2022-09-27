import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, propTypes, Field } from 'redux-form';
import { ReduxTextField } from 'components/Forms/TextField';
import { required, email } from 'utils/validation';
import Localized from 'components/Localization/Localized';
import CommandBar from 'components/Layout/CommandBar';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import LoadingOverlay from 'components/Common/LoadingOverlay';
import { parseMarkdown } from 'utils/format';
import './ForgotPasswordForm.css';

const ForgotPasswordForm = ({ handleSubmit, loading, onCancel }) => (
	<Localized names="Common">
		{({ EmailLabel, ResetPasswordLabel, CancelLabel, ResetPasswordMessage }) => (
			<form className="forgot-password-form" noValidate onSubmit={handleSubmit}>
				<div dangerouslySetInnerHTML={{ __html: parseMarkdown(ResetPasswordMessage) }}></div>

				<Field
					name="email"
					label={EmailLabel}
					component={ReduxTextField}
					type="email"
					validate={[required, email]}
					disabled={loading} />

				<CommandBar>
					<PrimaryButton type="submit" disabled={loading}>
						{ResetPasswordLabel}
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

ForgotPasswordForm.propTypes = {
	...propTypes,

	loading: PropTypes.bool,
	onCancel: PropTypes.func.isRequired
};
 
export default reduxForm({
	form: 'forgotPassword'
})(ForgotPasswordForm);