import React from 'react';
import PropTypes from 'prop-types';
import './ScrollContainer.css';

const ScrollContainer = ({ children, className, as: Component, ...otherProps }) => (
	<Component {...otherProps} className={`scroll-container-outer ${className || ''}`}>
		<div className="scroll-container-inner">
			{children}
		</div>
	</Component>
);

ScrollContainer.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	as: PropTypes.any
};

ScrollContainer.defaultProps = {
	as: 'div'
};
 
export default ScrollContainer;