import { combineReducers } from 'redux';
import { apiReducers, successType, getApiReducers } from 'utils/redux';
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

const categories = apiReducers(LOAD_CATEGORIES);

const categoryTiles = apiReducers(LOAD_CATEGORY_TILES, {
	[successType(LOAD_CATEGORY_TILES)]: (state, action) => ({
		...state,
		categoryId: action.payload.categoryId
	}),

	...getApiReducers(MOVE_CATEGORY_TILE),
	...getApiReducers(INSERT_CATEGORY_TILE),
	...getApiReducers(REMOVE_CATEGORY_TILE),
	...getApiReducers(INSERT_NEW_CATEGORY_TILE),
	...getApiReducers(UPDATE_CATEGORY_TILE),
	...getApiReducers(DELETE_CATEGORY_TILE)
});

const unusedTiles = apiReducers(LOAD_UNUSED_TILES);

const lookupCategoryTiles = apiReducers(LOOKUP_CATEGORY_TILES);
const lookupArticles = apiReducers(LOOKUP_ARTICLES);

export default combineReducers({
	categories,
	categoryTiles,
	unusedTiles,
	lookupCategoryTiles,
	lookupArticles
});