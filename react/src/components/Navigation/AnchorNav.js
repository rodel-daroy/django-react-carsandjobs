import React from 'react';
import PropTypes from 'prop-types';
import { childrenOfType } from 'airbnb-prop-types';
import Sticky from 'react-sticky-el';
import Scrollspy from 'react-scrollspy';
import './AnchorNav.css';

const DEFAULT_TOP = 0;

const AnchorNav = ({ children, top, scrollSelector, className }) => {
	const anchors = React.Children
		.toArray(children)
		.map(link => link.props.anchor);

	return (
		<Sticky topOffset={-top} scrollElement={scrollSelector} stickyStyle={{ marginTop: top }}>
			<nav className={`anchor-nav ${className || ''}`}>
				<Scrollspy items={anchors} componentTag="ol" currentClassName="current" rootEl={scrollSelector}>
					{children}
				</Scrollspy>
			</nav>
		</Sticky>
	);
};

AnchorNav.Link = props => (
	<li className={props.className}>
		<a className="anchor-nav-link" href={`#${props.anchor}`}>
			{props.name}
		</a>
	</li>
);

AnchorNav.Link.displayName = 'AnchorNav.Link';

AnchorNav.Link.propTypes = {
	name: PropTypes.string,
	anchor: PropTypes.string,
	className: PropTypes.string
};

AnchorNav.propTypes = {
	top: PropTypes.number.isRequired,
	children: childrenOfType(AnchorNav.Link),
	scrollSelector: PropTypes.string,
	className: PropTypes.string
};

AnchorNav.defaultProps = {
	top: DEFAULT_TOP
};

export default AnchorNav;
