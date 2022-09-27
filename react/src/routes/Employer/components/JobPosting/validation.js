import { phoneNumber, emailList } from 'utils/validation';
import moment from 'moment';

const validate = (values) => {
	let errors = {};
	let contactErrors = {};

	if(values.applyByEmail)
		contactErrors.email = emailList(values.email);

	if(values.applyByFax)
		contactErrors.fax = phoneNumber(values.fax);

	if(values.applyByPhone)
		contactErrors.phone = phoneNumber(values.phone);

	if(Object.keys(contactErrors).length > 0)
		errors = { ...errors, ...contactErrors };

	return errors;
};

export default validate;

export const getPreview = (normalizedValues, dealers) => {
	/* eslint-disable no-unused-vars */
	let { dealer: dealerId, postDate, confidential, ...otherValues } = normalizedValues;
	/* eslint-enable */

	let company;
	if(!confidential) {
		const dealer = dealers.find(d => d.id === dealerId);

		company = {
			name: dealer.name
		};
	}

	let preview = {
		...otherValues,

		company,

		postDate: moment().toISOString()
	};

	return preview;
};