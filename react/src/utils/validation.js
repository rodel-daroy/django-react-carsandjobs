import uniq from 'lodash/uniq';
import get from 'lodash/get';

export const MIN_PASSWORD_LENGTH = 6;

export const required = value => (value ? undefined : { key: 'RequiredError' });
export const numeric = value => (value && Number.isNaN(Number(value)) ? { key: 'NumericError' } : undefined);
export const email = value => (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]+$/i.test(value) ? { key: 'InvalidEmailAddressError' } : undefined);
export const postalCanada = value => (value && !/^([ABCEGHJKLMNPRSTVXY]{1}\d{1}[A-Z]{1} *\d{1}[A-Z]{1}\d{1})$/i.test(value) ? { key: 'InvalidPostalCodeError' } : undefined);
export const phoneNumber = value => (value && !/^(0|[1-9][0-9]{9})$/i.test(value) ? { key: 'InvalidPhoneNumberError' } : undefined);
export const intlPhoneNumber = value => (value && !/^\+?[0-9]{4,}$/i.test(value) ? { key: 'InvalidInternationalPhoneNumberError' } : undefined);
export const passwordLength = value => value.length >= MIN_PASSWORD_LENGTH ? undefined : { key: 'PasswordLengthError', args: [MIN_PASSWORD_LENGTH] };
export const uploadSize = max => files => {
	const totalSize = (files || []).reduce((prev, current) => prev + current.size, 0);

	if(totalSize > max)
		return {
			key: 'FileSizeError',
			args: [max / 1024 / 1024]
		};
	else
		return undefined;
};
export const requiredUpload = (message = { key: 'RequiredError' }) => value => (!value || value.length === 0) ? message : undefined;

export const fieldsMatch = (fieldNames, message = { key: 'FieldValuesMustMatchError' }) => (value, allValues) => {
	const values = fieldNames.map(name => get(allValues, name));

	if(values.every(val => val === values[0]))
		return undefined;
	else
		return message;
};

export const requiredIfChecked = checkField => (value, allValues) => {
	if(get(allValues, checkField) && !value)
		return {
			key: 'RequiredIfCheckedError'
		};
	else
		return undefined;
};

export const requiredIfNotChecked = checkField => (value, allValues) => {
	if(!get(allValues, checkField) && !value)
		return {
			key: 'RequiredError'
		};
	else
		return undefined;
};

export const list = (validateItem, separator = ',') => value => {
	const items = (value || '')
		.split(separator)
		.map(item => item.trim())
		.filter(item => !!item);

	for(const item of items) {
		const validateResult = validateItem(item);
		if(validateResult)
			return validateResult;
	}

	return undefined;
};

export const emailList = list(email);

/*
^\d{5}(-\d{4})?$
Matches all US format zip code formats (e.g., "94105-0011" or "94105")
(^\d{5}(-\d{4})?$)|(^[ABCEGHJKLMNPRSTVXY]{1}\d{1}[A-Z]{1} *\d{1}[A-Z]{1}\d{1}$)
Matches US or Canadian zip codes in above formats.
*/

export const calculatePasswordStrength = password => {
	password = password || '';

	const countedLength = Math.max(0, password.length - MIN_PASSWORD_LENGTH);

	const uniqueChars = uniq([...password]).length;

	const containsDigit = !!password.match(/[0-9]/);
	const containsLowercase = !!password.match(/[a-z]/);
	const containsUppercase = !!password.match(/[A-Z]/);
	const containsSymbol = !!password.match(/[^0-9a-zA-Z]/);

	const finalScore = 
		countedLength * .05
		+ uniqueChars * .01
		+ Number(containsDigit) * .1
		+ Number(containsLowercase) * .1
		+ Number(containsUppercase) * .1
		+ Number(containsSymbol) * .1;

	return Math.min(1, Math.max(0, finalScore)) * 100;
};

