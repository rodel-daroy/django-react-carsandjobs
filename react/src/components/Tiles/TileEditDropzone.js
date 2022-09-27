import React from 'react';
import PropTypes from 'prop-types';
import { integer } from 'airbnb-prop-types';
import RadialButton from 'components/Buttons/RadialButton';
import { DropTarget } from 'react-dnd';
import './TileEditDropzone.css';

const TileEditDropzone = ({ onInsert, className, connectDropTarget, isOver, canDrop, index }) => (
	<div ref={connectDropTarget} className={`tile-edit-dropzone ${isOver ? 'is-over' : ''} ${canDrop ? 'can-drop' : ''} ${className || ''}`}>
		<div className="tile-edit-dropzone-inner">
			<RadialButton 
				className="tile-edit-dropzone-insert" 
				size="large" 
				onClick={() => onInsert(index)} 
				aria-label="Insert" 
				title="Insert">

				+
			</RadialButton>
		</div>
	</div>
);

TileEditDropzone.propTypes = {
	index: integer().isRequired,
	onInsert: PropTypes.func.isRequired,
	className: PropTypes.string,

	connectDropTarget: PropTypes.any,
	isOver: PropTypes.bool,
	canDrop: PropTypes.bool
};

const tileTarget = {
	canDrop: ({ index: destIndex }, monitor) => {
		const { index: sourceIndex } = monitor.getItem() || {};
		return destIndex !== sourceIndex && destIndex !== (sourceIndex + 1);
	},
	drop: ({ index }) => ({ index })
};
  
const collect = (connect, monitor) => ({
	connectDropTarget: connect.dropTarget(),
	isOver: monitor.isOver(),
	canDrop: monitor.canDrop()
});
 
export default DropTarget('tile', tileTarget, collect)(TileEditDropzone);