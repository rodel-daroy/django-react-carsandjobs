import React from 'react';
import PropTypes from 'prop-types';
import ExpandIcon from 'components/Common/ExpandIcon';
import RadialButton from './RadialButton';

const ExpandButton = ({ expanded, className, ...otherProps }) => (
	<RadialButton
		{...otherProps}
		className={`${expanded ? 'expanded' : ''} ${className || ''}`}>
		
		<ExpandIcon expanded={expanded} />
	</RadialButton>
);

ExpandButton.propTypes = {
	expanded: PropTypes.bool,
	className: PropTypes.string
};

export default ExpandButton;
