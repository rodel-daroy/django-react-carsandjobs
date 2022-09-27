import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { loadNavigation } from 'redux/actions/localization';
import { navigation, language, region, isSignedIn } from 'redux/selectors';
import Localized from 'components/Localization/Localized';
import SocialButtons from './SocialButtons';
import sortBy from 'lodash/sortBy';
import './Footer.css';

/* eslint "react/prop-types": "off" */
const FooterLink = ({ caption, to, external, className, ...otherProps }) => (
	<li className={className || ''}>
		{!external && (
			<NavLink {...otherProps} to={to}>
				{caption}
			</NavLink>
		)}

		{external && (
			<a {...otherProps} href={to} target="_blank" rel="noopener noreferrer">
				{caption}
			</a>
		)}
	</li>
);

const mapNavigation = (navigation, language, signedIn) => {
	return sortBy(navigation, ['order']).map((nav, i) => {
		if(nav.signedIn == null || nav.signedIn === signedIn) {
			switch(nav.type) {
				case 'MenuItem':
					return (
						<FooterLink
							key={i}
							caption={nav.caption[language]}
							to={nav.to}
							external={nav.external}>
						</FooterLink>
					);

				case 'Separator':
					return <li role="separator" key={i} />;

				default:
					return null;
			}
		}
		
		return null;
	});
};

class Footer extends Component {
	constructor(props) {
		super(props);

		const { loadNavigation, language, region } = this.props;

		loadNavigation({
			name: 'Footer',
			language,
			region
		});
	}

	componentDidUpdate(prevProps) {
		const { language, region, loadNavigation } = this.props;

		if(language !== prevProps.language || region !== prevProps.region)
			loadNavigation({
				name: 'Footer',
				language,
				region
			});
	}

	render() {
		const { navigation, language, signedIn } = this.props;

		return (
			<Localized names="Common">
				{({ Copyright }) => (
					<footer className="main-footer">
						<div className="main-footer-copyright">{Copyright}</div>
						<nav className="main-footer-links">
							<ul>
								{mapNavigation(navigation, language, signedIn)}
							</ul>

							<SocialButtons />
						</nav>
					</footer>
				)}
			</Localized>
		);
	}
}

Footer.propTypes = {
	loadNavigation: PropTypes.func.isRequired,
	navigation: PropTypes.array.isRequired,
	language: PropTypes.string.isRequired,
	region: PropTypes.string.isRequired,
	signedIn: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
	navigation: navigation('Footer')(state),
	language: language(state),
	region: region(state),
	signedIn: isSignedIn(state)
});

export default connect(mapStateToProps, { loadNavigation })(Footer);