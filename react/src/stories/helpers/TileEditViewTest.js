import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import TileSlot from 'components/Tiles/TileSlot';
import Tile from 'components/Tiles/Tile';
import TileContent from 'components/Tiles/TileContent';
import TileEditView from 'components/Tiles/TileEditView';
import { randomImage } from './';

export const createTile = index => {
	const size = (Math.random() > .5) ? 1 : 2;
	const imageUrl = randomImage(960, 350);

	return (
		<TileSlot key={index} size={size}>
			<Tile imageUrl={imageUrl} onClick={action('onClick')}>
				<TileContent title={`Tile ${index}`} text="Lorem ipsum" kind={size} />
			</Tile>
		</TileSlot>
	);
};

export const createTiles = (count = 10) => {
	let result = [];

	for(let i = 0; i < count; ++i)
		result.push(createTile(i));

	return result;
};

const TileEditViewTest = () => {
	const [tiles, setTiles] = useState(createTiles());

	const handleInsert = index => {
		action('onInsert')(index);

		let newTiles = tiles.slice();

		const lastIndex = newTiles.reduce((acc, cur) => {
			const curKey = parseInt(cur.key);
			if(curKey > acc)
				return curKey;
			else
				return acc;
		}, -1);

		newTiles.splice(index, 0, createTile(lastIndex + 1));

		setTiles(newTiles);
	};

	const handleMove = (sourceIndex, destIndex) => {
		action('onMove')(sourceIndex, destIndex);

		let newTiles = tiles.slice();
		const tile = newTiles.splice(sourceIndex, 1);

		if(sourceIndex < destIndex)
			--destIndex;
			
		newTiles.splice(destIndex, 0, tile);

		setTiles(newTiles);
	};

	const handleDelete = index => {
		action('onDelete')(index);

		let newTiles = tiles.slice();
		newTiles.splice(index, 1);

		setTiles(newTiles);
	};

	return (
		<TileEditView 
			onInsert={handleInsert}
			onMove={handleMove}
			onEdit={action('onEdit')}
			onDelete={handleDelete}>

			{tiles}
		</TileEditView>
	);
};
 
export default TileEditViewTest;


