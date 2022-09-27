import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import withLocaleRouter from './withLocaleRouter';

// eslint-disable-next-line no-unused-vars, react/prop-types
let LocaleLinkInner = ({ to, as: Component, locale, setLocale, history, location, match, innerRef, ...otherProps }) => {
	const newTo = history.expandLocation(to);

	return (
		<Component ref={innerRef} {...otherProps} to={newTo} />
	);
};

LocaleLinkInner.propTypes = {
	to: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
	as: PropTypes.any,

	locale: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired
};

LocaleLinkInner.defaultProps = {
	as: Link
};

LocaleLinkInner = withLocaleRouter(LocaleLinkInner);

const LocaleLink = React.forwardRef((props, ref) => (
	<LocaleLinkInner innerRef={ref} {...props} />
));

LocaleLink.displayName = 'LocaleLink';
 
export default LocaleLink;