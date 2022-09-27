import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, propTypes, Field } from 'redux-form';
import { ReduxDateField } from 'components/Forms/DateField';
import { ReduxTextField } from 'components/Forms/TextField';
import FormSection from 'components/Forms/FormSection';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import CommandBar from 'components/Layout/CommandBar';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import { ReduxDealerField } from 'routes/Employer/components/DealerField';
import moment from 'moment';
import Localized from 'components/Localization/Localized';
import './TransactionsFilterForm.css';

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

const TransactionsFilterForm = ({ loading, handleSubmit, initialize }) => {
	const handleClear = () => {
		initialize({});
		setTimeout(() => handleSubmit());
	};
	
	return (
		<Localized names={['Common', 'Employer', 'Admin']}>
			{({
				FromDateLabel,
				ToDateLabel,
				InvoiceNoLabel,
				DealerLabel,
				AllDealersPlaceholder,
				SearchLabel,
				ResetLabel
			}) => (
				<form className="transactions-filter-form" noValidate onSubmit={handleSubmit}>
					<FormSection className="transactions-filter-form-section">
						<Field
							label={FromDateLabel}
							name="from"
							component={ReduxDateField}
							validate={[validateFrom]}
							disabled={loading} />

						<Field
							label={ToDateLabel}
							name="to"
							component={ReduxDateField}
							validate={[validateTo]}
							disabled={loading} />
					</FormSection>

					<FormSection className="transactions-filter-form-section">
						<Field
							label={InvoiceNoLabel}
							name="invoiceNo"
							component={ReduxTextField}
							disabled={loading} />

						<Field
							label={DealerLabel}
							name="dealer"
							component={ReduxDealerField}
							allDealers
							nullLabel={AllDealersPlaceholder}
							placeholder={AllDealersPlaceholder}
							disabled={loading} />
					</FormSection>

					<CommandBar className="transactions-filter-form-commands">
						<PrimaryButton as="button" type="submit">
							{SearchLabel}
						</PrimaryButton>
						<PrimaryLink as="button" type="button" hasIcon iconClassName="icon icon-cancel" onClick={handleClear}>
							{ResetLabel}
						</PrimaryLink>
					</CommandBar>
				</form>
			)}
		</Localized>
	);
};

TransactionsFilterForm.propTypes = {
	...propTypes,

	loading: PropTypes.bool
};
 
export default reduxForm({
	form: 'transactionsFilter'
})(TransactionsFilterForm);