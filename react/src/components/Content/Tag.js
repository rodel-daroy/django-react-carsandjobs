import React from 'react';
import PropTypes from 'prop-types';
import './Tag.css';

const Tag = ({ as: Component, children, ...otherProps }) => (
	<Component {...otherProps} className="tag">
		{children}
	</Component>
);

Tag.propTypes = {
	as: PropTypes.any,
	children: PropTypes.node
};

Tag.defaultProps = {
	as: 'span'
};
 
export default Tag;