import { apiSaga, failType } from 'utils/redux';
import { ERROR } from '../actions/common';
import { put } from 'redux-saga/effects';

export const apiSagaHandleError = (method, type, { alwaysFetch } = {}) => 
	apiSaga(method, type, { alwaysFetch, errorType: ERROR });

export function* handleError(error, ...types) {
	for(const type of types)
		yield put({ type: failType(type), error });

	yield put({ type: ERROR, error });
}
