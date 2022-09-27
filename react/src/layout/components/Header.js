import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router';
import LocaleLink from 'components/Localization/LocaleLink';
import SearchBox from './SearchBox';
import MainNav from './MainNav';
import MainNavLink from './MainNavLink';
import MainNavSeparator from './MainNavSeparator';
import RegionSelector from './Localization/RegionSelector';
import { isSignedIn, region, language, navigation, localized, authRole, REPORTING_ROLES } from 'redux/selectors';
import { connect } from 'react-redux';
import Media from 'react-media';
import { mediaQuery } from 'utils/style';
import MenuIcon from 'components/Common/MenuIcon';
import { setScrollingEnabled } from 'redux/actions/layout';
import { loadNavigation } from 'redux/actions/localization';
import RegionSelectorButton from './Localization/RegionSelectorButton';
import SocialButtons from './SocialButtons';
import sortBy from 'lodash/sortBy';
import { mergeUrlSearch } from 'utils/url';
import SiteLogo from './SiteLogo';
import { buildPathname } from 'components/Localization/helpers';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import './Header.css';

const HeaderSearchBox = () => (
	<React.Fragment>
		<SearchBox className="main-header-search" orientation="horizontal" />

		<RegionSelectorButton />
	</React.Fragment>
);

const mapNavigation = ({ navigation, language, signedIn/* , mobile */ }) => {
	return sortBy(navigation, ['order']).map((nav, i) => {
		if(nav.signedIn == null || nav.signedIn === signedIn) {
			switch(nav.type) {
				case 'MenuItem':
					return (
						<MainNavLink
							key={i}
							caption={nav.caption[language]}
							to={nav.to}
							external={nav.external}>

							{mapNavigation({ 
								navigation: nav.items || [], 
								language, 
								signedIn
							})}
						</MainNavLink>
					);

				case 'Separator':
					return <MainNavSeparator key={i} />;

				default:
					return null;
			}
		}
		
		return null;
	});
};

class Header extends Component {
	constructor(props) {
		super(props);

		const { loadNavigation, language, region } = props;

		loadNavigation({
			name: 'Main',
			language,
			region
		});
		loadNavigation({
			name: 'Footer',
			language,
			region
		});
	}

	state = {
		menuOpen: false
	}

	componentDidUpdate(prevProps, prevState) {
		const { location, language, region, loadNavigation } = this.props;
		const { menuOpen } = this.state;

		if(menuOpen !== prevState.menuOpen)
			this.props.setScrollingEnabled(!menuOpen);

		if(menuOpen && location !== prevProps.location)
			this.setState({ menuOpen: false });

		if(language !== prevProps.language || region !== prevProps.region) {
			loadNavigation({ name: 'Main', language, region });
			loadNavigation({ name: 'Footer', language, region });
		}
	}

	handleMenuToggle = () => {
		this.setState({
			menuOpen: !this.state.menuOpen
		});
	}

	renderNav({ navigation, mobile, className = 'main-header-nav', header = true }) {
		const { signedIn, language, localized, role, location } = this.props;

		const signInLink = {
			pathname: location.pathname,
			search: mergeUrlSearch(location.search, '?signin=1')
		};

		return (
			<MainNav mobile={mobile} className={className}>
				{header && (
					<MainNavLink highlight="primary" caption={localized.FindAJobLabel} to="/search" />
				)}

				{mapNavigation({ navigation, language, signedIn, mobile })}

				{header && REPORTING_ROLES.includes(role) && (
					<MainNavLink caption={localized.AdminLabel} to="/admin" />
				)}

				{header && (
					<React.Fragment>
						<MainNavSeparator />
		
						{!signedIn && (
							<React.Fragment>
								<MainNavLink highlight="secondary" caption={localized.RegisterLabel} to="/register"></MainNavLink>
								<MainNavLink highlight="primary" caption={localized.SignInLabel} to={signInLink}></MainNavLink>
							</React.Fragment>
						)}
						{signedIn && (
							<MainNavLink caption={localized.SignOutLabel} to="?signout=1"></MainNavLink>
						)}
					</React.Fragment>
				)}
			</MainNav>
		);
	}

	renderMobileMenu() {
		const { navigation, footerNavigation } = this.props;
		const { menuOpen } = this.state;

		return (
			<div className={`main-header-mobile-menu ${menuOpen ? 'open' : ''}`}>
				<div className="main-header-mobile-menu-inner">
					{this.renderNav({ 
						navigation, 
						mobile: true
					})}

					<SocialButtons className="main-header-social" />
					
					{this.renderNav({ 
						navigation: footerNavigation, 
						mobile: true, 
						header: false,
						className: 'main-header-nav main-header-nav-footer'
					})}

					<span className="main-header-copyright">{this.props.localized.Copyright}</span>
				</div>
			</div>
		);
	}

	render() {
		const { menuOpen } = this.state;
		const { navigation, locale } = this.props;

		return (
			<Media query={mediaQuery('xs sm')}>
				{mobile => (
					<header className="main-header">
						<div className="main-header-inner">
							<div className="main-header-top">
								<LocaleLink className="logo" to="/">
									<SiteLogo />
								</LocaleLink>

								{mobile && (
									<RegionSelectorButton className="main-header-region" clip />
								)}

								{!mobile && (
									<Switch>
										<Route path={buildPathname(locale, '/(jobs|profile)')} component={HeaderSearchBox} />

										<Route path={buildPathname(locale, '/')} component={RegionSelector} />
									</Switch>
								)}

								{mobile && (
									<button type="button" className="main-header-menu-button" onClick={this.handleMenuToggle}>
										<MenuIcon expanded={menuOpen} />
									</button>
								)}
							</div>

							{!mobile && this.renderNav({ navigation, mobile: false })}
						</div>

						{mobile && this.renderMobileMenu()}
					</header>
				)}
			</Media>
		);
	}
}

Header.propTypes = {
	signedIn: PropTypes.bool.isRequired,
	role: PropTypes.any,
	language: PropTypes.string.isRequired,
	region: PropTypes.string.isRequired,
	setScrollingEnabled: PropTypes.func.isRequired,
	loadNavigation: PropTypes.func.isRequired,
	location: PropTypes.object.isRequired,
	navigation: PropTypes.array.isRequired,
	footerNavigation: PropTypes.array.isRequired,
	localized: PropTypes.object.isRequired,
	locale: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	signedIn: isSignedIn(state),
	role: authRole(state),
	language: language(state),
	region: region(state),
	navigation: navigation('Main')(state),
	footerNavigation: navigation('Footer')(state),
	localized: localized('Common')(state)
});

export default withLocaleRouter(connect(mapStateToProps, { setScrollingEnabled, loadNavigation })(Header));