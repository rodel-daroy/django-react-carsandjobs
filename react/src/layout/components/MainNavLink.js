import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import MainNav from './MainNav';
import LocaleLink from 'components/Localization/LocaleLink';
import './MainNavLink.css';

class MainNavLink extends Component {
	state = {
		menuOpen: false
	}

	handleMouseEnter = mobile => () => {
		if(!mobile)
			this.setState({ menuOpen: true });
	}

	handleMouseLeave = mobile => () => {
		if(!mobile)
			this.setState({ menuOpen: false });
	}

	handleClick = mobile => () => {
		let { menuOpen } = this.state;

		if(!mobile)
			menuOpen = true;
		else
			menuOpen = !menuOpen;

		this.setState({ 
			menuOpen
		});
	}

	handleDropdownClick = mobile => e => {
		const { menuOpen } = this.state;

		if(menuOpen && e.target instanceof HTMLAnchorElement) {
			if(!mobile)
				this.setState({ menuOpen: false });

			e.stopPropagation();
		}
	}

	render() {
		const { caption, className, style, children: childrenNode, highlight, external, to, ...otherProps } = this.props;
		const children = React.Children.toArray(childrenNode);

		const { menuOpen } = this.state;

		return (
			<MainNav.Consumer>
				{({ mobile }) => (
					<li 
						className={`main-nav-link ${mobile ? 'mobile' : ''} ${highlight ? `highlight ${highlight}` : ''} ${children.length > 0 ? 'has-dropdown' : ''} ${menuOpen ? 'open' : ''} ${className || ''}`} 
						style={style}
						onMouseEnter={this.handleMouseEnter(mobile)}
						onMouseLeave={this.handleMouseLeave(mobile)}
						onClick={this.handleClick(mobile)}>

						{children.length === 0 && (
							<React.Fragment>
								{external && (
									<a {...otherProps} href={to} target="_blank" rel="noopener noreferrer">
										{caption}
									</a>
								)}

								{!external && (
									<LocaleLink as={NavLink} {...otherProps} to={to}>
										{caption}
									</LocaleLink>
								)}
							</React.Fragment>
						)}

						{children.length > 0 && (
							<React.Fragment>
								<a {...otherProps}>
									{caption}

									<span className="icon icon-angle-down"></span>
								</a>

								<ul className="main-nav-link-dropdown" onClick={this.handleDropdownClick(mobile)}>
									{children}
								</ul>
							</React.Fragment>
						)}
					</li>
				)}
			</MainNav.Consumer>
		);
	}
}

MainNavLink.propTypes = {
	caption: PropTypes.node,
	className: PropTypes.string,
	style: PropTypes.object,
	children: PropTypes.node,
	highlight: PropTypes.oneOf(['primary', 'secondary']),
	to: PropTypes.any,
	external: PropTypes.bool
};

export default MainNavLink;