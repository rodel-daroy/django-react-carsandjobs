import { apiSagaHandleError } from './helpers';
import { LOAD_ASSETS, CREATE_ASSET } from 'redux/actions/assets';
import service from 'services';
import { all } from 'redux-saga/effects';

const loadAssets = apiSagaHandleError(service.getAssets, LOAD_ASSETS);
const createAsset = apiSagaHandleError(service.createAsset, CREATE_ASSET, { alwaysFetch: true });

export default function* () {
	yield all([
		loadAssets,
		createAsset
	]);
}