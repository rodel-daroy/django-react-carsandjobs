import React from 'react';
import PropTypes from 'prop-types';
import ASpot from 'components/Content/ASpot';
import ContentLayout from '../../ContentLayout';
import Attribution from '../../Attribution';
import ImageCarouselView from 'components/Content/ImageCarouselView';
import { splitMarkdown } from 'utils/format';
import RelatedArticlesView from '../../RelatedArticlesView';
import { ContentPropTypes } from '../../types';
import './index.css';

const Default = ({ 
	title, 
	subTitle, 
	content, 
	image, 
	date, 
	carouselImages, 
	author, 
	authorUrl, 
	relatedArticles,
	anchorNav,
	aSpot 
}) => {
	const hasCarousel = carouselImages && carouselImages.length > 0;
	const contentParts = splitMarkdown(content, hasCarousel ? [100] : []);

	return (
		<ContentLayout className="default-layout">
			{aSpot && (
				<ASpot image={image}>
					<h1>{title}</h1>
					{subTitle && <h2>{subTitle}</h2>}
				</ASpot>
			)}

			<div className="default-layout-attrib-mobile-outer">
				<Attribution 
					className="default-layout-attrib-mobile" 
					author={author}
					url={authorUrl} 
					date={date} />
			</div>

			<ContentLayout.Content
				sidebar={(
					<Attribution author={author} url={authorUrl} date={date} />
				)}
				anchorNavContent={anchorNav && content}>

				{contentParts[0]}
			</ContentLayout.Content>

			{hasCarousel && (
				<React.Fragment>
					<ContentLayout.Foreground>
						<ImageCarouselView className="default-layout-carousel" images={carouselImages}  />
					</ContentLayout.Foreground>

					<ContentLayout.Content>
						{contentParts[1]}
					</ContentLayout.Content>
				</React.Fragment>
			)}

			<ContentLayout.Foreground>
				<RelatedArticlesView articles={relatedArticles} />
			</ContentLayout.Foreground>
		</ContentLayout>
	);
};

Default.propTypes = {
	...ContentPropTypes,

	anchorNav: PropTypes.bool,
	aSpot: PropTypes.bool
};

Default.defaultProps = {
	aSpot: true
};
 
export default Default;