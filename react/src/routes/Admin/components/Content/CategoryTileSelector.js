import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import TileCategoryDropdown from './TileCategoryDropdown';
import TileSelectView from 'components/Tiles/TileSelectView';
import { connect } from 'react-redux';
import { lookupCategoryTiles } from 'redux/actions/tiles';
import LoadingOverlay from 'components/Common/LoadingOverlay';
import { mapTiles } from 'components/Tiles/helpers';
import usePrevious from 'hooks/usePrevious';

const CategoryTileSelector = ({ 
	lookupCategoryTiles, 
	tiles: { result: tiles, loading }, 
	onChange, 
	categoryId, 
	tileId,
	language: initialLanguage
}) => {
	const [category, setCategory] = useState(categoryId);
	const [language, setLanguage] = useState(initialLanguage);

	const handleCategoryChange = useCallback(category => {
		setCategory(category);
		if(category)
			lookupCategoryTiles({ categoryId: category });
	}, [lookupCategoryTiles]);

	const prevCategoryId = usePrevious(categoryId);
	useEffect(() => {
		if(categoryId && categoryId !== prevCategoryId)
			handleCategoryChange(categoryId);
	}, [categoryId, prevCategoryId, handleCategoryChange]);

	const handleTileChange = index => onChange(index, tiles[index]);

	const selectedIndex = tileId ? tiles.findIndex(tile => tile.id === tileId) : null;

	return (
		<div>
			<TileCategoryDropdown 
				value={category} 
				language={language} 
				onChange={handleCategoryChange} 
				onChangeLanguage={setLanguage} />

			{category && (
				<TileSelectView onChange={handleTileChange} index={selectedIndex}>
					{mapTiles(tiles)}
				</TileSelectView>
			)}

			{loading && <LoadingOverlay />}
		</div>
	);
};

CategoryTileSelector.propTypes = {
	categoryId: PropTypes.string,
	tileId: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	language: PropTypes.string,
	onChangeLanguage: PropTypes.func,

	lookupCategoryTiles: PropTypes.func.isRequired,
	tiles: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	tiles: state.tiles.lookupCategoryTiles
});
 
export default connect(mapStateToProps, { lookupCategoryTiles })(CategoryTileSelector);