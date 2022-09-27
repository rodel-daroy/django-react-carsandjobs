import { actionCreator } from 'utils/redux';

export const LOAD_JOB_STATS = 'admin/LOAD_JOB_STATS';
export const LOAD_APPLICATION_STATS = 'admin/LOAD_APPLICATION_STATS';
export const LOAD_CREDIT_REPORT = 'admin/LOAD_CREDIT_REPORT';

export const LOAD_ALL_DEALERS = 'admin/LOAD_ALL_DEALERS';
export const LOAD_DEALER = 'admin/LOAD_DEALER';

export const LOAD_INVOICES = 'admin/LOAD_INVOICES';
export const EXPORT_INVOICES = 'admin/EXPORT_INVOICES';

export const loadJobStats = actionCreator(LOAD_JOB_STATS);
export const loadApplicationStats = actionCreator(LOAD_APPLICATION_STATS);
export const loadCreditReport = actionCreator(LOAD_CREDIT_REPORT);

export const loadAllDealers = actionCreator(LOAD_ALL_DEALERS);
export const loadDealer = actionCreator(LOAD_DEALER);

export const loadInvoices = actionCreator(LOAD_INVOICES);
export const exportInvoices = actionCreator(EXPORT_INVOICES);