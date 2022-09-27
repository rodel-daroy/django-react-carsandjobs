import React from 'react';
import PropTypes from 'prop-types';
import HeaderStripContent from 'components/Layout/HeaderStripContent';
import './HeaderStripContentLarge.css';

const HeaderStripContentLarge = ({ className, children, ...otherProps }) => (
	<HeaderStripContent {...otherProps} className={`header-strip-content-large ${className || ''}`}>
		{children}
	</HeaderStripContent>
);

HeaderStripContentLarge.propTypes = {
	className: PropTypes.string,
	children: PropTypes.node,
	backTo: PropTypes.any
};
 
export default HeaderStripContentLarge;