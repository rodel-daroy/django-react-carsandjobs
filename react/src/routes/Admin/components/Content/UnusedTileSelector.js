import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { integer } from 'airbnb-prop-types';
import { connect } from 'react-redux';
import { loadUnusedTiles } from 'redux/actions/tiles';
import { language } from 'redux/selectors';
import EmptyState from 'components/Layout/EmptyState';
import TileSelectView from 'components/Tiles/TileSelectView';
import { mapTiles } from 'components/Tiles/helpers';
import DropdownField from 'components/Forms/DropdownField';
import { LANGUAGES } from 'config/constants';

const UnusedTileSelector = ({ 
	index, 
	onChange, 
	loadUnusedTiles, 
	unusedTiles: { result: unusedTiles, loading },
	language: initialLanguage,
	defaultLanguage
}) => {
	const [language, setLanguage] = useState(initialLanguage || defaultLanguage);

	useEffect(() => {
		loadUnusedTiles();
	}, [loadUnusedTiles]);

	const tiles = useMemo(() => {
		return (unusedTiles || []).filter(tile => tile.language === language);
	}, [unusedTiles, language]);

	const handleChange = index => {
		if(onChange) {
			const tile = tiles[index];
			const mappedIndex = unusedTiles.indexOf(t => t.id === tile.id);

			onChange(mappedIndex, tile);
		}
	};

	return (
		<div>
			<DropdownField
				label="Language"
				options={LANGUAGES.map(lang => ({
					label: lang[0],
					value: lang[1]
				}))}
				value={language}
				searchable={false}
				onChange={setLanguage} />

			<React.Fragment>
				{(tiles && tiles.length > 0) && (
					<TileSelectView index={index} onChange={handleChange}>
						{mapTiles(tiles)}
					</TileSelectView>
				)}

				{(!tiles || tiles.length === 0) && (
					<EmptyState>
						No unused tiles found
					</EmptyState>
				)}
			</React.Fragment>

			{loading && <EmptyState.Loading />}
		</div>
	);
};

UnusedTileSelector.propTypes = {
	index: integer(),
	onChange: PropTypes.func,
	language: PropTypes.string,

	unusedTiles: PropTypes.object.isRequired,
	loadUnusedTiles: PropTypes.func.isRequired,
	defaultLanguage: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
	unusedTiles: state.tiles.unusedTiles,
	defaultLanguage: language(state)
});
 
export default connect(mapStateToProps, { loadUnusedTiles })(UnusedTileSelector);