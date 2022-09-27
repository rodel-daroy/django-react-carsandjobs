import { apiSagaHandleError, handleError } from './helpers';
import { 
	LOAD_JOB_STATS, 
	LOAD_APPLICATION_STATS, 
	LOAD_CREDIT_REPORT, 
	LOAD_ALL_DEALERS, 
	LOAD_INVOICES, 
	LOAD_DEALER, 
	EXPORT_INVOICES 
} from '../actions/admin';
import service from 'services';
import { all, takeEvery, call, put } from 'redux-saga/effects';
import { successType } from 'utils/redux';

const loadJobStats = apiSagaHandleError(service.getJobStats, LOAD_JOB_STATS);
const loadApplicationStats = apiSagaHandleError(service.getApplicationStats, LOAD_APPLICATION_STATS);
const loadCreditReport = apiSagaHandleError(service.getCreditReport, LOAD_CREDIT_REPORT, { alwaysFetch: true });

const loadAllDealers = apiSagaHandleError(service.getAllDealers, LOAD_ALL_DEALERS);
const loadDealer = apiSagaHandleError(service.getDealer, LOAD_DEALER, { alwaysFetch: true });

const loadInvoices = apiSagaHandleError(service.getInvoices, LOAD_INVOICES);

const exportInvoices = takeEvery(EXPORT_INVOICES, function*({ payload }) {
	try {
		const result = yield call(service.getInvoices, payload);
		yield put({ type: successType(EXPORT_INVOICES), payload, result });
	}
	catch(error) {
		yield handleError(error, EXPORT_INVOICES);
	}
});

export default function* () {
	yield all([
		loadJobStats,
		loadApplicationStats,
		loadCreditReport,
		loadAllDealers,
		loadDealer,
		loadInvoices,
		exportInvoices
	]);
}