import { all, put, call, takeLatest, select, takeEvery } from 'redux-saga/effects';
import { successType } from 'utils/redux';
import isEqual from 'lodash/isEqual';
import service from 'services';
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
import { apiSagaHandleError, handleError } from './helpers';
import { LOAD_COUNT } from 'config/constants';
import { authDealers } from '../selectors';

const loadResumeSearch = (() => {
	let lastFilter, lastResult;

	function* doLoadResumeSearch(filter) {
		try {
			const result = yield call(service.searchResumes, { filter, startIndex: 0, count: LOAD_COUNT });

			lastFilter = filter;
			lastResult = result;

			yield put({ type: successType(LOAD_RESUME_SEARCH), result });
		}
		catch(error) {
			yield handleError(error, LOAD_RESUME_SEARCH);
		}
	}

	function* handleLoadResumeSearch({ payload }) {
		const filter = payload;

		const newFilter = !isEqual(filter, lastFilter);
		if(newFilter)
			yield doLoadResumeSearch(filter);
		else
			yield put({ type: successType(LOAD_RESUME_SEARCH) });
	}

	function* handleLoadMoreResumeSearch() {
		try {
			const result = yield call(service.searchResumes, { filter: lastFilter, startIndex: lastResult.resumes.length, count: LOAD_COUNT });

			lastResult = {
				...result,

				resumes: [...lastResult.resumes, ...result.resumes]
			};

			yield put({ type: successType(LOAD_RESUME_SEARCH), result: lastResult });
		}
		catch(error) {
			yield handleError(error, LOAD_RESUME_SEARCH);
		}
	}

	return all([
		takeLatest(LOAD_RESUME_SEARCH, handleLoadResumeSearch),
		takeLatest(LOAD_MORE_RESUME_SEARCH, handleLoadMoreResumeSearch)
	]);
})();

const loadPostings = apiSagaHandleError(service.getJobPostings, LOAD_JOB_POSTINGS, { alwaysFetch: true });

const loadSinglePosting = apiSagaHandleError(service.getJobPosting, LOAD_JOB_POSTING, { alwaysFetch: true });

const createJobPosting = apiSagaHandleError(service.createJobPosting, CREATE_JOB_POSTING, { alwaysFetch: true });
const updateJobPosting = apiSagaHandleError(service.updateJobPosting, UPDATE_JOB_POSTING, { alwaysFetch: true });

const publishJobPosting = apiSagaHandleError(service.publishJobPosting, PUBLISH_JOB_POSTING, { alwaysFetch: true });

const republishJobPosting = (() => {
	function* handleRepublish({ payload }) {
		const { id, postOnIndeed } = payload;

		try {
			yield call(service.publishJobPosting, {
				id,
				isPublished: false
			});
			const result = yield call(service.publishJobPosting, {
				id,
				isPublished: true,
				postOnIndeed
			});

			yield put({ type: successType(REPUBLISH_JOB_POSTING), payload, result });
		}
		catch(error) {
			yield handleError(error, REPUBLISH_JOB_POSTING);
		}
	}

	return takeEvery(REPUBLISH_JOB_POSTING, handleRepublish);
})();

const deleteJobPosting = apiSagaHandleError(service.deleteJobPosting, DELETE_JOB_POSTING, { alwaysFetch: true });

const loadApplications = apiSagaHandleError(service.getApplications, LOAD_APPLICATIONS);
const loadSingleApplication = apiSagaHandleError(service.getApplication, LOAD_APPLICATION);

const loadCredits = apiSagaHandleError(service.getCredits, LOAD_CREDITS, { alwaysFetch: true });

const applyCredits = apiSagaHandleError(service.applyCredits, APPLY_CREDITS, { alwaysFetch: true });

const loadCreditPrices = apiSagaHandleError(service.getCreditPrices, LOAD_CREDIT_PRICES, { alwaysFetch: true });

const loadCreditBalance = apiSagaHandleError(service.getCreditBalance, LOAD_CREDIT_BALANCE, { alwaysFetch: true });

const loadCreditBalances = (() => {
	function* handleLoadBalances() {
		try {
			const dealers = yield select(authDealers);

			const balances = yield all(dealers.map(({ id: dealer }) => call(service.getCreditBalance, { dealer })));

			const dealerBalances = dealers.map((dealer, i) => ({
				...dealer,
				...balances[i]
			}));

			yield put({ type: successType(LOAD_CREDIT_BALANCES), result: dealerBalances });
		}
		catch(error) {
			yield handleError(error, LOAD_CREDIT_BALANCES);
		}
	}

	return takeLatest(LOAD_CREDIT_BALANCES, handleLoadBalances);
})();

const loadDealerCredits = apiSagaHandleError(service.getDealerCredits, LOAD_DEALER_CREDITS, { alwaysFetch: true });

const applyPromoCode = apiSagaHandleError(service.applyPromoCode, APPLY_PROMO_CODE, { alwaysFetch: true });

const loadInvoice = apiSagaHandleError(service.getInvoice, LOAD_INVOICE);

function* handleUpdateBalances() {
	try {
		const dealers = yield select(authDealers);

		const balances = yield all(dealers.map(({ id: dealer }) => call(service.getCreditBalance, { dealer })));

		const dealerBalances = dealers.map((dealer, i) => ({
			...dealer,
			...balances[i]
		}));

		let puts = [];

		puts.push(put({ 
			type: successType(LOAD_CREDIT_BALANCES),
			result: dealerBalances 
		}));

		for(let i = 0; i < dealers.length; ++i)
			puts.push(put({ 
				type: successType(LOAD_CREDIT_BALANCE), 
				payload: {
					dealer: dealers[i].id
				},
				result: balances[i] 
			}));

		return yield all(puts);
	}
	catch(error) {
		yield handleError(error);
	}
}

const updateBalances = takeLatest([
	successType(UPDATE_JOB_POSTING), 
	successType(PUBLISH_JOB_POSTING), 
	successType(REPUBLISH_JOB_POSTING),
	successType(APPLY_CREDITS),
	successType(APPLY_PROMO_CODE)], handleUpdateBalances);

const loadTemplates = apiSagaHandleError(service.getTemplates, LOAD_TEMPLATES);
const loadTemplate = apiSagaHandleError(service.getTemplate, LOAD_TEMPLATE);

export default function* () {
	yield all([
		loadResumeSearch,
		loadPostings,
		loadSinglePosting,
		createJobPosting,
		updateJobPosting,
		publishJobPosting,
		republishJobPosting,
		deleteJobPosting,
		loadApplications,
		loadSingleApplication,
		loadCredits,
		applyCredits,
		loadCreditPrices,
		loadCreditBalance,
		loadCreditBalances,
		loadDealerCredits,
		applyPromoCode,
		loadInvoice,
		updateBalances,
		loadTemplates,
		loadTemplate
	]);
}