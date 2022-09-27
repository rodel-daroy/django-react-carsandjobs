import moment from 'moment';
import pickBy from 'lodash/pickBy';

export const getJobs = async (service, { filter, ...otherProps }) => {
	const language = (filter && filter.language) || '*';

	if(filter && filter.age)
		filter = Object.assign({}, filter, { 
			postDate: moment().subtract(filter.age, 'days').toISOString().split('T')[0]
		});

	if(filter && filter.department)
		filter = Object.assign({}, filter, {
			department: filter.department
		});

	filter = pickBy(filter, value => !!value);

	const result = await service.fetch({
		method: 'POST',
		url: 'jobs/job-search/',
		headers: {
			'Accept-Language': language
		},
		body: {
			...otherProps,
			filter
		}
	});

	const { jobs, ...otherResult } = result;

	return {
		jobs: jobs.map(({ dealer, confidential, ...other }) => ({
			company: confidential ? null : dealer,
			confidential,
			...other
		})),

		...otherResult
	};
};

export const getJobDetail = async (service, { id, language }) => {
	const result = await service.fetch({
		method: 'GET',
		url: `jobs/job-details/${id}/`,
		headers: {
			'Accept-Language': language
		}
	});

	const { dealer, confidential, ...otherProps } = result;

	return {
		company: confidential ? null : dealer,
		confidential,
		...otherProps
	};
};

const lookupMethod = url => async service => service.fetch({
	method: 'GET',
	url,
	headers: {
		'Accept-Language': '*'
	}
});

export const getDepartments = lookupMethod('jobs/departments/');
export const getPositionTypes = lookupMethod('jobs/position-types/');
export const getExperiences = lookupMethod('jobs/experiences/');
export const getEducations = lookupMethod('jobs/educations/');
export const getCategories = lookupMethod('jobs/department-category/');

export const saveJob = async (service, { id }) => {
	const result = await service.fetch({
		method: 'POST',
		url: 'jobs/save/',
		body: {
			id
		}
	});

	const { dealer, confidential, ...otherProps } = result;

	return {
		company: confidential ? null : dealer,
		confidential,
		...otherProps
	};
};

export const unsaveJob = async (service, { id }) => {
	const result = await service.fetch({
		method: 'POST',
		url: 'jobs/unsave/',
		body: {
			id
		}
	});

	const { dealer, confidential, ...otherProps } = result;

	return {
		company: confidential ? null : dealer,
		confidential,
		...otherProps
	};
};

export const getSavedJobs = async (service) => service.fetch({
	method: 'GET',
	url: 'jobs/saved/'
});

export const apply = async (service, { jobId, cellphone: cellPhone, ...otherProps }) => service.fetch({
	method: 'POST',
	url: `jobs/${jobId}/apply/`,
	body: {
		jobId,
		cellPhone,
		...otherProps
	}
});

export const getApplicationHistory = async service => {
	const result = await service.fetch({
		method: 'GET',
		url: 'jobs/applications/'
	});

	return result.map(({ job: { dealer: company, ...otherJob }, ...otherProps }) => ({
		...otherProps,
		job: {
			...otherJob,
			company
		}
	}));
};