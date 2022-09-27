import { apiSagaHandleError, handleError } from './helpers';
import service from 'services';
import { all, takeEvery, select, put, call } from 'redux-saga/effects';
import { 
	LOAD_CATEGORIES,
	LOAD_CATEGORY_TILES,
	MOVE_CATEGORY_TILE,
	INSERT_CATEGORY_TILE,
	REMOVE_CATEGORY_TILE,
	LOAD_UNUSED_TILES,
	INSERT_NEW_CATEGORY_TILE,
	UPDATE_CATEGORY_TILE,
	LOOKUP_CATEGORY_TILES,
	DELETE_CATEGORY_TILE,
	LOOKUP_ARTICLES
} from 'redux/actions/tiles';
import { successType } from 'utils/redux';

const loadCategories = apiSagaHandleError(service.getTileCategories, LOAD_CATEGORIES);
const loadCategoryTiles = apiSagaHandleError(service.getCategoryTiles, LOAD_CATEGORY_TILES, { alwaysFetch: true });

function* saveCategoryTiles(tiles) {
	const categoryId = yield select(state => state.tiles.categoryTiles.categoryId);
	const tileIds = tiles.map(tile => tile.id);

	yield call(service.setTileOrder, {
		categoryId, 
		tiles: tileIds
	});

	return yield call(service.getCategoryTiles, { categoryId });
}

const moveCategoryTile = takeEvery(MOVE_CATEGORY_TILE, function* ({ payload }) {
	try {
		let { sourceIndex, destIndex } = payload;
		const { result } = yield select(state => state.tiles.categoryTiles);

		const newResult = result.slice();
		const tile = newResult.splice(sourceIndex, 1)[0];

		if(sourceIndex < destIndex)
			--destIndex;

		newResult.splice(destIndex, 0, tile);

		yield put({ 
			type: successType(MOVE_CATEGORY_TILE),
			result: yield saveCategoryTiles(newResult)
		});
	}
	catch(e) {
		yield handleError(e, MOVE_CATEGORY_TILE);
	}
});

function* insert(index, tile) {
	const { result } = yield select(state => state.tiles.categoryTiles);

	const newResult = result.slice();
	newResult.splice(index, 0, tile);

	return yield saveCategoryTiles(newResult);
}

const insertCategoryTile = takeEvery(INSERT_CATEGORY_TILE, function* ({ payload }) {
	try {
		const { index, tile } = payload;
		const result = yield insert(index, tile);

		yield put({ 
			type: successType(INSERT_CATEGORY_TILE),
			result
		});
	}
	catch(e) {
		yield handleError(e, INSERT_CATEGORY_TILE);
	}
});

const removeCategoryTile = takeEvery(REMOVE_CATEGORY_TILE, function* ({ payload }) {
	try {
		const { index } = payload;
		const { result } = yield select(state => state.tiles.categoryTiles);

		const newResult = result.slice();
		newResult.splice(index, 1);

		yield put({ 
			type: successType(REMOVE_CATEGORY_TILE),
			result: yield saveCategoryTiles(newResult)
		});
	}
	catch(e) {
		yield handleError(e, REMOVE_CATEGORY_TILE);
	}
});

const insertNewCategoryTile = takeEvery(INSERT_NEW_CATEGORY_TILE, function* ({ payload }) {
	try {
		let { index, tile } = payload;
		tile = {
			...tile,

			id: undefined,
			name: tile.name ? tile.name : tile.tileHeadline,
			tileAsset: tile.tileAsset ? tile.tileAsset.id : undefined,
			category: undefined
		};
			
		const newTile = yield call(service.createTile, tile);

		yield put({
			type: successType(INSERT_NEW_CATEGORY_TILE),
			result: yield insert(index, newTile)
		});
	}
	catch(e) {
		yield handleError(e, INSERT_NEW_CATEGORY_TILE);
	}
});

const updateCategoryTile = takeEvery(UPDATE_CATEGORY_TILE, function* ({ payload }) {
	try {
		let { index, tile } = payload;
		tile = {
			...tile,

			category: undefined,
			tileAsset: tile.tileAsset ? tile.tileAsset.id : undefined
		};

		const updatedTile = yield call(service.updateTile, tile);

		const { result } = yield select(state => state.tiles.categoryTiles);
		const newTiles = result.slice();
		newTiles[index] = updatedTile;

		yield put({
			type: successType(UPDATE_CATEGORY_TILE),
			result: yield saveCategoryTiles(newTiles)
		});
	}
	catch(e) {
		yield handleError(e, UPDATE_CATEGORY_TILE);
	}
});

const deleteCategoryTile = takeEvery(DELETE_CATEGORY_TILE, function* ({ payload }) {
	try {
		const { index } = payload;
		const { result, categoryId } = yield select(state => state.tiles.categoryTiles);

		const { id: tileId } = result[index];
		yield call(service.deleteTile, { tileId });

		yield put({
			type: successType(DELETE_CATEGORY_TILE),
			result: yield call(service.getCategoryTiles, { categoryId })
		});
	}
	catch(e) {
		yield handleError(e, DELETE_CATEGORY_TILE);
	}
});

const loadUnusedTiles = apiSagaHandleError(service.getUnusedTiles, LOAD_UNUSED_TILES, { alwaysFetch: true });

const lookupCategoryTiles = apiSagaHandleError(service.getCategoryTiles, LOOKUP_CATEGORY_TILES, { alwaysFetch: true });

const lookupArticles = apiSagaHandleError(service.getArticles, LOOKUP_ARTICLES, { alwaysFetch: true });

export default function* () {
	yield all([
		loadCategories,
		loadCategoryTiles,

		moveCategoryTile,
		insertCategoryTile,
		removeCategoryTile,
		insertNewCategoryTile,
		updateCategoryTile,
		deleteCategoryTile,

		loadUnusedTiles,

		lookupCategoryTiles,
		lookupArticles
	]);
}