import React from 'react';
import PropTypes from 'prop-types';
import './HeaderStrip.css';

const HeaderStrip = ({ children, className, ...otherProps }) => (
	<div {...otherProps} className={`header-strip ${className || ''}`}>
		{children}
	</div>
);

HeaderStrip.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string
};

export default HeaderStrip;