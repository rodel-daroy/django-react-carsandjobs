import { ERROR, CLEAR_ERROR } from '../actions/common';
import { combineReducers } from 'redux';

const error = (state = null, action) => {
	switch(action.type) {
		case ERROR:
			return action.error;

		case CLEAR_ERROR:
			return null;
		
		default:
			return state;
	}
};

export default combineReducers({
	error
});