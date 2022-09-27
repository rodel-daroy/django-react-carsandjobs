import { actionCreator } from 'utils/redux';

export const LOAD_CATEGORIES = 'tiles/LOAD_CATEGORIES';
export const LOAD_CATEGORY_TILES = 'tiles/LOAD_CATEGORY_TILES';

export const INSERT_CATEGORY_TILE = 'tiles/INSERT_CATEGORY_TILE';
export const REMOVE_CATEGORY_TILE = 'tiles/REMOVE_CATEGORY_TILE';
export const MOVE_CATEGORY_TILE = 'tiles/MOVE_CATEGORY_TILE';
export const INSERT_NEW_CATEGORY_TILE = 'tiles/INSERT_NEW_CATEGORY_TILE';
export const UPDATE_CATEGORY_TILE = 'tiles/UPDATE_CATEGORY_TILE';
export const DELETE_CATEGORY_TILE = 'tiles/DELETE_CATEGORY_TILE';

export const LOAD_UNUSED_TILES = 'tiles/LOAD_UNUSED_TILES';

export const LOOKUP_CATEGORY_TILES = 'tiles/LOOKUP_CATEGORY_TILES';

export const LOOKUP_ARTICLES = 'tiles/LOOKUP_ARTICLES';

export const loadCategories = actionCreator(LOAD_CATEGORIES);
export const loadCategoryTiles = actionCreator(LOAD_CATEGORY_TILES);

export const insertCategoryTile = actionCreator(INSERT_CATEGORY_TILE);
export const removeCategoryTile = actionCreator(REMOVE_CATEGORY_TILE);
export const moveCategoryTile = actionCreator(MOVE_CATEGORY_TILE);
export const insertNewCategoryTile = actionCreator(INSERT_NEW_CATEGORY_TILE);
export const updateCategoryTile = actionCreator(UPDATE_CATEGORY_TILE);
export const deleteCategoryTile = actionCreator(DELETE_CATEGORY_TILE);

export const loadUnusedTiles = actionCreator(LOAD_UNUSED_TILES);

export const lookupCategoryTiles = actionCreator(LOOKUP_CATEGORY_TILES);

export const lookupArticles = actionCreator(LOOKUP_ARTICLES);