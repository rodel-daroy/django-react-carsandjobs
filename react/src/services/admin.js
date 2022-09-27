export const getJobStats = async (service) => service.fetch({
	method: 'GET',
	url: 'jobs/job-stats/'
});

export const getApplicationStats = async (service, body) => service.fetch({
	method: 'POST',
	url: 'jobs/application-stats/',
	body
});

export const getCreditReport = async (service, body) => {
	const result = await service.fetch({
		method: 'POST',
		url: 'job-credits/dealer-credit-history/',
		body
	});

	const { 'job-credit-history': credits, ...otherResult } = result;
	return {
		...otherResult,
		credits
	};
};

export const getAllDealers = async (service, { search } = {}) => service.fetch({
	method: 'GET',
	url: 'dealers/all-dealers/' + (search ? `?search=${search}` : '')
});

export const getDealer = async (service, { id }) => {
	const result = await service.fetch({
		method: 'GET',
		url: `dealers/dealer/${id}/`
	});

	if(result.length > 0)
		return result[0];

	return null;
};

export const getInvoices = async (service, { filter, ...otherBody }) => service.fetch({
	method: 'POST',
	url: 'job-credits/invoices/',
	body: {
		...otherBody,
		filter: {
			...(filter || {}),
			'sale-id': filter ? filter.paypalSaleId : null,
			'paid-only': filter && filter.paidOnly
		}
	}
});