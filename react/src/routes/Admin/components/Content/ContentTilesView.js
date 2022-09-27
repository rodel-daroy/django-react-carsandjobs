import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import ViewPanel from 'components/Layout/ViewPanel';
import HeaderStrip from 'components/Layout/HeaderStrip';
import HeaderStripContentLarge from 'components/Layout/HeaderStripContentLarge';
import HeaderStripContent from 'components/Layout/HeaderStripContent';
import ContentTileEditView from './ContentTileEditView';
import ContentBlock from 'components/Layout/ContentBlock';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import TileCategoryDropdown from './TileCategoryDropdown';
import ContentMetaTags from 'components/Content/ContentMetaTags';
import { connect } from 'react-redux';
import { language, ADMIN_ROLE } from 'redux/selectors';
import requireRole from 'components/Decorators/requireRole';
import Localized from 'components/Localization/Localized';
import './ContentTilesView.css';

const ContentTilesView = ({ match: { params: { categoryId, language } }, history, defaultLanguage }) => {
	const updateUrl = useCallback((category, language) => {
		history.replace(`/admin/content/tiles/${language || defaultLanguage}/${category || ''}`);
	}, [defaultLanguage, history]);
	
	const handleCategoryChange = useCallback(category => {
		updateUrl(category, language);
	}, [language, updateUrl]);

	const handleLanguageChange = useCallback(language => {
		updateUrl(categoryId, language);
	}, [categoryId, updateUrl]);

	return (
		<Localized names={['Common', 'Admin']}>
			{({ TilesTitle }) => (
				<ViewPanel className="content-tiles-view">
					<ContentMetaTags title={TilesTitle} />

					<HeaderStrip>
						<HeaderStripContentLarge>
							<HeaderStripContent.Back to="/admin" />

							<h1>{TilesTitle}</h1>
						</HeaderStripContentLarge>
					</HeaderStrip>

					<ContentBlock className="content-tiles-view-filter">
						<TileCategoryDropdown 
							value={categoryId} 
							onChange={handleCategoryChange}
							language={language}
							onChangeLanguage={handleLanguageChange} />
					</ContentBlock>
					
					{categoryId && (
						<ContentTileEditView 
							categoryId={categoryId} 
							language={language} />
					)}
				</ViewPanel>
			)}
		</Localized>
	);
};

ContentTilesView.propTypes = {
	match: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,

	defaultLanguage: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
	defaultLanguage: language(state)
});
 
export default requireRole(ADMIN_ROLE)(connect(mapStateToProps)(withLocaleRouter(ContentTilesView)));