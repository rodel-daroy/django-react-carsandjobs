import { urlSearchToObj, mergeUrlSearch } from 'utils/url';
import pick from 'lodash/pick';
import zipObject from 'lodash/zipObject';
import { ProgrammeFilterPropTypes } from 'types/education';

export const FILTER_MASK = {
	...zipObject(Object.keys(ProgrammeFilterPropTypes), Object.keys(ProgrammeFilterPropTypes).map(() => null)),

	location: null
};

export const parseFilter = search => {
	const obj = typeof search === 'object' ? search : urlSearchToObj(search);

	const filter = {
		...obj,
		
		department: obj.department || null,
		province: obj.province || null
	};

	delete filter.location;

	return filter;
};

export const filterToUrlSearch = filter => {
	const provided = pick(filter, Object.keys(FILTER_MASK).filter(key => filter[key] != null));

	return '?' + new URLSearchParams(provided).toString();
};

export const updateFilter = (filter, { location, history }, ...otherParams) => {
	const search
		= mergeUrlSearch(location.search, 
			FILTER_MASK, 
			filterToUrlSearch(filter),
			...otherParams);

	history.push(location.pathname + search);
};