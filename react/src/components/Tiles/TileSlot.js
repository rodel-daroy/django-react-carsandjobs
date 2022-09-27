import React from 'react';
import PropTypes from 'prop-types';
import './TileSlot.css';

const TileSlot = ({ size, children, rowOffset, grow, mediaSize }) => {
	const transformed = React.Children.toArray(children).map(child => 
		React.cloneElement(child, { rowIndex: Math.floor(rowOffset) }));

	return (
		<div className={`tile-slot size-${size} ${grow ? 'grow' : ''} ${mediaSize}`}>
			{transformed}
		</div>
	);
};

TileSlot.propTypes = {
	size: PropTypes.oneOf([1, 2]).isRequired,
	rowOffset: PropTypes.number,
	children: PropTypes.node,
	grow: PropTypes.bool,
	mediaSize: PropTypes.string
};

TileSlot.defaultProps = {
	size: 1
};

export default TileSlot;

export const TILE_SIZES = {
	'sm': {
		1: 1,
		2: 1
	},
	'md': {
		1: .5,
		2: 1
	},
	'lg': {
		1: .25,
		2: .5
	}
};
