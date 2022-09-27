export const isAbsoluteUrl = url => {
	if(typeof url !== 'string')
		return false;
	
	const regex = /^([a-z0-9]*:|.{0})\/\/.*$/gmi;
	return regex.test(url);
};

export const trimUrl = url => url.replace(/^(www\.)/, '');

export const removeTrailingSlash = url => {
	if(url && url.length > 1 && url.substr(-1) === '/')
		return url.slice(0, -1);
	else
		return url;
};

export const getFileExtension = url => (url || '').split('.').pop();

export const urlSearchToObj = search => {
	const s = new URLSearchParams(search);

	let result = {};
	for(const [key, value] of s.entries())
		result[key] = value;

	return result;
};

export const objToUrlSearch = obj => {
	let s = new URLSearchParams();

	for(const key of Object.keys(obj))
		if(obj[key] != null)
			s.set(key, obj[key]);

	return '?' + s.toString();
};

export const mergeUrlSearchObj = (...searches) => {
	const objs = searches.map(search => {
		if(typeof search === 'string')
			return urlSearchToObj(search);
		else
			return search;
	});

	return Object.assign(...objs);
};

export const mergeUrlSearch = (...searches) => objToUrlSearch(mergeUrlSearchObj(...searches));

export const getDomain = () => window.location.host.split(':')[0];