import React from 'react';
import { urlSearchToObj, mergeUrlSearch } from 'utils/url';
import pick from 'lodash/pick';
import zipObject from 'lodash/zipObject';
import lowerCase from 'lodash/lowerCase';
import intersection from 'lodash/intersection';
import { JobFilterPropTypes } from 'types/jobs';
import { formatLocation } from 'utils/format';

export const FILTER_MASK = zipObject(Object.keys(JobFilterPropTypes), Object.keys(JobFilterPropTypes).map(() => null));

export const parseFilter = search => {
	const obj = typeof search === 'object' ? search : urlSearchToObj(search);

	let age = parseInt(obj.age, 10);
	if(isNaN(age))
		age = null;

	let location = null;
	if(typeof obj.location === 'string') {
		const [city, province] = obj.location.split(',').map(l => l.trim());

		location = {
			city,
			province
		};
	}

	const filter = {
		keywords: obj.keywords || null,
		location,
		category: obj.category || null,
		department: obj.department || null,
		positionType: obj.positionType || null,
		experience: obj.experience || null,
		education: obj.education || null,
		age
	};

	return filter;
};

export const filterToUrlSearch = filter => {
	let { location, ...other } = filter;

	if(location && typeof location === 'object')
		location = `${location.city},${location.province}`;

	other = pick(other, Object.keys(other).filter(key => other[key] != null));

	const flatFilter = {
		...other
	};
	if(location)
		flatFilter.location = location;

	return '?' + new URLSearchParams(flatFilter).toString();
};

export const formatFilter = (filter, { departments, positionTypes, experiences, educations, categories } = {}, language, withinLastDaysFormat = '') => {
	const findLookupName = (value, lookup) => {
		const lookupItem = (lookup || []).find(l => l.id === value);

		if(lookupItem)
			return lookupItem.name[language];
		else
			return null;
	};

	let entries = [];
	for(let [key, value] of Object.entries(filter)) {
		if(value !== null) {
			switch(key) {
				case 'category': {
					value = findLookupName(value, categories);
					break;
				}

				case 'department': {
					value = findLookupName(value, departments);
					break;
				}

				case 'positionType': {
					value = findLookupName(value, positionTypes);
					break;
				}

				case 'experience': {
					value = findLookupName(value, experiences);
					break;
				}

				case 'education': {
					value = findLookupName(value, educations);
					break;
				}

				case 'location': {
					value = formatLocation(value);
					break;
				}

				case 'age': {
					value = withinLastDaysFormat.replace('[0]', value);
					break;
				}

				default:
					value = (
						<React.Fragment>
							<span className="filter-key">{lowerCase(key)}:</span> {value}
						</React.Fragment>
					);
					break;
			}

			entries.push(value);
		}
	}

	return (
		<React.Fragment>
			{entries.map((entry, i) => (
				<span key={i}>{entry}</span>
			))}
		</React.Fragment>
	);
};

export const getFilterBreadcrumbs = (basePath, search, lookups, urlSearch, language, withinLastDaysFormat) => {
	const filter = new URLSearchParams(search);
	const keys = intersection(Array.from(filter.keys()), Object.keys(FILTER_MASK));

	let paths = [];
	for (let i = 0; i < keys.length; ++i) {
		const params = new URLSearchParams(search);

		for (let j = i + 1; j < keys.length; ++j)
			params.delete(keys[j]);

		const newSearch = mergeUrlSearch(urlSearchToObj(params), urlSearch);

		const path = basePath + newSearch;
		const partialFilter = pick(parseFilter(params.toString()), [keys[i]]);

		paths.push({
			path,
			name: formatFilter(partialFilter, lookups, language, withinLastDaysFormat)
		});
	}

	return paths;
};

export const updateFilter = (filter, { location, history }, ...otherParams) => {
	const search
		= mergeUrlSearch(location.search, 
			FILTER_MASK, 
			filterToUrlSearch(filter), 
			...otherParams);

	history.push(location.pathname + search);
};