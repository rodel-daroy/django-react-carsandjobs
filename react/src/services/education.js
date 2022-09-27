import sortBy from 'lodash/sortBy';

export const getProgrammes = async (service, { language, ...body }) => {
	const results = await service.fetch({
		method: 'POST',
		url: 'education/programmes/',
		headers: {
			'Accept-Language': language
		},
		body
	});

	return {
		...results,
		
		programmes: results.programmes.map(r => ({
			...r,

			title: r.title[language || 'en'],
			schoolName: r.schoolName[language || 'en']
		}))
	};
};

export const getPlaceholders = async (service, { language }) => {
	const results = await service.fetch({
		method: 'GET',
		url: 'education/placeholders/',
		headers: {
			'Accept-Language': language
		}
	});

	return sortBy(results.map(r => ({
		...r,

		title: r.title[language || 'en'],
		description: r.description[language || 'en']
	})), ['title']);
};