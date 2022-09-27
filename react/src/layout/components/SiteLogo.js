import React from 'react';
import logoEn from '../img/carsandjobs-logo-en.svg';
import logoFr from '../img/carsandjobs-logo-fr.svg';
import { useSelector } from 'react-redux';
import { language } from 'redux/selectors';
import Localized from 'components/Localization/Localized';

export const LOGOS = {
	en: logoEn,
	fr: logoFr
};

const SiteLogo = props => {
	const lang = useSelector(language);

	return (
		<Localized names="Common">
			{({ SiteTitle }) => (
				<img {...props} src={LOGOS[lang]} alt={SiteTitle} />
			)}
		</Localized>
	);
};
 
export default SiteLogo;