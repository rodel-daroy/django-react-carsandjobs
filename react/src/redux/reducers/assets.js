import { apiReducers, successType } from 'utils/redux';
import { LOAD_ASSETS, CREATE_ASSET } from 'redux/actions/assets';
import { combineReducers } from 'redux';

const assets = apiReducers(LOAD_ASSETS, {
	[successType(LOAD_ASSETS)]: (state, action) => {
		const { result, payload } = action;

		if(result && payload) {
			const { startIndex } = payload;
			const { assets, totalCount } = result;

			const all = [...(state.all || [])];
			all.length = totalCount;

			for(let i = 0; i < assets.length; ++i)
				all[i + startIndex] = assets[i];

			return {
				...state,
				all
			};
		}
		else
			return state;
	}
});

const createAsset = apiReducers(CREATE_ASSET);

export default combineReducers({
	assets,
	createAsset,
});