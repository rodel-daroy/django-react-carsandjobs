import React from 'react';
import PropTypes from 'prop-types';
import './CardListGroup.css';

/* eslint-disable no-unused-vars */
const CardListGroup = ({ header, children, className, filter, ...otherProps }) => (
	/* eslint-enable */
	<div {...otherProps} className={`card-list-group ${className || ''}`}>
		<div className="card-list-group-header">
			{header}
		</div>

		<ol>
			{children}
		</ol>
	</div>
);

CardListGroup.propTypes = {
	header: PropTypes.node,
	children: PropTypes.node,
	className: PropTypes.string,
	filter: PropTypes.func.isRequired
};
 
export default CardListGroup;