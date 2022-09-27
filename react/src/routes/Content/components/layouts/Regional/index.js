import React, { useEffect } from 'react';
import Default from '../Default';
import { ContentPropTypes } from '../../types';
import { useSelector } from 'react-redux';
import { region, language } from 'redux/selectors';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import { PROVINCES } from 'config/constants';
import kebabCase from 'lodash/kebabCase';

// eslint-disable-next-line no-unused-vars
const Regional = ({ date, location, match, history, ...otherProps }) => {
	const reg = useSelector(region);
	const lang = useSelector(language);

	const { hash } = location;

	useEffect(() => {
		// on mount, set hash if not currently set
		if(!hash) {
			const province = PROVINCES.find(([, code]) => code === reg);
			const provinceName = province[0][lang];
			const newHash = `#${kebabCase(provinceName)}`;

			history.replace({
				...location,
				hash: newHash
			});
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	
	return (
		<Default {...otherProps} anchorNav />
	);
};

Regional.propTypes = {
	...ContentPropTypes
};
 
export default withLocaleRouter(Regional);