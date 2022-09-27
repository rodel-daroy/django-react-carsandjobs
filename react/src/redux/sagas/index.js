import { all } from 'redux-saga/effects';

import commonSaga from './common';
import jobsSaga from './jobs';
import profileSaga from './profile';
import employerSaga from './employer';
import educationSaga from './education';
import localizationSaga from './localization';
import contactSaga from './contact';
import contentSaga from './content';
import adminSaga from './admin';
import userSaga from './user';
import geolocationSaga from './geolocation';
import autoLifeSaga from './autolife';
import tilesSaga from './tiles';
import assetsSaga from './assets';

export default function* rootSaga() {
	yield all([
		commonSaga(),
		jobsSaga(),
		profileSaga(),
		employerSaga(),
		localizationSaga(),
		educationSaga(),
		contactSaga(),
		contentSaga(),
		adminSaga(),
		userSaga(),
		geolocationSaga(),
		autoLifeSaga(),
		tilesSaga(),
		assetsSaga()
	]);
}