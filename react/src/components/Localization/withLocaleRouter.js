import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { extractPathname, buildPathname } from './helpers';
import { locale } from 'redux/selectors';
import { useSelector } from 'react-redux';
import { normalizeLocation } from 'utils/router';

const withLocaleRouter = WrappedComponent => {
	// eslint-disable-next-line no-unused-vars
	let WrapperComponent = React.forwardRef(({ location, history, match, staticContext, ...otherProps }, ref) => {
		const currentLocale = useSelector(locale);
		
		const pathname = useMemo(() => extractPathname(location.pathname), [location.pathname]);

		const setLocale = useCallback(locale => {
			const newLocale = {
				...currentLocale,
				...locale
			};

			history.replace({
				...location,
				pathname: buildPathname(newLocale, pathname)
			});
		}, [pathname, location, history, currentLocale]);

		const localeHistory = useMemo(() => {
			const localeLocation = {
				...location,

				key: undefined,
				pathname: extractPathname(location.pathname)
			};

			const expandLocation = (loc, locale = currentLocale) => {
				const normalized = normalizeLocation(loc, localeLocation);
				if(normalized)
					return {
						...normalized,
						...normalizeLocation(buildPathname(locale, normalized.pathname))
					};
			};

			return {
				location: localeLocation,
				expandLocation,

				push: (location, expand = true) => {
					history.push(expand ? expandLocation(location) : location);
				},
				replace: (location, expand = true) => {
					history.replace(expand ? expandLocation(location) : location);
				}
			};
		}, [history, location, currentLocale]);

		const localeLocation = useMemo(() => localeHistory.location, [localeHistory]);

		return (
			<WrappedComponent 
				{...otherProps} 
				ref={ref}
				
				locale={currentLocale} 
				setLocale={setLocale}
				history={localeHistory}
				location={localeLocation}
				match={match} />
		);
	});

	WrapperComponent.displayName = `withLocaleRouterInner(${WrappedComponent.displayName || WrappedComponent.name})`;

	WrapperComponent.propTypes = {
		location: PropTypes.object.isRequired,
		history: PropTypes.object.isRequired,
		match: PropTypes.object,
		staticContext: PropTypes.any
	};

	WrapperComponent = withRouter(WrapperComponent);

	const ForwardRefComponent = React.forwardRef((props, ref) => (
		<WrapperComponent {...props} wrappedComponentRef={ref} />
	));

	ForwardRefComponent.displayName = `withLocaleRouter(${WrappedComponent.displayName || WrappedComponent.name})`;

	return ForwardRefComponent;
};

export default withLocaleRouter;