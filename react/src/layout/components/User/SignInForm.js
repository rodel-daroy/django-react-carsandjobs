import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, propTypes, formValueSelector } from 'redux-form';
import { ReduxTextField } from 'components/Forms/TextField';
import { required, email } from 'utils/validation';
import { ReduxPasswordField } from 'components/Forms/PasswordField';
import CommandBar from 'components/Layout/CommandBar';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import Localized from 'components/Localization/Localized';
import LocaleLink from 'components/Localization/LocaleLink';
import { parseMarkdown } from 'utils/format';
import LoadingOverlay from 'components/Common/LoadingOverlay';
import { connect } from 'react-redux';
import { region } from 'redux/selectors';
import Alert from 'components/Layout/Alert';
import './SignInForm.css';

const SignInForm = ({ handleSubmit, loading, currentEmail, region, onSignInJobseeker, onSignInDealer }) => (
	<Localized names="Common">
		{({ 
			EmailLabel, 
			PasswordLabel, 
			JobseekerSignInLabel, 
			DealerSignInLabel, 
			ForgetPasswordLabel, 
			ResendVerificationEmailLabel, 
			[`SignInMessage-${region}`]: SignInMessage 
		}) => (
			<form className="signin-form" noValidate onSubmit={handleSubmit(onSignInJobseeker)}>
				{SignInMessage && (
					<Alert>
						<div dangerouslySetInnerHTML={{ __html: parseMarkdown(SignInMessage) }}></div>
					</Alert>
				)}

				<Field
					name="email"
					label={EmailLabel}
					component={ReduxTextField}
					type="email"
					validate={[required, email]}
					required
					disabled={loading}
					autoComplete="email">

					<div className="signin-form-resend">
						<PrimaryLink as={LocaleLink} to={`?resend-verification=${currentEmail || 1}`} disabled={loading}>
							{ResendVerificationEmailLabel}
						</PrimaryLink>
					</div>
				</Field>

				<Field
					name="password"
					label={PasswordLabel}
					component={ReduxPasswordField}
					validate={[required]}
					required
					disabled={loading}
					hideMeter
					autoComplete="password">

					<div className="signin-form-forget">
						<PrimaryLink as={LocaleLink} to={`?forgot-password=${currentEmail || 1}`} disabled={loading}>
							{ForgetPasswordLabel}
						</PrimaryLink>
					</div>
				</Field>

				<CommandBar>
					<PrimaryButton type="submit" disabled={loading}>
						{JobseekerSignInLabel}
					</PrimaryButton>

					<PrimaryButton type="button" onClick={handleSubmit(onSignInDealer)} disabled={loading}>
						{DealerSignInLabel}
					</PrimaryButton>
				</CommandBar>

				{loading && <LoadingOverlay />}
			</form>
		)}
	</Localized>
);

SignInForm.propTypes = {
	...propTypes,

	loading: PropTypes.bool,
	onCancel: PropTypes.func.isRequired,
	onSignInJobseeker: PropTypes.func.isRequired,
	onSignInDealer: PropTypes.func.isRequired,

	currentEmail: PropTypes.string,
	region: PropTypes.string.isRequired
};

const formValue = formValueSelector('signin');

const mapStateToProps = state => ({
	currentEmail: formValue(state, 'email'),
	region: region(state)
});
 
export default connect(mapStateToProps)(reduxForm({
	form: 'signin'
})(SignInForm));