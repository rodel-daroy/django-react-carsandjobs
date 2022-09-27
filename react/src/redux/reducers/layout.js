import {
	SET_SCROLLING_ENABLED,
	SET_GLOBAL_OVERLAY
} from '../actions/layout';

const initialState = {
	scrolling: true,
	globalOverlay: null
};

const layout = (state = initialState, action) => {
	switch(action.type) {
		case SET_SCROLLING_ENABLED:
			return {
				...state,

				scrolling: action.payload
			};

		case SET_GLOBAL_OVERLAY:
			return {
				...state,

				globalOverlay: action.payload
			};

		default:
			return state;
	}
};

export default layout;