import React from 'react';
import PropTypes from 'prop-types';
import './LinkBlock.css';

const LinkBlock = ({ children, className, ...otherProps }) => (
	<div {...otherProps} className={`link-block ${className || ''}`}>
		<div className="link-block-inner">
			{children}
		</div>
	</div>
);

LinkBlock.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string
};

LinkBlock.Content = ({ children }) => (
	<div className="link-block-content">
		{children}
	</div>
);

LinkBlock.Content.propTypes = {
	children: PropTypes.node
};

LinkBlock.Content.displayName = 'LinkBlock.Content';
 
export default LinkBlock;