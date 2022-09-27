import React from 'react';
import PropTypes from 'prop-types';
import './MainNav.css';

const { Provider, Consumer } = React.createContext({ mobile: false });

const MainNav = ({ children, mobile, className, ...otherProps }) => (
	<MainNav.Provider value={{ mobile }}>
		<nav {...otherProps} className={`main-nav ${mobile ? 'mobile' : ''} ${className || ''}`}>
			<ul>
				{children}
			</ul>
		</nav>
	</MainNav.Provider>
);

MainNav.propTypes = {
	children: PropTypes.node,
	mobile: PropTypes.bool,
	className: PropTypes.string
};

MainNav.Provider = Provider;
MainNav.Consumer = Consumer;

export default MainNav;