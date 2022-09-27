/* eslint-disable no-console */

import mapValues from 'lodash/mapValues';
import { randomLatency } from './common';

let groups = {};

const addGroup = name => {
	let keyValuePairs = {};

	keyValuePairs['BrowseJobs'] = {
		en: '# Browse jobs en',
		fr: '# Browse jobs fr'
	};
	keyValuePairs['FeaturedEmployers'] = {
		en: '# Featured employers en',
		fr: '# Featured employers fr'
	};

	for(let i = 0; i < 25; ++i) {
		keyValuePairs[`key${i}`] = {
			en: 'Lorem ipsum en',
			fr: 'Lorem ipsum fr'
		};
	}

	groups[name] = keyValuePairs;
};

addGroup('Common');

for(let i = 0; i < 10; ++i)
	addGroup(`group${i}`);

export const getLocalizedStrings = async (service, { groupName, language }) => {
	console.log('getLocalizedStrings', { groupName, language });

	await randomLatency();

	const group = mapValues(groups[groupName] || {}, value => value[language]);

	return group;
};

const navigation = {
	'Main': [
		{
			caption: {
				en: 'For students',
				fr: 'For students fr'
			},
			to: '/',
			order: 1,
			type: 'MenuItem',
			items: [
				{
					caption: {
						en: 'Get started',
						fr: 'Get started fr'
					},
					to: '/students',
					type: 'MenuItem'
				},
				{
					type: 'Separator'
				},
				{
					caption: {
						en: 'Careers',
						fr: 'Careers fr'
					},
					to: '/',
					type: 'MenuItem'
				}
			]
		},
		{
			caption: {
				en: 'For employers',
				fr: 'For employers fr'
			},
			to: '/',
			order: 2,
			type: 'MenuItem',
			items: [
				{
					caption: {
						en: 'Sign in',
						fr: 'Sign in fr'
					},
					to: '/',
					order: 1,
					type: 'MenuItem',
					signedIn: false
				},
				{
					caption: {
						en: 'Register',
						fr: 'Register fr'
					},
					to: '/',
					order: 0,
					type: 'MenuItem',
					signedIn: false
				},
				{
					caption: {
						en: 'Dashboard',
						fr: 'Dashboard fr'
					},
					to: '/employer',
					type: 'MenuItem',
					signedIn: true
				},
				{
					type: 'Separator'
				},
				{
					caption: {
						en: 'Apprenticeships',
						fr: 'Apprenticeships fr'
					},
					to: '/',
					type: 'MenuItem'
				}
			]
		},
		{
			caption: {
				en: 'News',
				fr: 'News fr'
			},
			to: 'http://www.google.com',
			order: 3,
			type: 'MenuItem',
			external: true
		},
		{
			caption: {
				en: 'For jobseekers',
				fr: 'For jobseekers fr'
			},
			to: '/',
			order: 0,
			type: 'MenuItem',
			items: [
				{
					caption: {
						en: 'Sign in',
						fr: 'Sign in fr'
					},
					to: '?signin=1',
					order: 1,
					signedIn: false,
					type: 'MenuItem',
				},
				{
					caption: {
						en: 'Register',
						fr: 'Register fr'
					},
					to: '/register',
					order: 0,
					signedIn: false,
					type: 'MenuItem',
				},
				{
					caption: {
						en: 'Profile',
						fr: 'Profile fr'
					},
					to: '/profile',
					type: 'MenuItem',
					signedIn: true
				},
				{
					type: 'Separator'
				},
				{
					caption: {
						en: 'OMVIC',
						fr: 'OMVIC fr'
					},
					to: '/',
					type: 'MenuItem'
				}
			]
		}
	],

	'Footer': [
		{
			caption: {
				en: 'Terms',
				fr: 'Terms fr'
			},
			to: '/',
			type: 'MenuItem'
		},
		{
			caption: {
				en: 'Advertise',
				fr: 'Advertise fr'
			},
			to: '/',
			type: 'MenuItem'
		},
		{
			caption: {
				en: 'Partners',
				fr: 'Partners fr'
			},
			to: '/',
			type: 'MenuItem'
		},
		{
			caption: {
				en: 'About us',
				fr: 'About us fr'
			},
			to: '/',
			type: 'MenuItem'
		},
		{
			caption: {
				en: 'TADA',
				fr: 'TADA fr'
			},
			to: '/',
			type: 'MenuItem'
		},
		{
			caption: {
				en: 'Contact us',
				fr: 'Contact us fr'
			},
			to: '/',
			type: 'MenuItem'
		}
	],

	'Social': [
		{
			caption: {
				en: 'Google+',
				fr: 'Google+'
			},
			to: 'https://plus.google.com/u/0/b/102869905204403439905/102869905204403439905/',
			type: 'MenuItem'
		},
		{
			caption: {
				en: 'Twitter',
				fr: 'Twitter'
			},
			to: 'https://twitter.com/CareerStartON',
			type: 'MenuItem'
		},
		{
			caption: {
				en: 'Youtube',
				fr: 'Youtube'
			},
			to: 'http://www.youtube.com/user/TADANewCars',
			type: 'MenuItem'
		},
		{
			caption: {
				en: 'LinkedIn',
				fr: 'LinkedIn'
			},
			to: 'https://www.linkedin.com/company/trillium-automobile-dealers-association',
			type: 'MenuItem'
		},
		{
			caption: {
				en: 'Facebook',
				fr: 'Facebook'
			},
			to: 'https://www.facebook.com/carsandjobs/?notif_t=page_user_activity%C2%ACif_id=1501213989646223',
			type: 'MenuItem'
		}
	]
};

/* eslint-disable no-unused-vars */
export const getNavigation = async (service, { name, language, region }) => {
	/* eslint-enable no-unused-vars */
	console.log('getNavigation', { name, language, region });

	await randomLatency();

	return navigation[name].slice();
};