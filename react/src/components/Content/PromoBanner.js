import React from 'react';
import PropTypes from 'prop-types';
import './PromoBanner.css';

const PromoBanner = ({ children, ...otherProps }) => (
	<div {...otherProps} className="promo-banner">
		<div className="promo-banner-inner">
			{children}
		</div>
	</div>
);

PromoBanner.propTypes = {
	children: PropTypes.node
};
 
export default PromoBanner;