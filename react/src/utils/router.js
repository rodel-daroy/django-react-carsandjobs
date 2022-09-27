export const getNextLink = (nextLink, location) => {
	if(typeof nextLink !== 'object')
		nextLink = { pathname: nextLink };

	return {
		...nextLink,
		state: {
			...(nextLink.state || {}),
			prev: location
		}
	};
};

export const getPrevLink = (location, defaultLink = '/') => {
	if(location.state && location.state.prev)
		return location.state.prev;

	return defaultLink;
};

export const normalizeLocation = (location, { pathname: currentPathname } = {}) => {
	if(typeof location === 'string') {
		const [, pathname, search, hash] = /^(\/[^\\?#]*)?(\\?[^#]+)?(#.+)?$/g.exec(location) || [];

		const result = {
			pathname: pathname || currentPathname 
		};
		if(search)
			result.search = search;
		if(hash)
			result.hash = hash;

		return result;
	}
	else
		return location;
};

export const locationToUrl = ({ pathname, search, hash }) => `${window.location.origin}${pathname}${search || ''}${hash || ''}`;