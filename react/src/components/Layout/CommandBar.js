import React from 'react';
import PropTypes from 'prop-types';
import Media from 'react-media';
import { mediaQuery } from 'utils/style';
import './CommandBar.css';

const CommandBar = ({ children, className, layout, orientation, mobileSize, ...otherProps }) => (
	<Media query={mediaQuery(mobileSize)}>
		{isMobile => {
			const visible = 
				!layout 
				|| ['auto', 'alwaysMobile', 'alwaysDesktop'].includes(layout) 
				|| (layout === 'mobile' && isMobile) || (layout === 'desktop' && !isMobile);

			if(visible) {
				children = React.Children.toArray(children).filter(c => typeof c === 'object');

				if(children.length === 0)
					return null;

				let actualLayout;
				switch(layout) {
					case 'auto':
						actualLayout = isMobile ? 'mobile' : 'desktop';
						break;
					
					case 'alwaysMobile':
						actualLayout = 'mobile';
						break;

					case 'alwaysDesktop':
						actualLayout = 'desktop';
						break;

					default:
						actualLayout = layout;
						break;
				}

				const getChild = (child, i) => {
					if(child.type !== CommandBar.Separator) {
						if(actualLayout === 'mobile')
							child = React.cloneElement(child, { size: 'large' });

						return (
							<li key={i}>
								{child}
							</li>
						);
					}
					else
						return (
							<React.Fragment key={i}>
								{child}
							</React.Fragment>
						);
				};

				return (
					<nav {...otherProps} className={`command-bar ${actualLayout || ''} ${orientation} ${className || ''}`}>
						<ul>
							{children.map(getChild)}
						</ul>
					</nav>
				);
			}
			else
				return null;
		}}
	</Media>
);

CommandBar.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	layout: PropTypes.oneOf(['mobile', 'desktop', 'auto', 'alwaysMobile', 'alwaysDesktop']),
	orientation: PropTypes.oneOf(['horizontal', 'vertical']),
	mobileSize: PropTypes.string
};

CommandBar.defaultProps = {
	orientation: 'horizontal',
	mobileSize: 'xs'
};

/* eslint-disable react/display-name */
CommandBar.Separator = () => (
	<li role="separator"></li>
);
/* eslint-enable */

CommandBar.Separator.displayName = 'CommandBar.Separator';
 
export default CommandBar;