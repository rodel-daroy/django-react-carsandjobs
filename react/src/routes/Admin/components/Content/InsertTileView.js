import React from 'react';
import PropTypes from 'prop-types';
import UnusedTileSelector from './UnusedTileSelector';
import TabSet from 'components/Navigation/TabSet';
import TileForm from './TileForm';
import CategoryTileSelector from './CategoryTileSelector';
import './InsertTileView.css';

const InsertTileView = ({ onSubmit, categoryId, language }) => {
	const handleUnusedTile = (index, tile) => onSubmit({ tile, newTile: false });
	const handleNewTile = tile => onSubmit({ tile, newTile: true });
	const handleCopyTile = (index, tile) => onSubmit({ tile, newTile: true });

	return (
		<div className="insert-tile-view">
			<TabSet name="insertTileTabs" className="insert-tile-view-tabs">
				<TabSet.Tab caption="Create new tile">
					{() => (
						<TileForm 
							initialValues={{ 
								columns: 1, 
								language 
							}} 
							onSubmit={handleNewTile} />
					)}
				</TabSet.Tab>
				<TabSet.Tab caption="Copy existing tile">
					{() => (
						<CategoryTileSelector 
							onChange={handleCopyTile} 
							categoryId={categoryId} 
							language={language} />
					)}
				</TabSet.Tab>
				<TabSet.Tab caption="Trash">
					{() => (
						<UnusedTileSelector 
							language={language} 
							onChange={handleUnusedTile} />
					)}
				</TabSet.Tab>
			</TabSet>
		</div>
	);
};

InsertTileView.propTypes = {
	onSubmit: PropTypes.func.isRequired,
	categoryId: PropTypes.string,
	language: PropTypes.string
};
 
export default InsertTileView;