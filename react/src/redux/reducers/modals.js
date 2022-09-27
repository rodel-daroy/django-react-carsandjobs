import { SHOW_MODAL } from '../actions/modals';

const initialState = {
	modal: null
};

export default (state = initialState, action) => {
	switch (action.type) {
		case SHOW_MODAL: {
			return { 
				...state, 
				modal: action.payload
			};
		}

		default:
			return state;
	}
};