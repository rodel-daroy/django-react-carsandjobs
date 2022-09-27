import { apiReducers, successType } from 'utils/redux';
import { 
	LOAD_RESUME_SEARCH, 
	LOAD_MORE_RESUME_SEARCH, 
	LOAD_APPLICATIONS, 
	LOAD_JOB_POSTINGS,
	LOAD_JOB_POSTING, 
	CREATE_JOB_POSTING, 
	LOAD_CREDITS, 
	APPLY_CREDITS, 
	LOAD_CREDIT_PRICES, 
	UPDATE_JOB_POSTING,
	PUBLISH_JOB_POSTING, 
	LOAD_INVOICE,
	LOAD_CREDIT_BALANCE,
	LOAD_CREDIT_BALANCES,
	LOAD_DEALER_CREDITS,
	APPLY_PROMO_CODE,
	REPUBLISH_JOB_POSTING,
	LOAD_APPLICATION,
	DELETE_JOB_POSTING,
	LOAD_TEMPLATES,
	LOAD_TEMPLATE
} from '../actions/employer';
import { combineReducers } from 'redux';

const resumeSearch = apiReducers(LOAD_RESUME_SEARCH, {
	[LOAD_MORE_RESUME_SEARCH]: state => ({
		...state,

		loading: true
	})
});

const publishSuccessReducer = (state, action) => {
	const { result, payload } = action;

	if(result && payload && state.all) {
		const index = state.all.findIndex(p => p.id === result.id);

		const { views, jobApplications } = state.all[index];

		let all = state.all.slice();
		all[index] = {
			...result,
			views,
			jobApplications
		};

		return {
			...state,
			all
		};
	}
	else
		return state;
};

const postings = apiReducers(LOAD_JOB_POSTINGS, {
	[successType(LOAD_JOB_POSTINGS)]: (state, action) => {
		const { result, payload } = action;

		if(result && payload) {
			const { startIndex } = payload;
			const { jobs, totalCount } = result;

			const all = [...(state.all || [])];
			all.length = totalCount;

			for(let i = 0; i < jobs.length; ++i)
				all[i + startIndex] = jobs[i];

			return {
				...state,
				all
			};
		}
		else
			return state;
	},

	[successType(PUBLISH_JOB_POSTING)]: publishSuccessReducer,
	[successType(REPUBLISH_JOB_POSTING)]: publishSuccessReducer,

	[successType(DELETE_JOB_POSTING)]: (state, action) => {
		const { result, payload: { id } } = action;

		if(result && id) {
			const all = [...(state.all || [])];
			const index = all.findIndex(posting => posting.id === id);

			if(index > -1)
				all.splice(index, 1);

			return {
				...state,
				all
			};
		}
		else
			return state;
	}
});

const singlePosting = apiReducers(LOAD_JOB_POSTING);

const createPosting = apiReducers(CREATE_JOB_POSTING);
const updatePosting = apiReducers(UPDATE_JOB_POSTING);

const publishPosting = apiReducers(PUBLISH_JOB_POSTING);

const deletePosting = apiReducers(DELETE_JOB_POSTING);

const applications = apiReducers(LOAD_APPLICATIONS);
const application = apiReducers(LOAD_APPLICATION);

const credits = apiReducers(LOAD_CREDITS, {
	[successType(LOAD_CREDITS)]: (state, action) => {
		const { result, payload } = action;

		if(result && payload) {
			const { startIndex } = payload;
			const { credits, totalCount } = result;

			const all = [...(state.all || [])];
			all.length = totalCount;

			for(let i = 0; i < credits.length; ++i)
				all[i + startIndex] = credits[i];

			return {
				...state,
				all
			};
		}
		else
			return state;
	}
});

const applyCredits = apiReducers(APPLY_CREDITS);
const creditPrices = apiReducers(LOAD_CREDIT_PRICES);
const creditBalance = apiReducers(LOAD_CREDIT_BALANCE, {
	[successType(LOAD_CREDIT_BALANCE)]: (state, action) => {
		const { result, payload } = action;

		if(result && payload) {
			const dealer = {
				...(state.dealer || {}),

				[payload.dealer]: result.balance
			};

			return {
				...state,
				dealer
			};
		}
		else
			return state;
	}
});

const creditBalances = apiReducers(LOAD_CREDIT_BALANCES);
const dealerCredits = apiReducers(LOAD_DEALER_CREDITS, {
	[successType(LOAD_DEALER_CREDITS)]: (state, action) => {
		const { result, payload } = action;

		if(result && payload) {
			const { startIndex } = payload;

			const { credits, totalCount } = result;

			const all = [...(state.all || [])];
			all.length = totalCount;

			for(let i = 0; i < credits.length; ++i)
				all[i + startIndex] = credits[i];

			return {
				...state,
				all
			};
		}
		
		return state;
	}
});

const promoCode = apiReducers(APPLY_PROMO_CODE);

const invoice = apiReducers(LOAD_INVOICE);

const templates = apiReducers(LOAD_TEMPLATES);
const template = apiReducers(LOAD_TEMPLATE);

export default combineReducers({
	resumeSearch,
	postings,
	singlePosting,
	createPosting,
	updatePosting,
	publishPosting,
	deletePosting,
	applications,
	application,
	credits,
	applyCredits,
	creditPrices,
	creditBalance,
	creditBalances,
	dealerCredits,
	promoCode,
	invoice,
	templates,
	template
});