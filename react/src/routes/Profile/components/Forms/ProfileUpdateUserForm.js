import React from 'react';
import PropTypes from 'prop-types';
import { Field, propTypes } from 'redux-form';
import { ReduxTextField } from 'components/Forms/TextField';
import { required, phoneNumber } from 'utils/validation';
import FormSection from 'components/Forms/FormSection';
import omit from 'lodash/omit';
import Localized from 'components/Localization/Localized';

const ProfileUpdateUserForm = ({ loading, ...otherProps }) => (
	<Localized names={['Common', 'Profile']}>
		{({ FirstNameLabel, LastNameLabel, PhoneLabel, MobileLabel, UserInfoTitle }) => (
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
					name="cellPhone"
					label={MobileLabel}
					component={ReduxTextField}
					type="tel"
					validate={[phoneNumber]}
					disabled={loading}
					size="small" />

			</FormSection>
		)}
	</Localized>
);

ProfileUpdateUserForm.propTypes = {
	loading: PropTypes.bool
};

ProfileUpdateUserForm.shortTitle = 'UserInfoShortTitle';
ProfileUpdateUserForm.formName = 'userInfo';

export default ProfileUpdateUserForm;