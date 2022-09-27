import React from 'react';
import castArray from 'lodash/castArray';
import { DEFAULT_BUTTON_TEXT } from 'config/constants';
import TileSlot from './TileSlot';
import Tile from './Tile';
import TileContent from './TileContent';

const getImage = asset => {
	if(!asset)
		return null;

	let image = castArray(asset.content)[0];
	if(image && typeof image === 'object')
		image = image.fileUrl;

	return image;
};

const mapTile = (tile, i) => {
	const link = tile.tileCtaLink || `/content/${tile.tileCtaArticle}`;
	const internal = link.match(/^\/[^/]/);

	let tileProps;
	if(internal)
		tileProps = {
			to: link
		};
	else
		tileProps = {
			href: link,
			target: '_blank'
		};

	return (
		<TileSlot key={i} size={tile.columns}>
			<Tile 
				imageUrl={getImage(tile.tileAsset)} 
				{...tileProps}>
				
				<TileContent 
					logo={tile.sponsor ? tile.sponsor.logo : null}
					kind={tile.columns}
					title={tile.tileHeadline}
					text={tile.tileSubheading}
					buttonText={tile.tileCtaText || DEFAULT_BUTTON_TEXT} />
			</Tile>
		</TileSlot>
	);
};

export const mapTiles = tiles => (tiles || []).map(mapTile);