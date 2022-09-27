import React from 'react';
import PropTypes from 'prop-types';
import { urlSearchToObj } from 'utils/url';

const withUrlSearch = WrappedComponent => {
	const WrapperComponent = ({ location, ...props }) => (
		<WrappedComponent {...props} location={location} {...urlSearchToObj(location.search)} />
	);

	WrapperComponent.propTypes = {
		...(WrappedComponent.propTypes || {}),

		location: PropTypes.object.isRequired
	};

	WrapperComponent.displayName = `withUrlSearch(${WrappedComponent.displayName || WrappedComponent.name})`;

	return WrapperComponent;
};

export default withUrlSearch;