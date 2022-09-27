import React from 'react';
import PropTypes from 'prop-types';
import Spinner from './Spinner';
import './LoadingOverlay.css';

const LoadingOverlay = ({ children, scrim }) => (
	<div className={`loading-overlay ${scrim ? 'scrim' : ''}`}>
		<div className="loading-overlay-inner">
			<Spinner />

			{children}
		</div>
	</div>
);

LoadingOverlay.propTypes = {
	children: PropTypes.node,
	scrim: PropTypes.bool
};

export default LoadingOverlay;