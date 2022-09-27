import { IMAGE_TYPE, CAROUSEL_TYPE } from 'types/content';
import mergeWith from 'lodash/mergeWith';

export default class AssetConverter {
	constructor(asset) {
		this.asset = asset;
	}

	get asImage() {
		const { assetType, content } = this.asset || {};

		if(assetType === IMAGE_TYPE || assetType === CAROUSEL_TYPE) {
			if(content && content[0]) {
				const { fileUrl: src, alternateText: alt } = content[0];

				return {
					src,
					alt: alt || ''
				};
			}
		}

		return undefined;
	}

	getImage(defaultImage) {
		return mergeWith({}, this.asImage, defaultImage, (dest, src) => !dest ? src : dest);
	}

	get asImageArray() {
		const { assetType, content } = this.asset || {};

		if(assetType === IMAGE_TYPE || assetType === CAROUSEL_TYPE)
			return (content || []).map(c => ({
				src: c.fileUrl,
				alt: c.alternateText
			}));

		return undefined;
	}
}