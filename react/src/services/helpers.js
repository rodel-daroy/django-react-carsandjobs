import ApiError from './ApiError';

export const fetchApi = async (request, parseError, metadata) => {
	let response;
	try {
		response = await fetch(request);
	}
	catch(error) {
		throw new ApiError(error.message, request, metadata);
	}

	if(response.ok)
		return await response.json();
	else {
		let message = null;
		let json;

		if(parseError)
			try {
				json = await response.json();
				message = parseError(json);
			}
			/* eslint-disable no-empty */
			catch(error) {}
			/* eslint-enable no-empty */

		throw new ApiError(message, request, {
			status: response.status,
			response: json
		});
	}
};