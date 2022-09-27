import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { locale } from 'redux/selectors';
import { setLocale } from 'redux/actions/localization';
import { validateLocale, LOCALE_PATH, buildPathname, areLocalesEqual } from './helpers';
import useGeoLocale from './useGeoLocale';
import { getHostLocale } from 'utils/localization';

const LocaleRoutes = ({ children }) => {
	const dispatch = useDispatch();

	const currentLocale = useSelector(locale);
	const isUserLocale = useSelector(state => state.localization.current.userLocale);

	const geoLocale = useGeoLocale(!isUserLocale && !getHostLocale());

	return (
		<Route path={LOCALE_PATH}>
			{({ match, location }) => {
				if(match) {
					const pathLocale = validateLocale(match.params);

					if(pathLocale) {
						const pathname = location.pathname.slice(match.url.length);

						if(geoLocale && !areLocalesEqual(geoLocale, pathLocale))
							return (
								<Redirect
									to={{
										...location,
										pathname: buildPathname(geoLocale, pathname)
									}} />
							);
						else {
							if(!areLocalesEqual(currentLocale, pathLocale))
								dispatch(setLocale({ ...pathLocale, userLocale: true }));
						}

						return children(match.url);
					}
				}

				return (
					<Redirect 
						to={{
							...location,
							pathname: buildPathname(geoLocale || currentLocale, location.pathname)
						}} />
				);
			}}
		</Route>
	);
};

LocaleRoutes.propTypes = {
	children: PropTypes.func.isRequired
};
 
export default LocaleRoutes;