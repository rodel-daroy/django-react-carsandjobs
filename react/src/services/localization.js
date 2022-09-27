export const getLocalizedStrings = async (service, { groupName, language }) => service.fetch({
	method: 'GET',
	url: `localized/${groupName}/`,
	headers: {
		'Accept-Language': language
	}
});

export const getNavigation = async (service, { name, /* language, */ region }) => {
	const result = await service.fetch({
		method: 'POST',
		url: 'localized/navigation/',
		headers: {
			'Accept-Language': '*'
		},
		body: {
			name,
			province: region
		}
	});

	if(result.length > 0) {
		const transformItem = item => {
			switch(item.signedIn) {
				case 'Only users not signed in':
					item.signedIn = false;
					break;

				case 'Only signed in users':
					item.signedIn = true;
					break;

				case 'Display for all users':
				default:
					item.signedIn = null;
					break;
			}

			for(const childItem of item.items)
				transformItem(childItem);

			return item;
		};

		return transformItem(result[0]).items;
	}
	else
		return [];
};