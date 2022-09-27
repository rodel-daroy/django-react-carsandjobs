import { 
	LOAD_JOB_STATS, 
	LOAD_APPLICATION_STATS, 
	LOAD_CREDIT_REPORT, 
	LOAD_ALL_DEALERS, 
	LOAD_INVOICES, 
	LOAD_DEALER, 
	EXPORT_INVOICES 
} from '../actions/admin';
import { apiReducers, successType } from 'utils/redux';
import { combineReducers } from 'redux';

const jobStats = apiReducers(LOAD_JOB_STATS);
const applicationStats = apiReducers(LOAD_APPLICATION_STATS);
const creditReport = apiReducers(LOAD_CREDIT_REPORT, {
	[successType(LOAD_CREDIT_REPORT)]: (state, action) => {
		const { result, payload } = action;

		if(result && payload) {
			const { startIndex } = payload;
			const { credits, totalCount } = result;

			let all = (state.all || []).slice();
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

const allDealers = apiReducers(LOAD_ALL_DEALERS);
const dealer = apiReducers(LOAD_DEALER);

const invoices = apiReducers(LOAD_INVOICES, {
	[successType(LOAD_INVOICES)]: (state, action) => {
		const { result, payload } = action;

		if(result && payload) {
			const { startIndex } = payload;
			const { invoices, totalCount } = result;

			const all = [...(state.all || [])];
			all.length = totalCount;

			for(let i = 0; i < invoices.length; ++i)
				all[i + startIndex] = invoices[i];

			return {
				...state,
				all
			};
		}
		else
			return state;
	}
});

const exportInvoices = apiReducers(EXPORT_INVOICES);

export default combineReducers({
	jobStats,
	applicationStats,
	creditReport,
	allDealers,
	dealer,
	invoices,
	exportInvoices
});