import { actionCreator } from 'utils/redux';

export const LOAD_RESUME_SEARCH = 'employer/LOAD_RESUME_SEARCH';
export const LOAD_MORE_RESUME_SEARCH = 'employer/LOAD_MORE_RESUME_SEARCH';

export const LOAD_JOB_POSTINGS = 'employer/LOAD_JOB_POSTINGS';

export const LOAD_JOB_POSTING = 'employer/LOAD_JOB_POSTING';

export const CREATE_JOB_POSTING = 'employer/CREATE_JOB_POSTING';
export const UPDATE_JOB_POSTING = 'employer/UPDATE_JOB_POSTING';

export const PUBLISH_JOB_POSTING = 'employer/PUBLISH_JOB_POSTING';
export const REPUBLISH_JOB_POSTING = 'employer/REPUBLISH_JOB_POSTING';

export const DELETE_JOB_POSTING = 'employer/DELETE_JOB_POSTING';

export const LOAD_APPLICATIONS = 'employer/LOAD_APPLICATIONS';
export const LOAD_APPLICATION = 'employer/LOAD_APPLICATION';

export const LOAD_CREDITS = 'employer/LOAD_CREDITS';
export const APPLY_CREDITS = 'employer/APPLY_CREDITS';
export const LOAD_CREDIT_PRICES = 'employer/LOAD_CREDIT_PRICES';
export const LOAD_CREDIT_BALANCE = 'employer/LOAD_CREDIT_BALANCE';
export const LOAD_CREDIT_BALANCES = 'employer/LOAD_CREDIT_BALANCES';
export const LOAD_DEALER_CREDITS = 'employer/LOAD_DEALER_CREDITS';
export const APPLY_PROMO_CODE = 'employer/APPLY_PROMO_CODE';

export const LOAD_INVOICE = 'employer/LOAD_INVOICE';

export const LOAD_TEMPLATES = 'employer/LOAD_TEMPLATES';
export const LOAD_TEMPLATE = 'employer/LOAD_TEMPLATE';

export const loadResumeSearch = actionCreator(LOAD_RESUME_SEARCH);
export const loadMoreResumeSearch = actionCreator(LOAD_MORE_RESUME_SEARCH);

export const loadJobPostings = actionCreator(LOAD_JOB_POSTINGS);

export const loadJobPosting = actionCreator(LOAD_JOB_POSTING);

export const createJobPosting = actionCreator(CREATE_JOB_POSTING);
export const updateJobPosting = actionCreator(UPDATE_JOB_POSTING);

export const publishJobPosting = actionCreator(PUBLISH_JOB_POSTING);
export const republishJobPosting = actionCreator(REPUBLISH_JOB_POSTING);

export const deleteJobPosting = actionCreator(DELETE_JOB_POSTING);

export const loadApplications = actionCreator(LOAD_APPLICATIONS);
export const loadApplication = actionCreator(LOAD_APPLICATION);

export const loadCredits = actionCreator(LOAD_CREDITS);
export const applyCredits = actionCreator(APPLY_CREDITS);
export const loadCreditPrices = actionCreator(LOAD_CREDIT_PRICES);
export const loadCreditBalance = actionCreator(LOAD_CREDIT_BALANCE);
export const loadCreditBalances = actionCreator(LOAD_CREDIT_BALANCES);
export const loadDealerCredits = actionCreator(LOAD_DEALER_CREDITS);
export const applyPromoCode = actionCreator(APPLY_PROMO_CODE);

export const loadInvoice = actionCreator(LOAD_INVOICE);

export const loadTemplates = actionCreator(LOAD_TEMPLATES);
export const loadTemplate = actionCreator(LOAD_TEMPLATE);