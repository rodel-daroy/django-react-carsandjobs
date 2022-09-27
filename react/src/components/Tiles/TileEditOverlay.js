import React from 'react';
import { integer } from 'airbnb-prop-types';
import PropTypes from 'prop-types';
import { childrenOfType } from 'airbnb-prop-types';
import Tile from './Tile';
import RadialButton from 'components/Buttons/RadialButton';
import { DragSource } from 'react-dnd';
import './TileEditOverlay.css';

const TileEditOverlay = ({ children, onEdit, onDelete, dragSourceRef, index }) => (
	<div ref={dragSourceRef} className="tile-edit-overlay">
		{children}

		<div className="tile-edit-overlay-controls">
			<div className="tile-edit-overlay-handle">
				<span className="icon icon-ellipsis"></span>
			</div>
			
			<div className="tile-edit-overlay-commands">
				<RadialButton onClick={() => onEdit(index)} aria-label="Edit" title="Edit">
					<span className="icon icon-edit"></span>
				</RadialButton>
				<RadialButton onClick={() => onDelete(index)} aria-label="Delete" title="Delete">
					<span className="icon icon-delete"></span>
				</RadialButton>
			</div>
		</div>
	</div>
);

TileEditOverlay.propTypes = {
	index: integer().isRequired,
	children: childrenOfType(Tile).isRequired,

	onEdit: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
	onMove: PropTypes.func.isRequired,

	dragSourceRef: PropTypes.any
};

const tileSource = {
	beginDrag: (({ index }) => ({
		index
	})),

	endDrag: ({ onMove }, monitor) => {
		if(!monitor.didDrop())
			return;

		const { index: destIndex } = monitor.getDropResult();

		onMove(destIndex);
	}
};

const collect = (connect, monitor) => ({
	dragSourceRef: connect.dragSource(),
	isDragging: monitor.isDragging(),
});
 
export default DragSource('tile', tileSource, collect)(TileEditOverlay);