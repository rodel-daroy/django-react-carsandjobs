import React from 'react';
import PropTypes from 'prop-types';
import RadialButton from 'components/Buttons/RadialButton';
import LocaleLink from 'components/Localization/LocaleLink';
import './HeaderStripContent.css';

const HeaderStripContent = ({ className, children, ...otherProps }) => {
	return (
		<div {...otherProps} className={`header-strip-content ${className || ''}`}>
			{children}
		</div>
	);
};

HeaderStripContent.propTypes = {
	className: PropTypes.string,
	children: PropTypes.node
};

HeaderStripContent.Back = ({ as, ...otherProps }) => (
	<RadialButton className="header-strip-content-back" size="small" as={as} {...otherProps}>
		<span className="icon icon-angle-left"></span>
	</RadialButton>
);

HeaderStripContent.Back.propTypes = {
	as: PropTypes.any
};

HeaderStripContent.Back.defaultProps = {
	as: LocaleLink
};

HeaderStripContent.Back.displayName = 'HeaderStripContent.Back';
 
export default HeaderStripContent;