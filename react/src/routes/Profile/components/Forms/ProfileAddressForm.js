import React from 'react';
import PropTypes from 'prop-types';
import { Field, propTypes } from 'redux-form';
import { ReduxTextField } from 'components/Forms/TextField';
import { ReduxDropdownField } from 'components/Forms/DropdownField';
import FormSection from 'components/Forms/FormSection';
import { getProvinceOptions } from 'components/Forms/ProvinceOptions';
import { postalCanada, required } from 'utils/validation';
import omit from 'lodash/omit';
import { connect } from 'react-redux';
import { language } from 'redux/selectors';
import Localized from 'components/Localization/Localized';

const ProfileAddressForm = ({ loading, language, ...otherProps }) => (
	<Localized names={['Common', 'Profile']}>
		{({ AddressTitle, StreetLabel, CityLabel, PostalCodeLabel, ProvinceLabel }) => (
			<FormSection {...omit(otherProps, Object.keys(propTypes))} title={<h2>{AddressTitle}</h2>}>
				<Field
					name="address.street"
					label={StreetLabel}
					component={ReduxTextField}
					disabled={loading} />

				<Field
					name="address.city"
					label={CityLabel}
					component={ReduxTextField}
					disabled={loading} />

				<Field
					name="address.postalCode"
					label={PostalCodeLabel}
					component={ReduxTextField}
					validate={[postalCanada]}
					disabled={loading}
					size="small" />

				<Field
					name="address.province"
					label={ProvinceLabel}
					component={ReduxDropdownField}
					options={getProvinceOptions(language)}
					validate={[required]}
					disabled={loading} />
			</FormSection>
		)}
	</Localized>
);

ProfileAddressForm.propTypes = {
	loading: PropTypes.bool,

	language: PropTypes.string.isRequired
};

ProfileAddressForm.shortTitle = 'AddressShortTitle';
ProfileAddressForm.formName = 'address';

const mapStateToProps = state => ({
	language: language(state)
});

export default connect(mapStateToProps)(ProfileAddressForm);