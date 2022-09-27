import {
	SET_LOCALE,
	GET_LOCALIZED_STRINGS,
	LOAD_NAVIGATION
} from '../actions/localization';
import { apiReducers, successType } from 'utils/redux';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { DEFAULT_LANGUAGE, DEFAULT_PROVINCE } from 'config/constants';

const initialState = {
	language: DEFAULT_LANGUAGE,
	region: DEFAULT_PROVINCE,
	userLocale: false
};

let current = (state = initialState, action) => {
	switch(action.type) {
		case SET_LOCALE: 
			return {
				...state,

				userLocale: false,
				...action.payload
			};

		default: return state;
	}
};

const persistConfig = {
	key: 'localization',
	storage
};

current = persistReducer(persistConfig, current);

const strings = apiReducers(GET_LOCALIZED_STRINGS, {
	[successType(GET_LOCALIZED_STRINGS)]: (state, { result, payload }) => {
		if(!result || !payload)
			return state;
		else {
			return {
				...state,

				groups: {
					...(state.groups || {}),

					[payload.groupName]: result
				}
			};
		}
	}
});

const navigation = apiReducers(LOAD_NAVIGATION, {
	[successType(LOAD_NAVIGATION)]: (state, action) => {
		if(action.payload)
			return {
				...state,

				all: {
					...state.all,

					[action.payload.name]: action.result
				}
			};
		else
			return state;
	}
}, { all: {} });

export default combineReducers({
	current,
	strings,
	navigation
});