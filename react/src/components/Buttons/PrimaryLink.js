import React from 'react';
import PropTypes from 'prop-types';
import './PrimaryLink.css';

const PrimaryLink = ({ 
	children, 
	size, 
	className, 
	icon, 
	iconClassName, 
	iconPosition,
	hasIcon, 
	as: Component, 
	disabled,
	onClick,
	clip,

	...otherProps 
}) => (
	<Component 
		{...otherProps}
		className={`primary-link ${size} ${clip ? 'clip' : ''} ${className || ''}`}
		disabled={disabled}
		onClick={e => {
			if(disabled) {
				e.preventDefault();
				e.stopPropagation();
				return false;
			}
			else {
				if(onClick) onClick(e);
			}
		}}>
	
		{hasIcon && iconPosition === 'left' && icon({ iconClassName })}
		{children && <span className="primary-link-children">{children}</span>}
		{hasIcon && iconPosition === 'right' && icon({ iconClassName })}
	</Component>
);

PrimaryLink.propTypes = {
	children: PropTypes.node,
	size: PropTypes.oneOf(['small', 'large', 'x-large']),
	className: PropTypes.string,
	icon: PropTypes.func,
	iconClassName: PropTypes.string,
	iconPosition: PropTypes.oneOf(['left', 'right']),
	hasIcon: PropTypes.bool,
	as: PropTypes.any,
	disabled: PropTypes.bool,
	onClick: PropTypes.func,
	clip: PropTypes.bool
};

PrimaryLink.defaultProps = {
	size: 'small',
	/* eslint-disable */
	icon: ({ iconClassName }) => <span className={iconClassName}></span>,
	/* eslint-enable */
	iconPosition: 'left',
	as: 'a'
};

export default PrimaryLink;