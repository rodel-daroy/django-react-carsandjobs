import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import MetaTags from 'react-meta-tags';
import { DEFAULT_IMAGE_URL, DEFAULT_DESCRIPTION } from 'config/constants';
import Localized from 'components/Localization/Localized';

const ContentMetaTags = ({ metaDescription, title, metaKeyword, url, imageUrl, noSuffix, alternates }) => {
	useEffect(() => {
		if(alternates) {
			for(const alt of alternates) {
				const tag = document.createElement('link');
				tag.rel = 'alternate';
				tag.hreflang = alt.language;
				tag.href = alt.url;

				document.head.appendChild(tag);
			}
		}

		return () => {
			for(const tag of document.head.querySelectorAll('[rel=alternate]'))
				tag.parentNode.removeChild(tag);
		};
	}, [alternates]);

	return (
		<Localized names="Common">
			{({ SiteTitle }) => {
				const hasTitle = title && title.toString().length > 0;
				let formattedTitle = title;
				if (hasTitle && !noSuffix)
					formattedTitle = `${title} | ${SiteTitle}`;

				// each element should have an id to avoid duplication of meta tags
				return (
					<MetaTags>
						{hasTitle && <title id="pageTitle">{formattedTitle}</title>}
						{url && <link id="canonicalLink" rel="canonical" href={url} />}
						<meta id="metaDescription" name="description" content={metaDescription || DEFAULT_DESCRIPTION} />
						<meta id="metaKeyword" name="keywords" content={metaKeyword || ''} />
						<meta id="fbAppId" property="fb:app_id" content="2009066502454251" />
						<meta id="ogType" property="og:type" content="article" />
						{url && <meta id="ogUrl" property="og:url" content={url} />}
						<meta id="ogTitle" property="og:title" content={title} />
						<meta id="ogDescription" property="og:description" content={metaDescription || DEFAULT_DESCRIPTION} />
						<meta id="ogImage" property="og:image" content={imageUrl || DEFAULT_IMAGE_URL} />
						<meta id="ogImageWidth" property="og:image:width" content="270" />
						<meta id="ogImageHeight" property="og:image:height" content="284" />
						<meta name="twitter:card" content="summary_large_image" />
						<meta name="twitter:site" content="@TwitterDev" />
						<meta id="twitterTitle" name="twitter:title" content={title} />
						<meta id="twitterDescription" name="twitter:description" content={metaDescription} />
						<meta name="twitter:image" content={imageUrl || DEFAULT_IMAGE_URL} />
					</MetaTags>
				);
			}}
		</Localized>
	);
};

ContentMetaTags.propTypes = {
	metaDescription: PropTypes.string, 
	title: PropTypes.string, 
	metaKeyword: PropTypes.string, 
	url: PropTypes.string, 
	imageUrl: PropTypes.string, 
	noSuffix: PropTypes.bool,
	alternates: PropTypes.arrayOf(PropTypes.shape({
		language: PropTypes.string.isRequired,
		url: PropTypes.string.isRequired
	}))
};

ContentMetaTags.defaultProps = {
	assetsType: 'image'
};

export default ContentMetaTags;

