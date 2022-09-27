import castArray from 'lodash/castArray';

export const getAssets = async (service, body) => service.fetch({
	method: 'POST',
	url: 'assets/all/',
	body
});

export const createAsset = async (service, { file, ...other }) => {
	const formData = new FormData();
	formData.append('file', castArray(file)[0]);
	
	for(const [key, value] of Object.entries(other))
		formData.append(key, value);

	const result = await service.fetch({
		method: 'POST',
		url: 'assets/create/',
		body: formData
	});

	return result[0];
};