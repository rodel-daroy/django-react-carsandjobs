import castArray from 'lodash/castArray';
import pickBy from 'lodash/pickBy';

export const searchResumes = async (service, filter) => service.fetch({
	method: 'POST',
	url: 'profile/new-resume-search/',
	body: pickBy(filter, value => !!value)
});

export const getJobPostings = async (service, { dealer: dealer_id, ...filter }) => service.fetch({
	method: 'POST',
	url: 'jobs/by-dealer/',
	body: {
		...filter,
		dealer_id: [dealer_id]
	}
});

export const getJobPosting = async (service, { id }) => service.fetch({
	method: 'GET',
	url: `jobs/by-dealer/${id}/`
});

/* eslint-disable-next-line */
export const createJobPosting = async (service, { language, postDate, closingDate, ...body }) => service.fetch({
	method: 'POST',
	url: 'jobs/create/',
	headers: {
		'Accept-Language': language
	},
	body
});

/* eslint-disable-next-line */
export const updateJobPosting = async (service, { language, id, postDate, closingDate, ...body }) => service.fetch({
	method: 'POST',
	url: `jobs/update/${id}/`,
	headers: {
		'Accept-Language': language
	},
	body
});

export const getApplications = async (service, { id }) => {
	const result = await service.fetch({
		method: 'GET',
		url: `profile/job-posting/${id}/applications/`
	});

	return result.map(({ coverLetter: coverLetterText, ...otherProps }) => ({
		...otherProps,
		coverLetterText
	}));
};

export const getApplication = async (service, { id }) => {
	const result = await service.fetch({
		method: 'GET',
		url: `profile/job-application/${id}/`
	});

	return {
		...result,
		coverLetterText: result.coverLetter
	};
};

export const getCreditPrices = async service => service.fetch({
	method: 'GET',
	url: 'job-credits/credits/'
});

export const getCredits = async (service, { startIndex: start_index, count }) => {
	const body = {
		start_index,
		count
	};

	const result = await service.fetch({
		method: 'POST',
		url: 'job-credits/user-credit-history/',
		body
	});

	const { 'job-credit-history': credits, ...otherProps } = result;
	return {
		...otherProps,
		credits
	};
};

export const getDealerCredits = async (service, { dealer, ...otherBody }) => {
	const result = await service.fetch({
		method: 'POST',
		url: 'job-credits/dealer-credit-history/',
		body: {
			...otherBody,
			filter: {
				dealer
			}
		}
	});

	const { 'job-credit-history': credits, ...otherProps } = result;
	return {
		...otherProps,
		credits
	};
};

export const applyCredits = async (service, body) => service.fetch({
	method: 'POST',
	url: 'job-credits/buy-credits-new/',
	body
});

export const getInvoice = async (service, { id }) => {
	const result = await service.fetch({
		method: 'GET',
		url: `job-credits/invoices/${id}/`
	});

	return castArray(result)[0];
};

export const getCreditBalance = async (service, { dealer }) => {
	const result = await service.fetch({
		method: 'GET',
		url: `job-credits/balance/${dealer}/`
	});

	return castArray(result)[0];
};

export const applyPromoCode = async (service, { dealer, promoCode }) => {
	const { creditApplied } = await service.fetch({
		method: 'POST',
		url: 'job-credits/buy-credits-with-promocode/',
		body: {
			dealer,
			promocode: promoCode
		}
	});

	return {
		creditsApplied: creditApplied
	};
};

export const publishJobPosting = async (service, { id, ...otherProps }) => service.fetch({
	method: 'POST',
	url: `jobs/publish/${id}/`,
	body: {
		...otherProps
	}
});

export const deleteJobPosting = async (service, { id }) => service.fetch({
	method: 'DELETE',
	url: `jobs/delete/${id}/`
});

export const getTemplates = async (service, { language = '*' } = {}) => service.fetch({
	method: 'GET',
	url: 'employer/templates/',
	headers: {
		'Accept-Language': language
	}
});

export const getTemplate = async (service, { id }) => service.fetch({
	method: 'GET',
	url: `employer/templates/${id}/`
});