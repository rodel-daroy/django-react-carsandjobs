import React from 'react';
import PropTypes from 'prop-types';
import './Alert.css';

const Alert = ({ children, className, ...otherProps }) => (
	<div 
		{...otherProps} 
		className={`alert ${className || ''}`}
		role="alert">
		
		{children}
	</div>
);

Alert.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string
};
 
export default Alert;