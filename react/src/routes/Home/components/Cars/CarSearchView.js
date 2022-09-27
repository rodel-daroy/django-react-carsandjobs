import React from 'react';
import PropTypes from 'prop-types';
import CarSearchForm from './CarSearchForm';
import { showModal } from 'redux/actions/modals';
import { connect } from 'react-redux';
import { passiveModal } from 'components/Modals/helpers';
import ThemeContext from 'components/Common/ThemeContext';
import WithAsset from 'components/Content/WithAsset';
import ResponsiveImage from 'components/Common/ResponsiveImage';
import Localized from 'components/Localization/Localized';
import WithLocalization from 'components/Localization/WithLocalization';
import { parseMarkdown } from 'utils/format';
import stackedLogo from './img/Al-Logo-Stacked-Colour.svg';
import horizontalLogo from './img/Al-Logo-Horizontal-White&Red.svg';
import './CarSearchView.css';

const CarSearchView = ({ showModal }) => {
	const handleSubmit = ({ year, make, model }) => {
		const url = encodeURI(`https://www.autolife.ca/shopping/vehicle-search/${model}/${year}/${make}`);

		showModal(passiveModal({
			className: 'car-search-view',
			// eslint-disable-next-line react/display-name
			content: () => (
				<Localized names={['Common', 'Cars']}>
					{({ RedirectMessage }) => (
						<div>
							<div>
								<img className="car-search-view-logo" src={stackedLogo} alt="AutoLife" />
							</div>
							<div dangerouslySetInnerHTML={{ 
								__html: parseMarkdown(RedirectMessage.replace('[AutoLife]', `[AutoLife](${url})`)) 
							}}></div>
						</div>
					)}
				</Localized>
			),
			onClose: () => window.open(url, '_self')
		}));
	};

	return (
		<WithLocalization names="Cars">
			{() => (
				<ThemeContext.Provider value={{ dark: true }}>
					<div className="car-search-view">
						<div className="car-search-view-background">
							<WithAsset name="Search Cars Background">
								{({ asImage }) => (asImage || null) && (
									<ResponsiveImage {...asImage} className="car-search-view-background-image" />
								)}
							</WithAsset>
						</div>

						<Localized names={['Common', 'Cars']}>
							{({
								SearchCarsTitle,
								PoweredByLabel
							}) => (
								<div className="car-search-view-body">
									<h1>{SearchCarsTitle}</h1>

									<CarSearchForm onSubmit={handleSubmit} />

									<div className="car-search-view-powered-by">
										<span>{PoweredByLabel}</span>
										<a href="https://www.autolife.ca" target="_blank" rel="noopener noreferrer">
											<img src={horizontalLogo} alt="AutoLife" />
										</a>
									</div>
								</div>
							)}
						</Localized>
					</div>
				</ThemeContext.Provider>
			)}
		</WithLocalization>
	);
};

CarSearchView.propTypes = {
	showModal: PropTypes.func.isRequired
};
 
export default connect(null, { showModal })(CarSearchView);