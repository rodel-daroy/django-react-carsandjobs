import React from 'react';
import PropTypes from 'prop-types';
import { Field, propTypes } from 'redux-form';
import { ReduxCheckboxField } from 'components/Forms/CheckboxField';
import FormSection from 'components/Forms/FormSection';
import omit from 'lodash/omit';
import Localized from 'components/Localization/Localized';

const ProfilePrivacyForm = ({ loading, ...otherProps }) => (
	<Localized names="Profile">
		{({ VisibleNewGraduateLabel, VisibleCoopStudentLabel, PrivacyTitle }) => (
			<FormSection {...omit(otherProps, Object.keys(propTypes))} title={<h2>{PrivacyTitle}</h2>}>
				<Field
					name="newGraduate"
					label={VisibleNewGraduateLabel}
					component={ReduxCheckboxField}
					disabled={loading} />

				<Field
					name="coopStudent"
					label={VisibleCoopStudentLabel}
					component={ReduxCheckboxField}
					disabled={loading} />
			</FormSection>
		)}
	</Localized>
);

ProfilePrivacyForm.propTypes = {
	loading: PropTypes.bool
};

ProfilePrivacyForm.shortTitle = 'PrivacyShortTitle';
ProfilePrivacyForm.formName = 'privacy';

export default ProfilePrivacyForm;