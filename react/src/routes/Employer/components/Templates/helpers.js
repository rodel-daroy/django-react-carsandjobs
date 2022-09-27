export const jobPreviewFromTemplate = (dealers = [], defaultCompanyName = 'Your dealership') => ({ title, description, language, ...otherProps }) => {
	let company = {
		name: defaultCompanyName
	};
	if(dealers.length === 1)
		company = { ...dealers[0] };

	return {
		...otherProps,

		title: {
			[language]: title
		},
		description: {
			[language]: description
		},
		company
	};
};

export const jobPostingFromTemplate = (dealers = []) => ({ title, description, language, ...otherProps }) => ({
	dealer: (dealers.length === 1) ? dealers[0].id : undefined,
	title,
	description,
	language,
	...otherProps
});
