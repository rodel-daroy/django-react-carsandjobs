import React from 'react';
import PropTypes from 'prop-types';
import './ViewPanel.css';

const ViewPanel = ({ children, className, scrolling, ...otherProps }) => (
	<div {...otherProps} className={`view-panel ${scrolling ? 'scrolling' : ''} ${className || ''}`}>
		{children}
	</div>
);

ViewPanel.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	scrolling: PropTypes.bool
};

export default ViewPanel;