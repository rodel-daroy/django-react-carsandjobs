import { apiReducers, successType, putReducer } from 'utils/redux';
import { combineReducers } from 'redux';

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
} from 'redux/actions/jobs';

const updateSavedJobs = (state, action) => {
	if(state.result && state.result.jobs) {
		const jobId = action.result.id;
		const index = state.result.jobs.findIndex(job => job.id === jobId);

		const newJobs = [...state.result.jobs];
		if(index !== -1)
			newJobs[index] = action.result;

		return {
			...state,

			result: {
				...state.result,
				jobs: newJobs
			}
		};
	}
	else
		return state;
};

const updateAppliedJobs = (state, action) => {
	if(state.result && state.result.jobs) {
		const { job: { id: jobId, appliedDate } } = action.result;
		const index = state.result.jobs.findIndex(job => job.id === jobId);

		const newJobs = [...state.result.jobs];
		if(index !== -1)
			newJobs[index] = {
				...newJobs[index],

				appliedDate
			};

		return {
			...state,

			result: {
				...state.result,
				jobs: newJobs
			}
		};
	}
	else
		return state;
};

const jobs = apiReducers(LOAD_JOBS, {
	[LOAD_MORE_JOBS]: state => ({
		...state,

		loading: true
	}),

	[successType(SAVE_JOB)]: updateSavedJobs,
	[successType(UNSAVE_JOB)]: updateSavedJobs,

	[successType(APPLY)]: updateAppliedJobs
});

const updateSavedJobDetail = (state, action) => {
	if(state.result) {
		const jobId = action.result.id;

		if(jobId === state.result.id) {
			return {
				...state,

				result: {
					...action.result
				}
			};
		}
	}

	return state;
};

const updateAppliedJobDetail = (state, action) => {
	if(state.result) {
		const { job: { id: jobId, appliedDate } } = action.result;

		if(jobId === state.result.id) {
			return {
				...state,

				result: {
					...state.result,
					appliedDate
				}
			};
		}
	}

	return state;
};

const jobDetail = apiReducers(LOAD_JOB_DETAIL, {
	[successType(SAVE_JOB)]: updateSavedJobDetail,
	[successType(UNSAVE_JOB)]: updateSavedJobDetail,

	[successType(APPLY)]: updateAppliedJobDetail
});

const applications = combineReducers({
	apply: apiReducers(APPLY),
	history: apiReducers(LOAD_APPLICATION_HISTORY)
});

export default combineReducers({
	jobs,
	jobDetail,
	lookups: putReducer(successType(LOAD_JOB_LOOKUPS)),
	savedJobs: apiReducers(LOAD_SAVED_JOBS),
	applications
});

export const selectLookups = state => state.jobs.lookups;