import { actionCreator } from 'utils/redux';

export const LOAD_ARTICLE = 'content/LOAD_ARTICLE';
export const LOAD_TILES = 'content/LOAD_TILES';
export const LOAD_ASSET = 'content/LOAD_ASSET';

export const loadArticle = actionCreator(LOAD_ARTICLE);
export const loadTiles = actionCreator(LOAD_TILES);
export const loadAsset = actionCreator(LOAD_ASSET);