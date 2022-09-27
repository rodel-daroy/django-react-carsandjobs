import React from 'react';
import PropTypes from 'prop-types';
import { Field, propTypes, formValueSelector } from 'redux-form';
import FormSection from 'components/Forms/FormSection';
import omit from 'lodash/omit';
import { ReduxTextField } from 'components/Forms/TextField';
import { postalCanada, requiredIfNotChecked, required } from 'utils/validation';
import { connect } from 'react-redux';
import { language } from 'redux/selectors';
import Localized from 'components/Localization/Localized';
import { ReduxLocationField } from 'components/Forms/LocationField';
import { ReduxCheckboxField } from 'components/Forms/CheckboxField';
import { ReduxDropdownField } from 'components/Forms/DropdownField';
import { getProvinceOptions } from 'components/Forms/ProvinceOptions';
import LabelAside from 'components/Forms/LabelAside';

const requiredCityProvince = requiredIfNotChecked('cityProvince');

// eslint-disable-next-line no-unused-vars
const JobLocationForm = ({ loading, readOnly, confidentialLocation, language, validate, ...otherProps }) => (
	<Localized names={['Common', 'Jobs', 'Employer']}>
		{({ 
			LocationTitle, 
			StreetLabel, 
			CityLabel, 
			PostalCodeLabel, 
			ProvinceLabel, 
			ConfidentialLocationLabel, 
			OptionalLabel,
			FromTemplateLabel 
		}) => (
			<FormSection 
				{...omit(otherProps, Object.keys(propTypes))} 
				
				title={<h2>{LocationTitle}</h2>}>

				<Field
					name="confidentialLocation"
					label={ConfidentialLocationLabel}
					component={ReduxCheckboxField}
					disabled={loading}
					readOnly={readOnly}
					autofilledText={FromTemplateLabel} />

				{!confidentialLocation && (
					<FormSection>
						<Field
							name="cityProvince"
							label={`${CityLabel} / ${ProvinceLabel}`}
							component={ReduxLocationField}
							validate={[requiredCityProvince]}
							disabled={loading}
							readOnly={readOnly}
							autofilledText={FromTemplateLabel} />

						<Field
							name="address"
							label={(
								<div>
									{StreetLabel}
									<LabelAside>{OptionalLabel}</LabelAside>
								</div>
							)}
							component={ReduxTextField}
							disabled={loading}
							readOnly={readOnly}
							autofilledText={FromTemplateLabel} />
		
						<Field
							name="postalCode"
							label={(
								<div>
									{PostalCodeLabel}
									<LabelAside>{OptionalLabel}</LabelAside>
								</div>
							)}
							component={ReduxTextField}
							validate={[postalCanada]}
							disabled={loading}
							readOnly={readOnly}
							autofilledText={FromTemplateLabel} />
					</FormSection>
				)}

				{confidentialLocation && (
					<FormSection>
						<Field
							name="province"
							label={ProvinceLabel}
							component={ReduxDropdownField}
							options={getProvinceOptions(language)}
							validate={[required]}
							disabled={loading}
							readOnly={readOnly}
							autofilledText={FromTemplateLabel} />
					</FormSection>
				)}
			</FormSection>
		)}
	</Localized>
);

JobLocationForm.propTypes = {
	loading: PropTypes.bool,
	readOnly: PropTypes.bool,
	validate: PropTypes.func,

	language: PropTypes.string.isRequired,
	confidentialLocation: PropTypes.bool
};

JobLocationForm.shortTitle = 'LocationShortTitle';
JobLocationForm.formName = 'location';

const mapStateToProps = (state, { form }) => ({
	language: language(state),
	confidentialLocation: formValueSelector(form)(state, 'confidentialLocation')
});
 
export default connect(mapStateToProps)(JobLocationForm);