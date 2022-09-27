import React, { useMemo } from 'react';
import { childrenOfType } from 'airbnb-prop-types';
import { getMediaSize } from 'utils/style';
import TileSlot, { TILE_SIZES } from './TileSlot';
import useElementSize from 'hooks/useElementSize';
import './TileView.css';

const TileView = ({ children }) => {
	const { size, ref } = useElementSize();
	
	const mediaSize = useMemo(() => getMediaSize(size.width, Object.keys(TILE_SIZES)), [size]);

	const tileSlots = useMemo(() => {
		const childArray = React.Children.toArray(children);

		let rowOffset = 0;
		let grow = false;

		const getRowWidth = (startIndex, initialOffset) => {
			let offset = initialOffset % 1;
			let i = startIndex;

			while(offset < 1 && i < childArray.length) {
				offset += TILE_SIZES[mediaSize][childArray[i].props.size];
				++i;
			}

			return offset;
		};

		return childArray.map((slot, i) => {
			const tileSize = TILE_SIZES[mediaSize][slot.props.size];

			// figure out if the tile needs to grow to fill the row on-screen without gaps, 
			// by looking at the size of the current tile and the following tiles
			if((rowOffset + tileSize) % 1 !== 0 && getRowWidth(i, rowOffset) % 1 !== 0) {
				grow = i === childArray.length - 1;

				if(!grow) {
					const nextTile = childArray[i + 1];
					const nextTileSize = TILE_SIZES[mediaSize][nextTile.props.size];

					grow = ((rowOffset % 1) + tileSize + nextTileSize) > 1;
				}
			}
			else
				grow = false;

			const tileSlot = React.cloneElement(slot, { 
				rowOffset, 
				grow,
				mediaSize
			});

			rowOffset += tileSize;
			if(grow)
				rowOffset = Math.floor(rowOffset + 1);

			return tileSlot;
		});
	}, [mediaSize, children]);

	return (
		<div ref={ref} className="tile-view">
			{tileSlots}
		</div>
	);
};

TileView.propTypes = {
	children: childrenOfType(TileSlot)
};

export default TileView;