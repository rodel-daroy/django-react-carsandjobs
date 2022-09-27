import { all, takeEvery, put } from 'redux-saga/effects';
import service from 'services';
import { apiSagaHandleError } from './helpers';
import { GET_LOCALIZED_STRINGS, SET_LOCALE, LOAD_NAVIGATION } from '../actions/localization';
import { REHYDRATE } from 'redux-persist';
import { LANGUAGES, PROVINCES } from 'config/constants';
import { getDefaultLocale } from 'utils/localization';

const getLocalizedStrings = apiSagaHandleError(service.getLocalizedStrings, GET_LOCALIZED_STRINGS);

function* validateRehyrated({ key, payload }) {
	if(key === 'localization') {
		const { language, region } = (payload || {});

		if(!LANGUAGES.find(l => l[1] === language) || !PROVINCES.find(p => p[1] === region))
			yield put({ 
				type: SET_LOCALE, 
				payload: getDefaultLocale()
			});
	}
}

const handleRehydrate = takeEvery(REHYDRATE, validateRehyrated);

const loadNavigation = apiSagaHandleError(service.getNavigation, LOAD_NAVIGATION);

export default function* () {
	yield all([
		getLocalizedStrings,
		handleRehydrate,
		loadNavigation
	]);
}