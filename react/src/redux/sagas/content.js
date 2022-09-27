import { apiSagaHandleError } from './helpers';
import service from 'services';
import { LOAD_ARTICLE, LOAD_TILES, LOAD_ASSET } from '../actions/content';
import { all } from 'redux-saga/effects';

const loadArticle = apiSagaHandleError(service.getArticle, LOAD_ARTICLE);

const loadTiles = apiSagaHandleError(service.getTiles, LOAD_TILES);

const loadAsset = apiSagaHandleError(service.getAsset, LOAD_ASSET);

export default function* () {
	yield all([
		loadArticle,
		loadTiles,
		loadAsset
	]);
}