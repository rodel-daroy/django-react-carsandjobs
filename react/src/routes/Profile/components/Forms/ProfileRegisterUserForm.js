import React from 'react';
import PropTypes from 'prop-types';
import { Field, propTypes } from 'redux-form';
import { ReduxTextField } from 'components/Forms/TextField';
import { ReduxDropdownField } from 'components/Forms/DropdownField';
import { required, phoneNumber } from 'utils/validation';
import { getProvinceOptions } from 'components/Forms/ProvinceOptions';
import FormSection from 'components/Forms/FormSection';
import omit from 'lodash/omit';
import { connect } from 'react-redux';
import { language } from 'redux/selectors';
import Localized from 'components/Localization/Localized';

const ProfileRegisterUserForm = ({ loading, language, ...otherProps }) => (
	<Localized names={['Common', 'Profile']}>
		{({ FirstNameLabel, LastNameLabel, UserInfoTitle, PhoneLabel, ProvinceLabel }) => (
			<FormSection {...omit(otherProps, Object.keys(propTypes))} title={<h2>{UserInfoTitle}</h2>}>
				<Field
					name="firstName"
					label={FirstNameLabel}
					component={ReduxTextField}
					validate={[required]}
					disabled={loading} />

				<Field
					name="lastName"
					label={LastNameLabel}
					component={ReduxTextField}
					validate={[required]}
					disabled={loading} />

				<Field
					name="phone"
					label={PhoneLabel}
					component={ReduxTextField}
					type="tel"
					validate={[phoneNumber]}
					disabled={loading}
					size="small" />

				<Field
					name="province"
					label={ProvinceLabel}
					component={ReduxDropdownField}
					options={getProvinceOptions(language)}
					validate={[required]}
					disabled={loading} />
			</FormSection>
		)}
	</Localized>
);

ProfileRegisterUserForm.propTypes = {
	loading: PropTypes.bool,

	language: PropTypes.string.isRequired
};

ProfileRegisterUserForm.shortTitle = 'UserInfoShortTitle';
ProfileRegisterUserForm.formName = 'userInfo';

const mapStateToProps = state => ({
	language: language(state)
});

export default connect(mapStateToProps)(ProfileRegisterUserForm);