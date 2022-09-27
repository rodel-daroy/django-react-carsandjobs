import React from 'react';
import PropTypes from 'prop-types';
import ThumbnailSection from 'components/Content/ThumbnailSection';
import ArticleThumbnail from 'components/Content/ArticleThumbnail';
import Media from 'react-media';
import { mediaQuery } from 'utils/style';

const RelatedArticles = ({ orientation, ...otherProps }) => {
	if(!orientation)
		return (
			<Media query={mediaQuery('md lg')}>
				{matches => <ThumbnailSection {...otherProps} orientation={matches ? 'horizontal' : 'vertical'} />}
			</Media>
		);
	else
		return <ThumbnailSection orientation={orientation} {...otherProps} />;
};

RelatedArticles.propTypes = {
	orientation: PropTypes.oneOf(['horizontal', 'vertical'])
};

RelatedArticles.Article = ArticleThumbnail;

export default RelatedArticles;
