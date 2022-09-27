import { all, call, put, takeLatest } from 'redux-saga/effects';
import service from 'services';
import { successType } from 'utils/redux';
import isEqual from 'lodash/isEqual';
import { LOAD_PROGRAMMES, LOAD_MORE_PROGRAMMES, LOAD_PLACEHOLDERS } from '../actions/education';
import { apiSagaHandleError, handleError } from './helpers';
import { LOAD_COUNT } from 'config/constants';

const loadProgrammes = (() => {
	let lastFilter, lastResult, lastLanguage;

	function* doLoad(filter, language) {
		try {
			const result = yield call(service.getProgrammes, { filter, startIndex: 0, count: LOAD_COUNT, language });

			lastFilter = filter;
			lastResult = result;
			lastLanguage = language;

			yield put({ type: successType(LOAD_PROGRAMMES), result });
		}
		catch(error) {
			yield handleError(error, LOAD_PROGRAMMES);
		}
	}

	function* handleLoad({ payload: { filter, language } }) {
		const newFilter = !isEqual(filter, lastFilter) || lastLanguage !== language;
		if(newFilter)
			yield doLoad(filter, language);
		else
			yield put({ type: successType(LOAD_PROGRAMMES) });
	}

	function* handleLoadMore() {
		try {
			const result = yield call(service.getProgrammes, { 
				filter: lastFilter, 
				startIndex: lastResult.programmes.length, 
				count: LOAD_COUNT,
				language: lastLanguage
			});

			lastResult = {
				...result,

				programmes: [...lastResult.programmes, ...result.programmes]
			};

			yield put({ type: successType(LOAD_PROGRAMMES), result: lastResult });
		}
		catch(error) {
			yield handleError(error, LOAD_PROGRAMMES);
		}
	}

	return all([
		takeLatest(LOAD_PROGRAMMES, handleLoad),
		takeLatest(LOAD_MORE_PROGRAMMES, handleLoadMore)
	]);
})();

const loadPlaceholders = apiSagaHandleError(service.getPlaceholders, LOAD_PLACEHOLDERS);

export default function* () {
	yield all([
		loadProgrammes,
		loadPlaceholders
	]);
}