import { SIGN_IN_JOBSEEKER, SIGN_IN_DEALER, SIGN_IN_TADA, SIGN_OUT, INVALIDATE_TOKEN, REFRESH_TOKEN } from '../actions/user';
import { apiReducers, successType, failType } from 'utils/redux';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import get from 'lodash/get';
import orderBy from 'lodash/orderBy';
import { JOBSEEKER_ORIGIN, DEALER_ORIGIN, TADA_ORIGIN } from '../selectors';

const signInJobseeker = apiReducers(SIGN_IN_JOBSEEKER);
const signInDealer = apiReducers(SIGN_IN_DEALER);
const signInTada = apiReducers(SIGN_IN_TADA);

const initialState = {
	signedIn: false
};

const ORIGIN = {
	[successType(SIGN_IN_JOBSEEKER)]: JOBSEEKER_ORIGIN,
	[successType(SIGN_IN_DEALER)]: DEALER_ORIGIN,
	[successType(SIGN_IN_TADA)]: TADA_ORIGIN
};

const sortDealers = result => {
	if(result.data && result.data.dealers) {
		let { data: { dealers } } = result;
		dealers = orderBy(dealers, ['name']);

		return {
			...result,

			data: {
				...result.data,
				dealers
			}
		};
	}

	return result;
};

let current = (state = initialState, action) => {
	const { type, result } = action;

	switch(type) {
		case SIGN_IN_JOBSEEKER:
		case SIGN_IN_DEALER:
		case SIGN_IN_TADA: {
			return {
				...state,

				error: null,
				loading: true,

				signedIn: false,
				origin: null,
				email: null
			};
		}

		case SIGN_OUT: {
			return {
				...state,

				signedIn: false,
				origin: null,
				email: null,
				result: null
			};
		}

		case successType(SIGN_IN_JOBSEEKER):
		case successType(SIGN_IN_DEALER):
		case successType(SIGN_IN_TADA): {
			return {
				...state,
				
				result: sortDealers(result),
				loading: false,

				signedIn: true,
				origin: ORIGIN[type],
				email: action.payload.email,
				
				refreshing: false
			};
		}

		case failType(SIGN_IN_JOBSEEKER):
		case failType(SIGN_IN_DEALER):
		case failType(SIGN_IN_TADA): {
			return {
				...state,

				loading: false,
				error: action.error,

				signedIn: false,
				origin: null,
				email: null
			};
		}

		case REFRESH_TOKEN: {
			return {
				...state,

				refreshing: true
			};
		}

		case INVALIDATE_TOKEN:
		case failType(REFRESH_TOKEN): {
			const hasToken = !!get(state, 'result.data.token');

			if(hasToken)
				return {
					...state,

					refreshing: false,
					refreshError: true,
					result: {
						...state.result,
	
						data: {
							...state.result.data,
							token: 'INVALID'
						}
					}
				};

			return {
				...state,

				refreshing: false,
				refreshError: true
			};
		}

		case successType(REFRESH_TOKEN): {
			return {
				...state,

				refreshing: false,
				refreshError: false,
				result: {
					...state.result,

					data: {
						...state.result.data,
						token: result.token
					}
				}
			};
		}

		default:
			return state;
	}
};

const persistConfig = {
	key: 'user',
	storage,
	blacklist: ['loading', 'error']
};

current = persistReducer(persistConfig, current);

export default combineReducers({
	signInJobseeker,
	signInDealer,
	signInTada,
	current
});