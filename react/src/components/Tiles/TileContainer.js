import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadTiles } from 'redux/actions/content';
import { language, region } from 'redux/selectors';
import get from 'lodash/get';
import TileView from './TileView';
import { mapTiles } from './helpers';
import EmptyState from 'components/Layout/EmptyState';

const DEFAULT_TILE_CONTAINER = 'Homepage Default';

const TileContainer = ({ name, loadTiles, tiles, loading, language, province }) => {
	useEffect(() => {
		loadTiles({ name, province, language });
	}, [name, province, language, loadTiles]);

	const mappedTiles = useMemo(() => mapTiles(tiles), [tiles]);

	if(loading)
		return (
			<EmptyState.Loading />
		);

	return (
		<TileView>
			{mappedTiles}
		</TileView>
	);
};

TileContainer.propTypes = {
	name: PropTypes.string,

	loadTiles: PropTypes.func.isRequired,
	tiles: PropTypes.array,
	loading: PropTypes.bool,
	language: PropTypes.string.isRequired,
	province: PropTypes.string.isRequired
};

TileContainer.defaultProps = {
	name: DEFAULT_TILE_CONTAINER
};

const mapStateToProps = (state, { name = DEFAULT_TILE_CONTAINER }) => ({
	tiles: get(state, `content.tiles.all[${name}]`),
	loading: state.content.tiles.loading,
	language: language(state),
	province: region(state)
});

export default connect(mapStateToProps, { loadTiles })(TileContainer);