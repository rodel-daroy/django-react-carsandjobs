import { getDomain } from 'utils/url';
import { HOST_DEFAULT_LOCALES, DEFAULT_LOCALE } from 'config/constants';

export const getHostLocale = () => {
	const domain = getDomain();

	for(const [host, locale] of HOST_DEFAULT_LOCALES)
		if(domain.endsWith(host))
			return locale;
};

export const getDefaultLocale = () => getHostLocale() || DEFAULT_LOCALE;