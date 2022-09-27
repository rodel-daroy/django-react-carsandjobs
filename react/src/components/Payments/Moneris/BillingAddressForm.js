import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, propTypes, formValueSelector } from 'redux-form';
import { ReduxTextField } from 'components/Forms/TextField';
import { ReduxDropdownField } from 'components/Forms/DropdownField';
import { required, intlPhoneNumber, postalCanada } from 'utils/validation';
import CommandBar from 'components/Layout/CommandBar';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import countryByName from 'country-json/src/country-by-name.json';
import { getProvinceOptions } from 'components/Forms/ProvinceOptions';
import { connect } from 'react-redux';
import './BillingAddressForm.css';

const BillingAddressForm = ({ handleSubmit, currentCountry }) => {
	const countryOptions = countryByName.map(({ country }) => ({
		label: country,
		value: country
	}));

	const isCanada = currentCountry === 'Canada';
	const postalCodeValidation = isCanada ? [required, postalCanada] : [required];

	return (
		<form className="billing-address-form" onSubmit={handleSubmit}>
			<div className="billing-address-form-row">
				<Field
					name="bill_first_name"
					label="First name"
					component={ReduxTextField}
					validate={[required]} />
				<Field
					name="bill_last_name"
					label="Last name"
					component={ReduxTextField}
					validate={[required]} />
			</div>

			<Field
				name="bill_company_name"
				label="Company name"
				component={ReduxTextField} />
			<Field
				name="bill_address_one"
				label="Address"
				component={ReduxTextField}
				validate={[required]} />

			<div className="billing-address-form-row">
				<Field
					name="bill_city"
					label="City"
					component={ReduxTextField}
					validate={[required]} />

				{isCanada && (
					<Field
						name="bill_state_or_province"
						label="Province/State"
						component={ReduxDropdownField}
						options={getProvinceOptions('en', true)}
						validate={[required]} />
				)}

				{!isCanada && (
					<Field
						name="bill_state_or_province"
						label="Province/State"
						component={ReduxTextField}
						validate={[required]} />
				)}
			</div>

			<div className="billing-address-form-row">
				<Field
					name="bill_postal_code"
					label="Postal code"
					component={ReduxTextField}
					validate={postalCodeValidation} />
				<Field
					name="bill_country"
					label="Country"
					component={ReduxDropdownField}
					options={countryOptions}
					validate={[required]} />
			</div>

			<Field
				name="bill_phone"
				label="Phone"
				component={ReduxTextField}
				validate={[required, intlPhoneNumber]} />

			<CommandBar>
				<PrimaryButton type="submit">
					Continue
				</PrimaryButton>
			</CommandBar>
		</form>
	);
};

BillingAddressForm.propTypes = {
	...propTypes,

	currentCountry: PropTypes.string
};

const mapStateToProps = (state, { form }) => {
	const formValue = formValueSelector(form);

	return {
		currentCountry: formValue(state, 'bill_country')
	};
};

export default reduxForm({
	form: 'billingAddress',
	initialValues: {
		bill_country: 'Canada'
	}
})(connect(mapStateToProps)(BillingAddressForm));