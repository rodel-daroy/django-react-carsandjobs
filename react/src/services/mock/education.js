/* eslint-disable no-console */
import { randomLatency } from './common';
import sample from 'lodash/sample';
import sortBy from 'lodash/sortBy';
import uuidv4 from 'uuid/v4';

const titles = [
	'Dealer Principal',
	'General Manager',
	'Controller',
	'Accounting',
	'Service Manager',
	'Parts Manager',
	'Delivery Specialist',
	'Detailer',
	'Appointment Coordinator',
	'Lube & Oil Technician'
];

const schools = [
	'Centennial College',
	'Durham College',
	'Loyalist College',
	'Algonquin College',
	'Conestoga College'
];

let programmes = [];

for(let i = 0; i < 50; ++i) {
	programmes.push({
		id: uuidv4(),
		title: sample(titles.slice(0, 5)),
		schoolName: sample(schools),
		city: 'Toronto',
		province: 'ON',
		url: 'http://www.google.com',
		scholarship: Math.random() > .5,
		apprenticeship: Math.random() > .5,
		coop: Math.random() > .5
	});
}

programmes = sortBy(programmes, ['title']);

let placeholders = [];

for(const title of titles.slice(5))
	placeholders.push({
		title,
		description: 'Any education level'
	});

/* eslint-disable no-unused-vars */
export const getProgrammes = async (service, { filter, startIndex, count }) => {
	/* eslint-enable no-unused-vars */
	console.log('getProgrammes');

	await randomLatency();

	const results = programmes.slice(startIndex, startIndex + count);

	return {
		totalCount: programmes.length,
		programmes: results
	};
};

export const getPlaceholders = async () => {
	console.log('getPlaceholders');

	await randomLatency();

	return placeholders.slice();
};