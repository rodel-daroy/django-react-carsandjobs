import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import Header from './components/Header';
import Footer from './components/Footer';
import ModalContainer from 'components/Modals/ModalContainer';
import ErrorContainer from './components/ErrorContainer';
import TadaContainer from './components/User/TadaContainer';
import WithSignIn from './components/User/WithSignIn';
import WithLocalization from 'components/Localization/WithLocalization';
import { connect } from 'react-redux';
import ContentMetaTags from 'components/Content/ContentMetaTags';
import ErrorBoundary from 'components/Common/ErrorBoundary';
import Localized from 'components/Localization/Localized';
import LoadingOverlay from 'components/Common/LoadingOverlay';
import './index.css';

const Layout = ({ children, scrolling, globalOverlay, location: { pathname, hash }, locale }) => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);
	
	const scrollToHash = hash => {
		if(hash) {
			const element = document.getElementById(hash.slice(1));

			if(element) {
				element.scrollIntoView();
				return element;
			}
		}
	};

	useEffect(() => {
		let mutationObserver;

		const handleMutation = () => {
			if(scrollToHash(hash)) {
				mutationObserver.disconnect();
				mutationObserver = null;
			}
		};

		mutationObserver = new MutationObserver(handleMutation);
		mutationObserver.observe(document.documentElement, {
			attributes: true,
			childList: true,
			subtree: true
		});

		return () => {
			if(mutationObserver)
				mutationObserver.disconnect();
		};
	}, [hash]);

	useEffect(() => {
		if(globalOverlay)
			document.documentElement.classList.add('no-scroll');
		else
			document.documentElement.classList.remove('no-scroll');
	}, [globalOverlay]);

	useEffect(() => {
		document.documentElement.lang = locale.language;
	}, [locale.language]);

	return (
		<div className="layout" role="main">
			<WithLocalization names="Common">
				{() => (
					<React.Fragment>
						<Localized names="Common">
							{({ SiteTitle }) => (
								<React.Fragment>
									<ContentMetaTags title={SiteTitle} noSuffix />
				
									<Header />
				
									<div className={`layout-content ${scrolling ? '' : 'no-scroll'}`}>
										<ModalContainer />
										<TadaContainer />
										<ErrorContainer />
				
										<ErrorBoundary>
											<WithSignIn>
												{() => children}
											</WithSignIn>
										</ErrorBoundary>
									</div>
				
									<Footer />
								</React.Fragment>
							)}
						</Localized>

						{globalOverlay && (
							<div className="layout-overlay">
								<LoadingOverlay scrim>
									{globalOverlay}
								</LoadingOverlay>
							</div>
						)}
					</React.Fragment>
				)}
			</WithLocalization>
		</div>
	);
};

Layout.propTypes = {
	match: PropTypes.object,
	children: PropTypes.node,
	location: PropTypes.object,
	locale: PropTypes.object.isRequired,

	scrolling: PropTypes.bool,
	globalOverlay: PropTypes.any
};

const mapStateToProps = state => ({
	scrolling: state.layout.scrolling,
	globalOverlay: state.layout.globalOverlay
});

export default withLocaleRouter(connect(mapStateToProps)(Layout));