import React from 'react';
import PropTypes from 'prop-types';
import { authOrigin } from 'redux/selectors';
import { connect } from 'react-redux';
import mapping from './mapping';

const componentForOrigin = (type, map = mapping) => {
	let wrapperComponent = ({ origin, ...otherProps }) => {
		const Component = map[origin][type];

		return (
			<Component {...otherProps} />
		);
	};

	wrapperComponent.propTypes = {
		origin: PropTypes.string.isRequired
	};

	wrapperComponent.displayName = `componentForOrigin(${type})`;

	const mapStateToProps = (state, { origin }) => ({
		origin: origin || authOrigin(state)
	});
	
	wrapperComponent = connect(mapStateToProps)(wrapperComponent);

	return wrapperComponent;
};

export default componentForOrigin;