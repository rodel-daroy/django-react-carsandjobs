import { urlSearchToObj, mergeUrlSearch } from 'utils/url';
import pick from 'lodash/pick';
import zipObject from 'lodash/zipObject';
import { ResumeFilterPropTypes } from 'types/employer';

export const FILTER_MASK = zipObject(Object.keys(ResumeFilterPropTypes), Object.keys(ResumeFilterPropTypes).map(() => null));

export const parseFilter = search => {
	const obj = typeof search === 'object' ? search : urlSearchToObj(search);

	let location = null;
	if(typeof obj.location === 'string') {
		const [city, province] = obj.location.split(',');

		location = {
			city,
			province
		};
	}

	let coopStudent = !!parseInt(obj.coopStudent, 10);
	if(!coopStudent)
		coopStudent = null;

	let newGraduate = !!parseInt(obj.newGraduate, 10);
	if(!newGraduate)
		newGraduate = null;

	let filter = {
		keywords: obj.keywords || null,
		...location,
		department: obj.department || null,
		coopStudent,
		newGraduate,
		order: obj.order || '-modifiedDate'
	};

	return filter;
};

export const filterToUrlSearch = filter => {
	let { location, coopStudent, newGraduate, ...other } = filter;

	if(location && typeof location === 'object')
		location = `${location.city},${location.province}`;

	coopStudent = +coopStudent;
	newGraduate = +newGraduate;

	other = pick(other, Object.keys(other).filter(key => other[key] != null));

	const flatFilter = {
		coopStudent,
		newGraduate,

		...other
	};
	if(location)
		flatFilter.location = location;

	return '?' + new URLSearchParams(flatFilter).toString();
};

export const updateFilter = (filter, { location, history }, ...otherParams) => {
	const search
		= mergeUrlSearch(location.search,
			FILTER_MASK,
			filterToUrlSearch(filter),
			...otherParams);

	history.push(location.pathname + search);
};