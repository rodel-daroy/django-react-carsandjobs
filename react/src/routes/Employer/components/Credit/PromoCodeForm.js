import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, propTypes } from 'redux-form';
import { ReduxTextField } from 'components/Forms/TextField';
import { required } from 'utils/validation';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import CommandBar from 'components/Layout/CommandBar';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import Localized from 'components/Localization/Localized';

const PromoCodeForm = ({ handleSubmit, loading, onCancel }) => (
	<Localized names={['Common', 'Employer']}>
		{({ ApplyLabel, CancelLabel, PromoCodeLabel }) => (
			<form noValidate onSubmit={handleSubmit}>
				<Field
					name="promoCode"
					label={PromoCodeLabel}
					component={ReduxTextField}
					disabled={loading}
					validate={[required]} />

				<CommandBar>
					<PrimaryButton type="submit" disabled={loading}>
						{ApplyLabel}
					</PrimaryButton>
					<PrimaryLink as="button" type="button" onClick={onCancel} hasIcon iconClassName="icon icon-cancel" disabled={loading}>
						{CancelLabel}
					</PrimaryLink>
				</CommandBar>
			</form>
		)}
	</Localized>
);

PromoCodeForm.propTypes = {
	...propTypes,

	loading: PropTypes.bool,
	onCancel: PropTypes.func.isRequired
};
 
export default reduxForm({
	form: 'promoCode'
})(PromoCodeForm);