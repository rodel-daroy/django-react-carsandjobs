import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TileForm from './TileForm';
import './EditTileView.css';

const EditTileView = ({ tile, onSubmit, onCancel }) => {
	const [lastTile, setLastTile] = useState();
	const [active, setActive] = useState(false);

	useEffect(() => {
		if(tile) {
			setLastTile(tile);
			setActive(true);
		}
		else
			setActive(false);
	}, [tile]);

	if(!lastTile)
		return null;

	return (
		<div className="edit-tile-view">
			<TileForm 
				loading={!active} 
				initialValues={lastTile} 
				onSubmit={onSubmit}
				onCancel={onCancel} />
		</div>
	);
};

EditTileView.propTypes = {
	tile: PropTypes.object,
	onSubmit: PropTypes.func.isRequired,
	onCancel: PropTypes.func
};
 
export default EditTileView;