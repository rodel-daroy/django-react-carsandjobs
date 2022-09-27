import PropTypes from 'prop-types';

export const IMAGE_TYPE = 'Image';
export const CAROUSEL_TYPE = 'Carousel';
export const VIDEO_TYPE = 'Video';

export const AssetTypes = [IMAGE_TYPE, CAROUSEL_TYPE, VIDEO_TYPE];

export const ImageContentPropTypes = {
	alternateText: PropTypes.string,
	fileUrl: PropTypes.string.isRequired
};

export const ImageContent = PropTypes.shape(ImageContentPropTypes);

export const AssetPropTypes = {
	assetType: PropTypes.oneOf(AssetTypes),
	id: PropTypes.any,
	content: PropTypes.arrayOf(PropTypes.oneOfType([
		ImageContent
	]))
};

export const Asset = PropTypes.shape(AssetPropTypes);