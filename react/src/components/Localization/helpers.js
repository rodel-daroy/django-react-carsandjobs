import { PROVINCES, LANGUAGES } from 'config/constants';
import pathToRegexp from 'path-to-regexp';

export const validateRegion = (region = '') => PROVINCES.map(([, province]) => province).find(province => province.toLowerCase() === region.toLowerCase());
export const validateLanguage = (language = '') => LANGUAGES.map(([, lang]) => lang).find(lang => lang.toLowerCase() === language.toLowerCase());

export const validateLocale = ({ region, language } = {}) => {
	region = validateRegion(region);
	language = validateLanguage(language);

	if(region && language)
		return {
			region,
			language
		};

	return undefined;
};

export const getCanonicalUrl = ({ region, language }, { pathname, search, hash }) => {
	return `${window.location.origin}/${region}/${language}${pathname}${search || ''}${hash || ''}`;
};

export const LOCALE_PATH = '/:region/:language';

const LOCALE_REGEX = pathToRegexp(LOCALE_PATH, [], { end: false });
const ROUTE_REGEX = new RegExp(LOCALE_REGEX.source + '(.*)', 'i');

export const extractPathname = pathname => {
	const result = ROUTE_REGEX.exec(pathname);

	if(result) {
		const region = validateRegion(result[1]);
		const language = validateLanguage(result[2]);

		if(region && language)
			return result[3] || '/';
	}

	return pathname;
};

export const buildPathname = ({ region, language }, pathname = '') => `/${region}/${language}${pathname}`;

export const areLocalesEqual = (locale1 = {}, locale2 = {}) => {
	return locale1.region === locale2.region && locale1.language === locale2.language;
};