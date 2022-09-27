import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { childrenOfType } from 'airbnb-prop-types';
import Tile from './Tile';
import './TileSelectOverlay.css';

const TileSelectOverlay = ({ children, selected, onClick }) => {
	const [mouseOver, setMouseOver] = useState(false);

	const handleOver = () => setMouseOver(true);
	const handleOut = () => setMouseOver(false);

	const handleClick = e => {
		e.stopPropagation();
		e.preventDefault();

		if(onClick)
			onClick();
	};

	return (
		<div 
			className={`tile-select-overlay ${selected ? 'selected' : ''} ${mouseOver ? 'over' : ''}`} 
			role="button" 
			onClickCapture={handleClick}
			onMouseOverCapture={handleOver}
			onMouseOutCapture={handleOut}>

			{React.cloneElement(children, { animate: false, initialPageLoaded: true })}

			<div className="tile-select-overlay-selection">
				<span className="icon icon-check"></span>
			</div>
		</div>
	);
};

TileSelectOverlay.propTypes = {
	children: childrenOfType(Tile).isRequired,
	selected: PropTypes.bool,
	onClick: PropTypes.func
};
 
export default TileSelectOverlay;