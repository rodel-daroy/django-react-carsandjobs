import { all, put, takeEvery, select, call } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { apiSagaHandleError } from './helpers';
import service from 'services';
import ApiError from 'services/ApiError';
import { SIGN_IN_JOBSEEKER, SIGN_IN_DEALER, SIGN_IN_TADA, SIGN_IN, SIGN_OUT, INVALIDATE_TOKEN, REFRESH_TOKEN } from 'redux/actions/user';
import { successType, failType } from 'utils/redux';
import { ERROR } from 'redux/actions/common';
import { authToken, isSignedIn } from 'redux/selectors';
import { REHYDRATE } from 'redux-persist';
import { REFRESH_TOKEN_INTERVAL } from 'config/constants';

const signInJobseeker = apiSagaHandleError(service.signInJobseeker, SIGN_IN_JOBSEEKER, { alwaysFetch: true });
const signInDealer = apiSagaHandleError(service.signInDealer, SIGN_IN_DEALER, { alwaysFetch: true });
const signInTada = apiSagaHandleError(service.signInTada, SIGN_IN_TADA, { alwaysFetch: true });

function* setToken() {
	const token = yield select(authToken);
	service.token = token;
}

function* handleAllSignIn(action) {
	yield setToken();

	yield put({
		...action,

		type: successType(SIGN_IN)
	});

	yield call(delay, REFRESH_TOKEN_INTERVAL);
	yield backgroundRefreshToken();
}

const allSignIn = takeEvery([
	successType(SIGN_IN_JOBSEEKER),
	successType(SIGN_IN_DEALER),
	successType(SIGN_IN_TADA)
], handleAllSignIn);

function* handleUnauthorized({ error }) {
	if(error instanceof ApiError && error.status === 401)
		yield put({ type: SIGN_OUT });
}

const unauthorizedErrors = takeEvery(ERROR, handleUnauthorized);

const refreshToken = takeEvery(REFRESH_TOKEN, function* ({ payload }) {
	const { throwError } = payload || {};

	try {
		const result = yield call(service.refreshToken);

		yield put({ type: successType(REFRESH_TOKEN), result, payload });
	}
	catch(error) {
		// all API errors become authentication errors
		if(error instanceof ApiError)
			error.status = 401;

		yield put({ type: failType(REFRESH_TOKEN), error });

		if(throwError)
			yield put({ type: ERROR, error });
	}
});

const updateToken = takeEvery([
	SIGN_OUT,
	INVALIDATE_TOKEN, 
	successType(REFRESH_TOKEN),
	failType(REFRESH_TOKEN)
], setToken);

function* backgroundRefreshToken() {
	while(yield select(isSignedIn)) {
		yield put({ type: REFRESH_TOKEN });

		yield call(delay, REFRESH_TOKEN_INTERVAL);
	}
}

const handleRehydrate = takeEvery(REHYDRATE, function* (action) {
	if(action.key === 'user') {
		if(yield select(isSignedIn)) {
			yield setToken();
			
			yield backgroundRefreshToken();
		}
	}
});

export default function* () {
	yield all([
		signInJobseeker,
		signInDealer,
		signInTada,
		allSignIn,
		unauthorizedErrors,
		refreshToken,
		updateToken,
		handleRehydrate
	]);
}