import React from 'react';
import PropTypes from 'prop-types';
import { integer } from 'airbnb-prop-types';
import LocaleLink from 'components/Localization/LocaleLink';
import { resizeImageUrl } from 'utils';
import ObjectFit from 'components/Common/ObjectFit';
//import placeHolderImage from 'styles/img/a1.png';
import './ArticleThumbnail.css';

const THUMBNAIL_WIDTH = 400;
const THUMBNAIL_HEIGHT = 195;

const ArticleThumbnail = ({
	title,
	content,
	image,
	imageAlt,
	link,
	href,
	thumbnail,
	target,
	assetType,
	maxTextLength,
	maxTitleLength
}) => {
	/* eslint-disable react/display-name, react/prop-types */
	let LinkComponent = ({ children }) => (
		<LocaleLink className="article-thumbnail" to={{ pathname: link }} target={target}>
			{children}
		</LocaleLink>
	);

	if(href)
		LinkComponent = ({ children }) => (
			<a className="article-thumbnail" href={href} target={target}>
				{children}
			</a>
		);
	/* eslint-enable react/display-name, react/prop-types */

	let imageSrc;
	if(assetType === 'video')
		imageSrc = resizeImageUrl(thumbnail /* || placeHolderImage */, THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT);
	else
		imageSrc = resizeImageUrl(image /* || placeHolderImage */, THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT);

	return (
		<div className="article-thumb">
			<LinkComponent>
				<div className="img-wrap">
					<ObjectFit>
						<img alt={imageAlt} src={imageSrc} />
					</ObjectFit>
				</div>
				<div className="article-thumbnail-content">
					<h3>
						{title.length >= maxTextLength
							? `${title.substr(0, maxTitleLength - 3)}...`
							: title}
					</h3>
					{content && (
						<p>
							{content.length >= maxTextLength
								? `${content.substr(0, maxTextLength - 3)}...`
								: content}
						</p>
					)}
				</div>
			</LinkComponent>
		</div>
	);
};

ArticleThumbnail.propTypes = {
	title: PropTypes.string,
	content: PropTypes.string,
	image: PropTypes.string,
	imageAlt: PropTypes.string,
	link: PropTypes.string,
	href: PropTypes.string,
	thumbnail: PropTypes.string,
	target: PropTypes.string,
	assetType: PropTypes.any,
	maxTextLength: integer(),
	maxTitleLength: integer()
};

ArticleThumbnail.defaultProps = {
	title: 'title',
	content: 'content',
	image: 'http://via.placeholder.com/350x150?text=Image',
	imageAlt: '',
	link: '',
	maxTextLength: 100,
	maxTitleLength: 40
};

export default ArticleThumbnail;
