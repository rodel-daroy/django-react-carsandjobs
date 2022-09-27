import React from 'react';
import PropTypes from 'prop-types';
import { resizeImageUrl } from 'utils';
import ObjectFit from 'components/Common/ObjectFit';
import './AssetPreview.css';

const AssetPreview = ({ asset: { name, assetType, content } }) => {
	let imageUrl;
	if(assetType === 'Image')
		imageUrl = content[0].fileUrl;
		
	return (
		<div className="asset-preview">
			{imageUrl && (
				<div className="asset-preview-image">
					<ObjectFit fit="contain">
						<img src={resizeImageUrl(imageUrl, 200)} alt="" />
					</ObjectFit>
				</div>
			)}

			<div className="asset-preview-name">{name}</div>
		</div>
	);
};

AssetPreview.propTypes = {
	asset: PropTypes.object.isRequired
};

export default AssetPreview;