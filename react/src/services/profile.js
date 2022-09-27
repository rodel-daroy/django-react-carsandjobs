import moment from 'moment';

export const register = (service, { phone, ...otherBody }) => service.fetch({
	method: 'POST',
	url: 'profile/register/',
	body: {
		...otherBody,
		phone: phone || ''
	},
	sensitive: true
});

export const resendVerificationEmail = (service, { email }) => service.fetch({
	method: 'POST',
	url: 'profile/send-email-verification-email/',
	body: {
		email
	}
});

export const getProfile = (service) => service.fetch({
	method: 'GET',
	url: 'profile/details/'
});

export const updateProfile = (service, body) => service.fetch({
	method: 'POST',
	url: 'profile/details/',
	body,
	sensitive: true
});

export const getCoverLetters = service => service.fetch({
	method: 'GET',
	url: 'profile/cover-letters/'
});

export const addCoverLetter = (service, body) => service.fetch({
	method: 'POST',
	url: 'profile/cover-letter/',
	body
});

export const setCoverLetterActive = (service, { id, active }) => service.fetch({
	method: 'POST',
	url: `profile/cover-letter-active/${id}/`,
	body: {
		active
	}
});

export const updateCoverLetter = (service, { id, ...otherProps }) => service.fetch({
	method: 'POST',
	url: `profile/cover-letter/${id}/`,
	body: {
		id,
		...otherProps
	}
});

export const deleteCoverLetter = (service, { id }) => service.fetch({
	method: 'DELETE',
	url: `profile/cover-letter/${id}/`
});

export const uploadResume = (service, { file }) => {
	const formData = new FormData();
	formData.append('file', file);

	return service.fetch({
		method: 'POST',
		url: 'profile/resume-file/',
		body: formData
	});
};

export const addResume = async (service, body) => service.fetch({
	method: 'POST',
	url: 'profile/resume/',
	body: {
		description: '',
		...body,

		post_date: moment().toISOString()
	}
});

export const updateResume = (service, { id, ...otherProps }) => service.fetch({
	method: 'POST',
	url: `profile/resume/${id}/`,
	body: {
		description: '',
		...otherProps,

		post_date: moment().toISOString()
	}
});

export const getResumes = service => service.fetch({
	method: 'GET',
	url: 'profile/resumes/'
});

export const getResume = (service, { id }) => service.fetch({
	method: 'GET',
	url: `profile/resume/${id}/`
});

export const setResumeActive = (service, { id, active }) => service.fetch({
	method: 'POST',
	url: `profile/resume-active/${id}/`,
	body: {
		active
	}
});

export const setResumeSearchable = (service, { id, searchable }) => service.fetch({
	method: 'POST',
	url: `profile/resume-searchable/${id}/`,
	body: {
		searchable
	}
});

export const deleteResume = async (service, { id }) => service.fetch({
	method: 'DELETE',
	url: `profile/resume/${id}/`
});

export const getSearches = service => service.fetch({
	method: 'GET',
	url: 'profile/searches/'
});

export const saveSearch = (service, body) => service.fetch({
	method: 'POST',
	url: 'profile/search/',
	body
});

export const deleteSearch = (service, { id }) => service.fetch({
	method: 'DELETE',
	url: `profile/search/${id}/`
});

export const resetPassword = async (service, body) => service.fetch({
	method: 'POST',
	url: 'profile/forgot-password/',
	body
});

export const updatePassword = async (service, body) => service.fetch({
	method: 'POST',
	url: 'profile/reset-password/',
	body
});

export const verifyEmail = async (service, { token, email }) => service.fetch({
	method: 'POST',
	url: 'profile/verify-email/',
	body: {
		token,
		email
	}
});