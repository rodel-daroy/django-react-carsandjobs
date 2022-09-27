export const getArticle = async (service, { id, language }) => {
	const content = await service.fetch({
		method: 'GET',
		url: `articles/${id}/`,
		headers: {
			'Accept-Language': language || '*'
		}
	});

	return content[0] || null;
};

export const getTiles = async (service, { name, province, language }) => service.fetch({
	method: 'POST',
	url: `tiles/${name}/`,
	headers: {
		'Accept-Language': language
	},
	body: {
		province
	}
});

export const getAsset = async (service, { name }) => {
	const result = await service.fetch({
		method: 'GET',
		url: `articles/asset/${name}/`
	});

	return result[0] || null;
};