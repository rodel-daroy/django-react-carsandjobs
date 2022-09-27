import React from 'react';
import PropTypes from 'prop-types';
import { childrenOfType } from 'airbnb-prop-types';
import './VitalsGroup.css';

const VitalsGroup = ({ className, children, ...otherProps }) => (
	<ul {...otherProps} className={`vitals-group ${className || ''}`}>
		{children}
	</ul>
);

VitalsGroup.Vital = ({ caption, children, showEmpty }) => {
	if(children || showEmpty)
		return (
			<li>
				<div className="vitals-group-caption">{caption}</div>
				<div className="vitals-group-children">{children}</div>
			</li>
		);
	else
		return null;
};

VitalsGroup.propTypes = {
	className: PropTypes.string,
	children: childrenOfType(VitalsGroup.Vital)
};

VitalsGroup.Vital.propTypes = {
	caption: PropTypes.node,
	children: PropTypes.node,
	showEmpty: PropTypes.bool
};

VitalsGroup.Vital.displayName = 'VitalsGroup.Vital';

export default VitalsGroup;