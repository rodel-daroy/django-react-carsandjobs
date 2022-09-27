import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import TileSelectView from 'components/Tiles/TileSelectView';
import { createTiles } from './TileEditViewTest';

const TileSelectViewTest = () => {
	const [tiles] = useState(createTiles(15));
	const [index, setIndex] = useState();

	const handleChange = index => {
		action('onChange')(index);
		setIndex(index);
	};

	return (
		<TileSelectView index={index} onChange={handleChange}>
			{tiles}
		</TileSelectView>
	);
};
 
export default TileSelectViewTest;