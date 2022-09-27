import React from 'react';
import PropTypes from 'prop-types';
import { integer } from 'airbnb-prop-types';
import TileEditOverlay from './TileEditOverlay';
import TileEditDropzone from './TileEditDropzone';

const TileEditViewSlot = ({ index, children, onMove, onInsert, onEdit, onDelete, rowIndex }) => {
	const tile = React.Children.only(children);
	
	return (
		<React.Fragment>
			<TileEditDropzone index={index} onInsert={onInsert} />

			<TileEditOverlay index={index} onMove={onMove} onEdit={onEdit} onDelete={onDelete}>
				{React.cloneElement(tile, { rowIndex, animate: false, initialPageLoaded: true })}
			</TileEditOverlay>

			<TileEditDropzone index={index + 1} onInsert={onInsert} />
		</React.Fragment>
	);
};

TileEditViewSlot.propTypes = {
	index: integer().isRequired,
	children: PropTypes.node.isRequired,
	onMove: PropTypes.func,
	onInsert: PropTypes.func,
	onEdit: PropTypes.func,
	onDelete: PropTypes.func,
	rowIndex: integer()
};

export default TileEditViewSlot;