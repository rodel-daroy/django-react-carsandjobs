import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, propTypes, Field } from 'redux-form';
import { ReduxTextField } from 'components/Forms/TextField';
import { required, email, phoneNumber } from 'utils/validation';
import LabelAside from 'components/Forms/LabelAside';
import { ReduxTextAreaField } from 'components/Forms/TextAreaField';
import CommandBar from 'components/Layout/CommandBar';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import LoadingOverlay from 'components/Common/LoadingOverlay';
import omit from 'lodash/omit';
import Localized from 'components/Localization/Localized';
import './ContactUsForm.css';

const ContactUsForm = ({ loading, handleSubmit, onCancel, ...otherProps }) => (
	<Localized names="Common">
		{({ 
			FirstNameLabel, 
			LastNameLabel, 
			EmailLabel, 
			MobileLabel, 
			ContactTextLabel, 
			SubmitLabel, 
			CancelLabel,
			OptionalLabel 
		}) => (
			<form {...omit(otherProps, Object.keys(propTypes))} className="contact-us-form" noValidate onSubmit={handleSubmit}>
				<Field
					name="first_name"
					label={FirstNameLabel}
					component={ReduxTextField}
					validate={[required]}
					disabled={loading} />
				<Field
					name="last_name"
					label={LastNameLabel}
					component={ReduxTextField}
					validate={[required]}
					disabled={loading} />
				<Field
					name="email"
					label={EmailLabel}
					component={ReduxTextField}
					validate={[required, email]}
					disabled={loading} />
				<Field
					name="mobile"
					label={<div>{MobileLabel} <LabelAside>{OptionalLabel}</LabelAside></div>}
					component={ReduxTextField}
					validate={[phoneNumber]}
					disabled={loading} />
				<Field
					name="text"
					label={ContactTextLabel}
					component={ReduxTextAreaField}
					rows={3}
					validate={[required]}
					disabled={loading} />

				<CommandBar>
					<PrimaryButton>
						{SubmitLabel}
					</PrimaryButton>
					<PrimaryLink as="button" type="button" hasIcon iconClassName="icon icon-cancel" onClick={onCancel}>
						{CancelLabel}
					</PrimaryLink>
				</CommandBar>

				{loading && <LoadingOverlay />}
			</form>
		)}
	</Localized>
);

ContactUsForm.propTypes = {
	...propTypes,

	loading: PropTypes.bool,
	onCancel: PropTypes.func
};
 
export default reduxForm({
	form: 'contactUs'
})(ContactUsForm);