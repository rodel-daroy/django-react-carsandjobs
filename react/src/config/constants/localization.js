export const LANGUAGES = [
	['English', 'en'], 
	['Français', 'fr']
];

export const PROVINCES = [
	[{ en: 'Ontario', fr: 'Ontario' }, 'ON', 'en'],
	[{ en: 'Quebec', fr: 'Québec' }, 'QC', 'fr'],
	[{ en: 'Nova Scotia', fr: 'Nouvelle-Écosse' }, 'NS', 'en'],
	[{ en: 'New Brunswick', fr: 'Nouveau-Brunswick' }, 'NB', 'en'],
	[{ en: 'Manitoba', fr: 'Manitoba' }, 'MB', 'en'],
	[{ en: 'British Columbia', fr: 'Colombie-Britannique' }, 'BC', 'en'],
	[{ en: 'Prince Edward Island', fr: 'Île-du-Prince-Édouard' }, 'PE', 'en'],
	[{ en: 'Saskatchewan', fr: 'Saskatchewan' }, 'SK', 'en'],
	[{ en: 'Alberta', fr: 'Alberta' }, 'AB', 'en'],
	[{ en: 'Newfoundland and Labrador', fr: 'Terre-Neuve-et-Labrador' }, 'NL', 'en'],

	// territories
	[{ en: 'Northwest Territories', fr: 'Territoires du Nord-Ouest' }, 'NT', 'en'],
	[{ en: 'Yukon', fr: 'Yukon' }, 'YT', 'en'],
	[{ en: 'Nunavut', fr: 'Nunavut' }, 'NU', 'en']
];

export const DEFAULT_LANGUAGE = PROVINCES[0][2];
export const DEFAULT_PROVINCE = PROVINCES[0][1];

export const HOST_DEFAULT_LOCALES = [
	//['localhost', { region: 'BC', language: 'fr' }],
	['carrieresauto.com', { region: 'QC', language: 'fr' }]
];

export const DEFAULT_LOCALE = {
	region: DEFAULT_PROVINCE,
	language: DEFAULT_LANGUAGE
};