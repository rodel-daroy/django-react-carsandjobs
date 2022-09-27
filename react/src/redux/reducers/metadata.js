import { SAVE_METADATA, REMOVE_METADATA } from 'redux/actions/metadata';
import omit from 'lodash/omit';

const initialState = {
	metadata: {}
};

export default (state = initialState, action) => {
	switch (action.type) {
		case SAVE_METADATA: {
			return { 
				...state, 
				metadata: Object.assign({}, state.metadata, { [action.payload.key]: action.payload.metadata })
			};
		}

		case REMOVE_METADATA: {
			return {
				...state,
				metadata: omit(state.metadata, [action.payload.key])
			};
		}

		default:
			return state;
	}
};
