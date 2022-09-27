import React from 'react';
import PropTypes from 'prop-types';
import ThemeContext from 'components/Common/ThemeContext';
import './RadialButton.css';

const RadialButton = ({ children, className, type, size, as: Component, hover, first, last, ...otherProps }) => (
	<ThemeContext.Consumer>
		{({ dark }) => (
			<Component
				className={`radial-button 
					${size} 
					${dark ? 'dark' : ''} 
					${hover ? 'hover' : ''} 
					${first ? 'first' : ''} 
					${last ? 'last' : ''} 
					${className || ''}`}
				type={Component === 'button' ? type : null}
				{...otherProps}>

				{children}
			</Component>
		)}
	</ThemeContext.Consumer>
);

RadialButton.propTypes = {
	as: PropTypes.any,
	className: PropTypes.string,
	children: PropTypes.node,
	type: PropTypes.string,
	size: PropTypes.oneOf(['tiny', 'small', 'large']),
	hover: PropTypes.bool,
	first: PropTypes.bool,
	last: PropTypes.bool
};

RadialButton.defaultProps = {
	as: 'button',
	type: 'button',
	size: 'small'
};

export default RadialButton;
