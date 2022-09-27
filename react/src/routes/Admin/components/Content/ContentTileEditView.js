import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TileEditView from 'components/Tiles/TileEditView';
import { connect } from 'react-redux';
import { 
	loadCategoryTiles, 
	moveCategoryTile, 
	insertCategoryTile, 
	removeCategoryTile, 
	insertNewCategoryTile,
	updateCategoryTile,
	deleteCategoryTile
} from 'redux/actions/tiles';
import { showModal } from 'redux/actions/modals';
import { mapTiles } from 'components/Tiles/helpers';
import EmptyState from 'components/Layout/EmptyState';
import LoadingOverlay from 'components/Common/LoadingOverlay';
import Modal from 'components/Modals/Modal';
import InsertTileView from './InsertTileView';
import EditTileView from './EditTileView';
import ResponsiveModalFrame from 'components/Modals/ResponsiveModalFrame';
import RemoveTileModal from './RemoveTileModal';
import './ContentTileEditView.css';

const ContentTileEditView = ({ 
	categoryId, 
	loadCategoryTiles, 
	tiles: { result, loading }, 
	moveCategoryTile, 
	insertCategoryTile, 
	removeCategoryTile,
	insertNewCategoryTile,
	updateCategoryTile,
	deleteCategoryTile,
	showModal,
	language
}) => {
	const [displayTiles, setDisplayTiles] = useState([]);
	const [insertState, setInsertState] = useState();
	const [editState, setEditState] = useState({});

	useEffect(() => {
		loadCategoryTiles({ categoryId });
	}, [categoryId, loadCategoryTiles]);

	useEffect(() => {
		setDisplayTiles(result);
	}, [result]);

	if(!result && loading)
		return <EmptyState.Loading />;

	const handleInsert = index => setInsertState({ index });

	const handleInsertSubmit = ({ tile, newTile }) => {
		const payload = {
			index: insertState.index,
			tile
		};

		setInsertState(null);

		if(newTile)
			insertNewCategoryTile(payload);
		else
			insertCategoryTile(payload);
	};

	const handleMove = (sourceIndex, destIndex) => {
		moveCategoryTile({
			sourceIndex,
			destIndex
		});
	};

	const handleDelete = index => {
		const handleRemove = close => () => {
			removeCategoryTile({ index });
			close();
		};

		const handleDeleteTile = close => () => {
			deleteCategoryTile({ index });
			close();
		};

		showModal({
			title: <h3>Remove tile</h3>,
			// eslint-disable-next-line react/display-name, react/prop-types
			content: ({ close }) => (
				<RemoveTileModal 
					onRemove={handleRemove(close)} 
					onDelete={handleDeleteTile(close)}
					onCancel={close} />
			)
		});
	};

	const handleEdit = index => setEditState({ index, tile: displayTiles[index] });

	const handleEditSubmit = tile => {
		updateCategoryTile({
			index: editState.index,
			tile
		});

		setEditState({});
	};

	return (
		<div className="content-tile-edit-view">
			<TileEditView 
				onInsert={handleInsert}
				onMove={handleMove}
				onEdit={handleEdit}
				onDelete={handleDelete}>

				{mapTiles(displayTiles)}
			</TileEditView>

			{loading && <LoadingOverlay />}

			<Modal 
				className="content-tile-edit-view-modal" 
				isOpen={!!insertState} 
				onRequestClose={() => setInsertState(null)}>

				<ResponsiveModalFrame 
					className="content-tile-edit-view-insert"
					title={<h2>Insert tile</h2>} 
					onRequestClose={() => setInsertState(null)}>
					
					<InsertTileView 
						onSubmit={handleInsertSubmit} 
						categoryId={categoryId}
						language={language} />
				</ResponsiveModalFrame>
			</Modal>

			<Modal 
				className="content-tile-edit-view-modal" 
				isOpen={!!editState.tile} 
				onRequestClose={() => setEditState({})}>

				<ResponsiveModalFrame title={<h2>Edit tile</h2>} onRequestClose={() => setEditState({})}>
					<EditTileView 
						tile={editState.tile}
						language={language} 
						onSubmit={handleEditSubmit} 
						onCancel={() => setEditState({})} />
				</ResponsiveModalFrame>
			</Modal>
		</div>
	);
};

ContentTileEditView.propTypes = {
	categoryId: PropTypes.string.isRequired,
	language: PropTypes.string,

	loadCategoryTiles: PropTypes.func.isRequired,
	tiles: PropTypes.object.isRequired,
	moveCategoryTile: PropTypes.func.isRequired,
	insertCategoryTile: PropTypes.func.isRequired,
	removeCategoryTile: PropTypes.func.isRequired,
	insertNewCategoryTile: PropTypes.func.isRequired,
	updateCategoryTile: PropTypes.func.isRequired,
	deleteCategoryTile: PropTypes.func.isRequired,
	showModal: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	tiles: state.tiles.categoryTiles
});
 
export default connect(mapStateToProps, { 
	loadCategoryTiles, 
	moveCategoryTile, 
	insertCategoryTile, 
	removeCategoryTile,
	insertNewCategoryTile,
	updateCategoryTile,
	deleteCategoryTile,
	showModal
})(ContentTileEditView);