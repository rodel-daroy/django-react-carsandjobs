export const submitContactForm = (service, { mobile, ...other }) => service.fetch({
	method: 'POST',
	url: 'contact-us/',
	body: {
		...other,
		mobile: mobile || ''
	}
});