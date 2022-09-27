import { all, call, put, takeLatest, takeEvery, throttle } from 'redux-saga/effects';
import service from 'services';
import {
	LOAD_JOBS,
	LOAD_MORE_JOBS,
	LOAD_JOB_DETAIL,
	LOAD_JOB_LOOKUPS,
	LOAD_SAVED_JOBS,
	SAVE_JOB,
	UNSAVE_JOB,
	APPLY,
	LOAD_APPLICATION_HISTORY
} from '../actions/jobs';
import { successType, clearType } from 'utils/redux';
import isEqual from 'lodash/isEqual';
import { apiSagaHandleError, handleError } from './helpers';
import { SIGN_IN, SIGN_OUT } from '../actions/user';
import { REHYDRATE } from 'redux-persist';
import { LOAD_COUNT } from 'config/constants';

const loadJobDetail = apiSagaHandleError(service.getJobDetail, LOAD_JOB_DETAIL);

const loadJobs = (() => {
	let lastFilter, lastResult;

	function* doLoadJobs(filter, clear) {
		try {
			if(clear)
				yield put({ type: clearType(LOAD_JOBS) });

			const result = yield call(service.getJobs, { filter, startIndex: 0, count: LOAD_COUNT });

			lastFilter = filter;
			lastResult = result;

			yield put({ type: successType(LOAD_JOBS), result });
		}
		catch(error) {
			yield handleError(error, LOAD_JOBS);
		}
	}

	function* handleLoadJobs({ payload }) {
		const filter = payload;

		const newFilter = !isEqual(filter, lastFilter);
		if(newFilter)
			yield doLoadJobs(filter, !!lastFilter);
		else
			yield put({ type: successType(LOAD_JOBS) });
	}

	function* handleLoadMoreJobs() {
		try {
			const result = yield call(service.getJobs, { filter: lastFilter, startIndex: lastResult.jobs.length, count: LOAD_COUNT });

			lastResult = {
				...result,

				jobs: [...lastResult.jobs, ...result.jobs]
			};

			yield put({ type: successType(LOAD_JOBS), result: lastResult });
		}
		catch(error) {
			yield handleError(error, LOAD_JOBS);
		}
	}

	function* handleReloadJobs() {
		if(lastResult)
			yield doLoadJobs(lastFilter, true);
	}

	return all([
		takeLatest(LOAD_JOBS, handleLoadJobs),
		takeLatest(LOAD_MORE_JOBS, handleLoadMoreJobs),
		takeLatest([successType(SIGN_IN), SIGN_OUT, REHYDRATE], handleReloadJobs)
	]);
})();

const loadLookups = (() => {
	let lastResult;

	function* handleLoadLookups() {
		if(!lastResult || Object.keys(lastResult).length === 0) {
			try {
				const [departments, positionTypes, experiences, educations, categories] = yield all([
					call(service.getDepartments),
					call(service.getPositionTypes),
					call(service.getExperiences),
					call(service.getEducations),
					call(service.getCategories)
				]);

				const result = {
					departments,
					positionTypes,
					experiences,
					educations,
					categories
				};
				lastResult = result;

				yield put({ type: successType(LOAD_JOB_LOOKUPS), result });
			}
			catch(error) {
				yield handleError(error, LOAD_JOB_LOOKUPS);
			}
		}
		else
			yield put({ type: successType(LOAD_JOB_LOOKUPS) });
	}

	return throttle(1000, LOAD_JOB_LOOKUPS, handleLoadLookups);
})();

const loadSavedJobs = apiSagaHandleError(service.getSavedJobs, LOAD_SAVED_JOBS, { alwaysFetch: true });

const saveJob = apiSagaHandleError(service.saveJob, SAVE_JOB, { alwaysFetch: true });
const unsaveJob = apiSagaHandleError(service.unsaveJob, UNSAVE_JOB, { alwaysFetch: true });

function* handleReloadSavedJobs() {
	yield put({ type: LOAD_SAVED_JOBS });
}

const reloadJobsAfterSave = takeEvery([successType(SAVE_JOB), successType(UNSAVE_JOB)], handleReloadSavedJobs);

const apply = apiSagaHandleError(service.apply, APPLY, { alwaysFetch: true });

const loadApplicationHistory = apiSagaHandleError(service.getApplicationHistory, LOAD_APPLICATION_HISTORY, { alwaysFetch: true });

export default function* () {
	yield all([
		loadJobs,
		loadJobDetail,
		loadLookups,
		loadSavedJobs,
		saveJob,
		unsaveJob,
		reloadJobsAfterSave,
		apply,
		loadApplicationHistory
	]);
}