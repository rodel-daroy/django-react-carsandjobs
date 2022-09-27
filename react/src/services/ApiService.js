import Config from 'config';
import { fetchApi } from './helpers';

export default class ApiService {
	constructor(service, token = '') {
		this.token = token;

		for(const [key, value] of Object.entries(service)) {
			if(typeof value === 'function') {
				this[key] = (...args) => service[key](this, ...args);
			}
		}
	}

	async fetch({ method = 'GET', url, body, headers = {}, sensitive }) {
		const token = this.token;
		if(token)
			headers['Authorization'] = `CNJ ${token}`;

		if(!(body instanceof FormData)) {
			headers['Content-Type'] = 'application/json';
			body = body ? JSON.stringify(body) : undefined;
		}

		body = body || undefined;

		const request = new Request(Config.API + url, {
			method,
			body,
			headers
		});

		return fetchApi(request, json => json ? json.message : null, {
			signedIn: !!token,
			payload: sensitive ? null : body
		});
	}
}