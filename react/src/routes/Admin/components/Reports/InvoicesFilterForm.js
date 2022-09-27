import React from 'react';
import PropTypes from 'prop-types';
import { propTypes, Field, reduxForm } from 'redux-form';
import { ReduxDealerField } from 'routes/Employer/components/DealerField';
import { ReduxTextField } from 'components/Forms/TextField';
import CommandBar from 'components/Layout/CommandBar';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import FormSection from 'components/Forms/FormSection';
import Localized from 'components/Localization/Localized';
import { ReduxDropdownField } from 'components/Forms/DropdownField';
import { getProvinceOptions } from 'components/Forms/ProvinceOptions';
import { connect } from 'react-redux';
import { language } from 'redux/selectors';
import { ReduxDateField } from 'components/Forms/DateField';
import moment from 'moment';
import './InvoicesFilterForm.css';

const validateFrom = (value, { to }) => {
	if(value && to) {
		if(moment(value).isSameOrAfter(to))
			return { key: 'BeforeToDateErrorMessage' };
	}

	return undefined;
};

const validateTo = (value, { from }) => {
	if(value && from) {
		if(moment(value).isSameOrBefore(from))
			return { key: 'AfterFromDateErrorMessage' };
	}

	return undefined;
};

const InvoicesFilterForm = ({ handleSubmit, loading, initialize, language, onExport }) => {
	const handleClear = () => {
		initialize({});
		setTimeout(() => handleSubmit());
	};

	return (
		<Localized names={['Common', 'Employer', 'Admin']}>
			{({
				DealerLabel,
				AllDealersPlaceholder,
				InvoiceNoLabel,
				SearchLabel,
				ResetLabel,
				ProvinceLabel,
				FromDateLabel,
				ToDateLabel,
				ExportLabel
			}) => (
				<form className="invoices-filter-form" noValidate onSubmit={handleSubmit}>
					<FormSection className="invoices-filter-form-section">
						<Field
							name="from"
							label={FromDateLabel}
							component={ReduxDateField}
							validate={[validateFrom]} />

						<Field
							name="to"
							label={ToDateLabel}
							component={ReduxDateField}
							validate={[validateTo]} />

						<Field
							name="invoiceNo"
							label={InvoiceNoLabel}
							component={ReduxTextField}
							disabled={loading} />

						<Field
							name="dealer"
							label={DealerLabel}
							component={ReduxDealerField}
							allDealers
							nullLabel={AllDealersPlaceholder}
							placeholder={AllDealersPlaceholder}
							disabled={loading} />

						<Field
							name="province"
							label={ProvinceLabel}
							component={ReduxDropdownField}
							options={getProvinceOptions(language)} />
					</FormSection>

					<CommandBar>
						<PrimaryButton type="submit">
							{SearchLabel}
						</PrimaryButton>
						<PrimaryLink 
							as="button" 
							type="button" 
							onClick={handleClear} 
							hasIcon 
							iconClassName="icon icon-cancel">

							{ResetLabel}
						</PrimaryLink>
						<CommandBar.Separator />
						<PrimaryLink
							as="button"
							type="button"
							onClick={handleSubmit(onExport)}
							hasIcon
							iconClassName="icon icon-export">
							
							{ExportLabel}
						</PrimaryLink>
					</CommandBar>
				</form>
			)}
		</Localized>
	);
};

InvoicesFilterForm.propTypes = {
	...propTypes,

	onExport: PropTypes.func.isRequired,

	loading: PropTypes.bool,

	language: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
	language: language(state)
});
 
export default connect(mapStateToProps)(reduxForm({
	form: 'invoicesFilter'
})(InvoicesFilterForm));