import moment from 'moment';
import { isoDateString } from 'utils/format';
import capitalize from 'lodash/capitalize';
import omit from 'lodash/omit';
import { LANGUAGES, POSTING_EDIT_DAYS } from 'config/constants';
import { getLanguageValue } from 'utils';
import { geocodeLocationPosition, geocodeProvincePosition } from 'services/here';

export const normalizeJobPosting = async values => {
	let {
		dealer,
		address,
		cityProvince,
		postalCode,
		confidentialLocation,
		department,
		language,
		latitude,
		longitude,

		...otherValues
	} = values;

	if(typeof dealer === 'object')
		dealer = dealer.id;

	department = department.filter(d => !!d);

	const postDate = moment();
	const closingDate = moment().add(30, 'days');

	let city, province;
	let position = {
		latitude,
		longitude
	};
	if(confidentialLocation) {
		address = null;
		city = null;
		province = values.province;
		postalCode = null;

		position = {
			...position,
			...await geocodeProvincePosition({ province })
		};
	}
	else {
		city = cityProvince.city;
		province = cityProvince.province;

		position = {
			...position,
			...await geocodeLocationPosition(cityProvince)
		};
	}

	let availableForLang = {};
	for(const [, lang] of LANGUAGES) {
		const key = `availableFor${capitalize(lang)}`;
		availableForLang[key] = language === lang;
	}

	return {
		...otherValues,
		dealer,
		department,
		language,
		address,
		city,
		province,
		...position,
		postalCode,
		...availableForLang,

		postDate: isoDateString(postDate),
		closingDate: isoDateString(closingDate)
	};
};

const unlocalizeJobPosting = values => {
	const { language } = values;

	return {
		...values,

		title: getLanguageValue(values.title, language),
		salary: getLanguageValue(values.salary, language),
		description: getLanguageValue(values.description, language)
	};
};

export const denormalizeJobPosting = values => {
	if(values) {
		let {
			dealer,
			contact,
			location: {
				address,
				city,
				province,
				postalCode,
				latitude,
				longitude
			},

			...otherValues
		} = values;

		if(typeof dealer === 'object')
			dealer = dealer.id;

		let language;
		for(const [, lang] of LANGUAGES) {
			const key = `availableFor${capitalize(lang)}`;

			if(otherValues[key]) {
				language = lang;
				break;
			}
		}

		otherValues = omit(otherValues, LANGUAGES.map(([, lang]) => `availableFor${capitalize(lang)}`));
		otherValues.language = language;

		let location = {
			confidentialLocation: true
		};

		let cityProvince = null;
		if(city && province)
			cityProvince = {
				city,
				province,
				latitude,
				longitude
			};

		if(cityProvince || address || postalCode)
			location = {
				cityProvince,
				address,
				postalCode
			};

		let initialValues = {
			dealer,
			...contact,
			...location,
			latitude,
			longitude,

			...unlocalizeJobPosting(otherValues)
		};

		return initialValues;
	}
	else
		return null;
};

export const canEditJobPosting = ({ isPublished, postDate, closingDate }, allowAfterClosingDate = false) => {
	const isAfterClosingDate = allowAfterClosingDate && isPublished && (moment().isAfter(moment(closingDate)));
	return !isPublished || isAfterClosingDate || (moment().diff(moment(postDate), 'days', true) <= POSTING_EDIT_DAYS);
};

export const isJobPostingOpen = ({ isPublished, closingDate }) => isPublished && moment(closingDate).isAfter(moment());
export const isJobPostingClosed = ({ isPublishedEver, isPublished, closingDate }) => isPublishedEver && (!isPublished || moment(closingDate).isBefore(moment()));

export const isJobPostingActive = posting => !posting.isPublished || isJobPostingOpen(posting);

export const isJobPostingEnded = ({ isPublishedEver, closingDate }) => isPublishedEver && moment(closingDate).isBefore(moment());

export const lookupValue = (value, lookup, language) => {
	if(value && lookup) {
		const item = lookup.find(l => l.id === value);
		if(item)
			return item.name[language];
		else
			return null;
	}
	else
		return null;
};