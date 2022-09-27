import { fetchApi } from 'services/helpers';

const BASE_URL = 'https://api.autolife.ca/';

const fetchAL = url => {
	const fullUrl = BASE_URL + url;

	return fetchApi(fullUrl, json => json.message);
};

export const getMakes = async () => {
	const { data } = await fetchAL('marketplace/jatomakes');
	return data;
};

export const getModels = async ({ make }) => {
	const { data } = await fetchAL(`marketplace/jato_models/${make}`);
	return data;
};