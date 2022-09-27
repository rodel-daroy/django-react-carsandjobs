import React from 'react';
import PropTypes from 'prop-types';
import { Field, propTypes, formValueSelector } from 'redux-form';
import FormSection from 'components/Forms/FormSection';
import omit from 'lodash/omit';
import { ReduxTextField } from 'components/Forms/TextField';
import { requiredIfChecked } from 'utils/validation';
import { ReduxTextAreaField } from 'components/Forms/TextAreaField';
import { ReduxCheckboxField } from 'components/Forms/CheckboxField';
import { connect } from 'react-redux';
import Localized from 'components/Localization/Localized';
import LabelAside from 'components/Forms/LabelAside';

const requiredMail = requiredIfChecked('applyByMail');
const requiredFax = requiredIfChecked('applyByFax');
const requiredEmail = requiredIfChecked('applyByEmail');
const requiredPhone = requiredIfChecked('applyByPhone');
const requiredWebsite = requiredIfChecked('applyByWebsite');

const parseEmail = value => {
	if(value)
		return value.replace(/\n/g, ',').replace(/\s/g, '');

	return value;
};

const formatEmail = value => {
	if(value)
		return value.replace(/\s/g, '').replace(/,/g, '\n');

	return value;
};

// eslint-disable-next-line no-unused-vars
const JobApplyByForm = ({ loading, readOnly, applyByMail, applyByFax, applyByEmail, applyByPhone, applyByWebsite, validate, ...otherProps }) => (
	<Localized names={['Common', 'Employer']}>
		{({ 
			ApplyByTitle, 
			MailLabel, 
			FaxLabel, 
			EmailLabel, 
			PhoneLabel, 
			WebsiteLabel,
			FromTemplateLabel,
			MultipleEmailAddressesLabel = 'Enter one or more email addresses on separate lines'
		}) => (
			<FormSection 
				{...omit(otherProps, Object.keys(propTypes))} 
				
				title={<h2>{ApplyByTitle}</h2>}>

				<Field
					name="applyByMail"
					label={MailLabel}
					component={ReduxCheckboxField}
					disabled={loading}
					readOnly={readOnly}
					autofilledText={FromTemplateLabel} />
				{applyByMail && (
					<Field
						name="mailingAddress"
						component={ReduxTextAreaField}
						validate={[requiredMail]}
						disabled={loading || !applyByMail}
						readOnly={readOnly}
						autofilledText={FromTemplateLabel} />
				)}

				<Field
					name="applyByFax"
					label={FaxLabel}
					component={ReduxCheckboxField}
					disabled={loading}
					readOnly={readOnly}
					autofilledText={FromTemplateLabel} />
				{applyByFax && (
					<Field
						name="fax"
						component={ReduxTextField}
						validate={[requiredFax]}
						disabled={loading || !applyByFax}
						readOnly={readOnly}
						autofilledText={FromTemplateLabel} />
				)}

				<Field
					name="applyByEmail"
					label={EmailLabel}
					component={ReduxCheckboxField}
					disabled={loading}
					readOnly={readOnly}
					autofilledText={FromTemplateLabel} />
				{applyByEmail && (
					<Field
						name="email"
						label={(
							<LabelAside>{MultipleEmailAddressesLabel}</LabelAside>
						)}
						component={ReduxTextAreaField}
						validate={[requiredEmail]}
						parse={parseEmail}
						format={formatEmail}
						disabled={loading || !applyByEmail}
						readOnly={readOnly}
						autofilledText={FromTemplateLabel} />
				)}

				<Field
					name="applyByPhone"
					label={PhoneLabel}
					component={ReduxCheckboxField}
					disabled={loading}
					readOnly={readOnly}
					autofilledText={FromTemplateLabel} />
				{applyByPhone && (
					<Field
						name="phone"
						component={ReduxTextField}
						validate={[requiredPhone]}
						disabled={loading || !applyByPhone}
						readOnly={readOnly}
						autofilledText={FromTemplateLabel} />
				)}

				<Field
					name="applyByWebsite"
					label={WebsiteLabel}
					component={ReduxCheckboxField}
					disabled={loading}
					readOnly={readOnly}
					autofilledText={FromTemplateLabel} />
				{applyByWebsite && (
					<Field
						name="website"
						component={ReduxTextField}
						validate={[requiredWebsite]}
						disabled={loading || !applyByWebsite}
						readOnly={readOnly}
						autofilledText={FromTemplateLabel} />
				)}

			</FormSection>
		)}
	</Localized>
);

JobApplyByForm.propTypes = {
	loading: PropTypes.bool,
	readOnly: PropTypes.bool,
	validate: PropTypes.func,

	applyByMail: PropTypes.bool,
	applyByFax: PropTypes.bool,
	applyByEmail: PropTypes.bool,
	applyByPhone: PropTypes.bool,
	applyByWebsite: PropTypes.bool
};

JobApplyByForm.shortTitle = 'ApplyByShortTitle';
JobApplyByForm.formName = 'applyBy';

const mapStateToProps = (state, { form }) => ({
	...formValueSelector(form)(state, 'applyByMail', 'applyByFax', 'applyByEmail', 'applyByPhone', 'applyByWebsite') || {}
});
 
export default connect(mapStateToProps)(JobApplyByForm);