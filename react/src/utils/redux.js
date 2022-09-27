import { call, put, takeEvery, all, fork, cancel } from 'redux-saga/effects';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';

export const actionCreator = type => (payload, options) => ({
	...options,
	type,
	payload
});

export const successType = type => type + '_SUCCESS';
export const failType = type => type + '_FAIL';
export const reloadType = type => type + '_RELOAD';
export const clearType = type => type + '_CLEAR';

export const getApiReducers = type => ({
	[type]: state => ({
		...state,
		
		error: null,
		loading: true
	}),
	[reloadType(type)]: state => ({
		...state,

		error: null,
		loading: true
	}),
	[successType(type)]: (state, action) => ({
		...state,

		result: (typeof action.result !== 'undefined') ? action.result : state.result,
		loading: false
	}),
	[failType(type)]: (state, action) => ({
		...state,

		error: action.error,
		loading: false
	}),
	[clearType(type)]: state => ({
		...state,

		error: null,
		result: null
	})
});

export const apiReducers = (type, otherReducers = {}, initialState = { result: null, error: null, loading: false }) => {
	const types = (typeof type === 'string') ? [type] : type;
	const reducers = Object.assign({}, ...types.map(t => getApiReducers(t)));

	return (state = initialState, action) => {
		let actionReducers = [];

		if(reducers[action.type])
			actionReducers.push(reducers[action.type]);
			
		if(otherReducers[action.type])
			actionReducers.push(otherReducers[action.type]);

		return actionReducers.reduce((state, current) => current(state, action), state);
	};
};

export const apiResultSelector = (key, defaultValue = {}) => state => get(state, key + '.result', defaultValue);
export const apiErrorSelector = key => state => get(state, key + '.error');

export const apiSaga = (method, type, { alwaysFetch, errorType } = {}) => {
	let lastPayload;
	let loaded = false;
	let triggered = false;

	let loadTask;

	function* doLoad(payload, transformError) {
		try {
			triggered = true;

			const result = yield call(method, payload);

			lastPayload = payload;
			loaded = true;

			yield put({ type: successType(type), result, payload });
		}
		catch(error) {
			let err = transformError ? transformError(error) : error;

			yield put({ type: failType(type), error: err });
		}
	}

	function* handleLoad({ payload, forceFetch, cancelPrevious, transformError }) {
		const isCached = loaded && isEqual(payload, lastPayload);
		const requireFetch = forceFetch || alwaysFetch;

		if(isCached && !requireFetch)
			yield put({ type: successType(type) });
		else {
			if(cancelPrevious && loadTask)
				yield cancel(loadTask);

			loadTask = yield fork(doLoad, payload, transformError);
		}
	}

	function* handleReload() {
		if(triggered) {
			try {
				const result = yield call(method, lastPayload);

				yield put({ type: successType(type), result });
			}
			catch(error) {
				yield put({ type: failType(type), error });
			}
		}
	}

	function* handleError({ error }) {
		if(errorType)
			yield put({ type: errorType, error });
	}

	return all([
		takeEvery(type, handleLoad),
		takeEvery(reloadType(type), handleReload),
		takeEvery(failType(type), handleError)
	]);
};

export const putReducer = type => (state = {}, action) => {
	if(action.type === type) {
		return {
			...state,
			...action.result
		};
	}
	else {
		return state;
	}
};

export const apiPromise = (stateSelect, ms = 200) => {
	return new Promise((resolve, reject) => {
		const interval = setInterval(() => {
			const { loading, result, error } = stateSelect();

			if(!loading) {
				clearInterval(interval);

				if(error)
					reject(error);
				else
					resolve(result);
			}
		}, ms);
	});
};