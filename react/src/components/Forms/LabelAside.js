import React from 'react';
import PropTypes from 'prop-types';
import './LabelAside.css';

const LabelAside = ({ children }) => (
	<div className="label-aside">
		{children}
	</div>
);

LabelAside.propTypes = {
	children: PropTypes.node
};
 
export default LabelAside;