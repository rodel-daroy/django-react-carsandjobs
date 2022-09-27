import { actionCreator } from 'utils/redux';

export const LOAD_JOBS = 'jobs/LOAD_JOBS';
export const LOAD_MORE_JOBS = 'jobs/LOAD_MORE_JOBS';

export const LOAD_JOB_DETAIL = 'jobs/LOAD_JOB_DETAIL';

export const LOAD_JOB_LOOKUPS = 'jobs/LOAD_JOB_LOOKUPS';

export const SAVE_JOB = 'jobs/SAVE_JOB';
export const UNSAVE_JOB = 'jobs/UNSAVE_JOB';
export const LOAD_SAVED_JOBS = 'jobs/LOAD_SAVED_JOBS';

export const APPLY = 'jobs/APPLY';

export const LOAD_APPLICATION_HISTORY = 'jobs/LOAD_APPLICATION_HISTORY';


export const loadJobs = actionCreator(LOAD_JOBS);
export const loadMoreJobs = actionCreator(LOAD_MORE_JOBS);

export const loadJobDetail = actionCreator(LOAD_JOB_DETAIL);

export const loadLookups = actionCreator(LOAD_JOB_LOOKUPS);

export const saveJob = actionCreator(SAVE_JOB);
export const unsaveJob = actionCreator(UNSAVE_JOB);
export const loadSavedJobs = actionCreator(LOAD_SAVED_JOBS);

export const apply = actionCreator(APPLY);

export const loadApplicationHistory = actionCreator(LOAD_APPLICATION_HISTORY);