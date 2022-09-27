export const signInJobseeker = (service, { email, password }) => service.fetch({ 
	method: 'POST', 
	url: 'profile/login/',
	body: {
		email,
		password
	},
	sensitive: true
});

export const signInDealer = async (service, { email: username, password }) => {
	const result = await service.fetch({ 
		method: 'POST', 
		url: 'profile/cada-login/',
		body: {
			username,
			password
		},
		sensitive: true
	});

	if(result && result.data && result.data.role != null)
		result.data.role = parseInt(result.data.role, 10);

	return result;
};

export const signInTada = async (service, { token }) => {
	const result = await service.fetch({
		method: 'POST',
		url: 'profile/tada-login/',
		body: {
			token
		},
		sensitive: true
	});

	if(result && result.data && result.data.role != null)
		result.data.role = parseInt(result.data.role, 10);

	return result;
};

export const refreshToken = async service => service.fetch({
	method: 'POST',
	url: 'profile/refresh/',
	body: {
		token: service.token
	},
	sensitive: true
});