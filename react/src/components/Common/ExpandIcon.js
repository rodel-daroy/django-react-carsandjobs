import React from 'react';
import PropTypes from 'prop-types';
import './ExpandIcon.css';

const ExpandIcon = props => {
	const { expanded, hover, className } = props;

	return (
		<div className={`expand-icon ${expanded ? 'expanded' : ''} ${hover ? 'hover' : ''} ${className || ''}`}>
			<div className='expand-icon-inner'>
				<div className='expand-icon-line vertical' />
				<div className='expand-icon-line horizontal' />
			</div>
		</div>
	);
};

ExpandIcon.propTypes = {
	expanded: PropTypes.bool,
	hover: PropTypes.bool,
	className: PropTypes.string
};

ExpandIcon.defaultProps = {
	expanded: false
};

export default ExpandIcon;
