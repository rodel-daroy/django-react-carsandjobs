import { LOAD_ARTICLE, LOAD_TILES, LOAD_ASSET } from '../actions/content';
import { apiReducers, successType } from 'utils/redux';
import { combineReducers } from 'redux';

const article = apiReducers(LOAD_ARTICLE);

const tiles = apiReducers(LOAD_TILES, {
	[successType(LOAD_TILES)]: (state, action) => {
		if(!action.payload)
			return state;
		else
			return {
				...state,

				all: {
					...state.all,

					[action.payload.name]: action.result
				}
			};
	}
}, { all: {} });

const asset = apiReducers(LOAD_ASSET, {
	[successType(LOAD_ASSET)]: (state, action) => {
		if(!action.payload)
			return state;
		else
			return {
				...state,

				all: {
					...state.all,

					[action.payload.name]: action.result
				}
			};
	}
});

export default combineReducers({
	article,
	tiles,
	asset
});