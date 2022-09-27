import { useEffect, useState } from 'react';
import { getCurrentProvince } from 'utils/geolocation';
import { PROVINCES } from 'config/constants';

const useGeoLocale = required => {
	const [locale, setLocale] = useState(null);
	
	useEffect(() => {
		let cancelled = false;

		if(required) {
			getCurrentProvince()
				.then(province => {
					if(province && !cancelled) {
						const language = PROVINCES.find(([, pro]) => pro === province)[2];

						setLocale({
							region: province,
							language
						});
					}
				});
		}
		else
			setLocale(null);

		return () => {
			cancelled = true;
		};
	}, [required]);

	return locale;
};

export default useGeoLocale;