import React from 'react';
import PropTypes from 'prop-types';
import './ContentBlock.css';

const ContentBlock = ({ children, className, as: Component, ...otherProps }) => (
	<Component {...otherProps} className={`content-block ${className || ''}`}>
		<div className="content-block-inner">
			{children}
		</div>
	</Component>
);

ContentBlock.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	as: PropTypes.any
};

ContentBlock.defaultProps = {
	as: 'div'
};
 
export default ContentBlock;