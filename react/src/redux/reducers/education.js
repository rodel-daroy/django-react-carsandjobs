import { LOAD_PROGRAMMES, LOAD_MORE_PROGRAMMES, LOAD_PLACEHOLDERS } from '../actions/education';
import { apiReducers } from 'utils/redux';
import { combineReducers } from 'redux';

const programmes = apiReducers(LOAD_PROGRAMMES, {
	[LOAD_MORE_PROGRAMMES]: state => ({
		...state,

		loading: true
	})
});

const placeholders = apiReducers(LOAD_PLACEHOLDERS);

export default combineReducers({
	programmes,
	placeholders
});