import { actionCreator } from 'utils/redux';

export const ERROR = 'common/ERROR';
export const CLEAR_ERROR = 'common/CLEAR_ERROR';

export const error = error => ({
	type: ERROR,
	error
});

export const clearError = actionCreator(CLEAR_ERROR);