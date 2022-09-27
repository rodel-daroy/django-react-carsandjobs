import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isSignedIn, region, language } from 'redux/selectors';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import LocaleLink from 'components/Localization/LocaleLink';
import Localized from 'components/Localization/Localized';
import { parseMarkdown } from 'utils/format';
import LinkBlock from './components/LinkBlock';
import carfaxLogoEn from './img/CarfaxCanada-3colour_EN.svg';
import carfaxLogoFr from './img/CarfaxCanada-3colour_FR.svg';
import TileContainer from 'components/Tiles/TileContainer';
import SearchView from './components/SearchView';
//import CarSearchView from './components/Cars/CarSearchView';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import './index.css';

const carfaxLogo = {
	'en': carfaxLogoEn,
	'fr': carfaxLogoFr
};

const Home = ({ region, language }) => (
	<Localized names="Common">
		{({ [`EducationText-${region}`]: EducationText, LearnMoreLabel, CarproofText }) => (
			<div className="home-view">
				<SearchView />

				<div>
					{EducationText && (
						<LinkBlock>
							<LinkBlock.Content>
								<div dangerouslySetInnerHTML={{ __html: parseMarkdown(EducationText) }}></div>
							</LinkBlock.Content>

							<PrimaryButton as={LocaleLink} to="/students">
								{LearnMoreLabel}
							</PrimaryButton>
						</LinkBlock>
					)}

					{/*region === 'ON' && language === 'en' && (
						<CarSearchView />
					)*/}

					{CarproofText && (
						<LinkBlock>
							<LinkBlock.Content>
								<img className="home-view-carfax-logo" src={carfaxLogo[language]} alt="Carfax" />

								<div dangerouslySetInnerHTML={{ __html: parseMarkdown(CarproofText) }}></div>
							</LinkBlock.Content>

							<PrimaryButton as={LocaleLink} to="/carfax">
								{LearnMoreLabel}
							</PrimaryButton>
						</LinkBlock>
					)}
				</div>

				<TileContainer />
			</div>
		)}
	</Localized>
);

Home.propTypes = {
	signedIn: PropTypes.bool.isRequired,
	region: PropTypes.string.isRequired,
	location: PropTypes.object.isRequired,
	language: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
	signedIn: isSignedIn(state),
	region: region(state),
	language: language(state)
});

export default withLocaleRouter(connect(mapStateToProps)(Home));