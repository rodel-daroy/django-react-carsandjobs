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
import LocaleLink from 'components/Localization/LocaleLink';
import './ResendVerificationEmailForm.css';

const ResendVerificationEmailForm = ({ handleSubmit, loading }) => (
	<Localized names="Common">
		{({ EmailLabel, ResendEmailLabel, SignInLabel, ResendVerificationEmailMessage }) => (
			<form className="resend-verification-email-form" noValidate onSubmit={handleSubmit}>
				<div dangerouslySetInnerHTML={{ __html: parseMarkdown(ResendVerificationEmailMessage) }}></div>

				<Field
					name="email"
					label={EmailLabel}
					component={ReduxTextField}
					type="email"
					validate={[required, email]}
					disabled={loading} />

				<CommandBar>
					<PrimaryButton as="button" type="submit" disabled={loading}>
						{ResendEmailLabel}
					</PrimaryButton>

					<PrimaryLink as={LocaleLink} to="?signin=1" disabled={loading}>
						{SignInLabel}
					</PrimaryLink>
				</CommandBar>

				{loading && <LoadingOverlay />}
			</form>
		)}
	</Localized>
);

ResendVerificationEmailForm.propTypes = {
	...propTypes,

	loading: PropTypes.bool,
	onCancel: PropTypes.func.isRequired
};
 
export default reduxForm({
	form: 'resendVerificationEmail'
})(ResendVerificationEmailForm);