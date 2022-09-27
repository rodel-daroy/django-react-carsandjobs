/* eslint-disable no-console */
import { randomLatency } from './common';
import { createJobs } from './jobs';
import uuidv4 from 'uuid/v4';
import * as jsPDF from 'jspdf';
import sortBy from 'lodash/sortBy';
import orderBy from 'lodash/orderBy';
import moment from 'moment';
import templates from './templates.json';

const sampleResume = new jsPDF();
sampleResume.text('Lorem ipsum', 10, 10);
const resumeUrl = sampleResume.output('datauristring');

const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vitae cursus mauris, eget tempus nunc. Nullam pharetra libero ut ligula interdum, non aliquam nulla tempus. Suspendisse ut mi eget urna pellentesque tincidunt sit amet id sem. Nam cursus mi lorem, non molestie ligula laoreet in. Vivamus id enim quis velit laoreet pellentesque congue id eros. Praesent vestibulum in odio id mollis. Sed vitae velit nec nulla tempor pulvinar a vel urna. Vivamus accumsan dolor a massa feugiat, ut luctus tortor hendrerit.

Suspendisse potenti. Integer eu velit ex. Praesent sit amet faucibus nulla. Phasellus eu diam ullamcorper, suscipit tellus vel, semper dui. Donec in quam sit amet magna mattis venenatis. Fusce volutpat varius dignissim. Vestibulum vel neque viverra nulla vehicula consectetur quis eget diam.

Suspendisse sed elementum nibh. Fusce finibus vulputate metus et tincidunt. Ut eleifend porttitor felis porttitor varius. In sed condimentum est, sed pulvinar augue. Nullam vulputate lacus urna. Donec bibendum eleifend libero nec consectetur. Maecenas sed augue lectus. Praesent interdum mauris odio. Nulla cursus eu lorem eget venenatis. Praesent faucibus fermentum dui, quis gravida odio vestibulum ac.

Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut id porttitor felis. Integer ultrices leo tincidunt, posuere mi ut, porta elit. Praesent eget quam eleifend, efficitur risus ut, tincidunt tortor. Curabitur non nibh leo. Integer at enim dolor. Integer malesuada eu mi a rhoncus. Maecenas id dui lorem. Integer vitae nunc in diam sodales mattis eget quis mi. Fusce aliquet auctor ligula et lacinia. Donec volutpat ex nec eros fringilla ullamcorper. Morbi at augue id nulla euismod volutpat feugiat placerat lorem. Maecenas accumsan cursus erat ut sollicitudin. Nullam tempus eleifend turpis sit amet imperdiet. Aliquam blandit hendrerit urna vitae congue.

Quisque feugiat mollis arcu, vitae dignissim dui viverra at. Aenean sit amet mi non orci facilisis consequat. Nulla nec viverra justo. Aliquam orci ex, lobortis sit amet sapien ut, aliquet rhoncus nibh. In placerat ante in ex eleifend, mattis venenatis lacus tempus. Vivamus volutpat sem ac ullamcorper pretium. Praesent ac leo nulla. Aliquam imperdiet vitae est et auctor. Nullam non dapibus diam. Nulla imperdiet blandit odio, eget auctor odio consectetur id. Donec tempus sapien in neque maximus varius. Pellentesque tristique lacus eget lorem malesuada, sit amet facilisis justo iaculis.`;

const RESUME = {
	firstName: 'Ben',
	lastName: 'Cotton',
	email: 'ben.cotton@gnr8r.ca',
	city: 'Toronto',
	province: 'ON',
	text: 'Lorem ipsum',
	url: resumeUrl
};

const RESUMES = new Array(100).fill(RESUME);

let postings = createJobs({
	count: 100,
	extraFields: () => ({
		views: Math.floor(Math.random() * 30),
		jobApplications: Math.floor(Math.random() * 30)
	})
});

postings = sortBy(postings, p => -moment(p.closingDate).valueOf());

let applications = [];

for(let i = 0; i < 10; ++i)
	applications.push({
		id: uuidv4(),
		firstName: 'Ben',
		lastName: 'Cotton',
		email: 'ben.cotton@gnr8r.ca',
		coverLetterText: (Math.random() > .7) ? loremIpsum : null,
		resumeUrl,
		videoUrl: (Math.random() > .5) ? 'http://www.youtube.com' : null
	});

/* eslint-disable no-unused-vars */
export const searchResumes = async (service, { startIndex = 0, count, filter } = {}) => {
	/* eslint-enable no-unused-vars */
	console.log('searchResumes');

	await randomLatency();

	const resumes = RESUMES.slice(startIndex, startIndex + count);

	return {
		totalCount: RESUMES.length,
		resumes
	};
};

export const getApplications = async () => {
	console.log('getApplications');

	await randomLatency();

	return applications.slice();
};

export const getJobPostings = async (service, { startIndex, count }) => {
	console.log('getJobPostings');

	await randomLatency();

	return {
		jobs: postings.slice(startIndex, startIndex + count),
		totalCount: postings.length
	};
};

export const getJobPosting = async (service, { id }) => {
	console.log('getJobPosting');

	await randomLatency();

	const posting = postings.find(p => p.id === id);
	if(!posting)
		throw new Error('Posting not found');
	else
		return {
			...posting
		};
};

const UNIT_PRICE = 5;
const TAX_RATE = .12;

const calculateCreditPrice = quantity => {
	const price = quantity * UNIT_PRICE;
	const tax = quantity * UNIT_PRICE * TAX_RATE;
	const total = price + tax;

	return {
		price,
		tax,
		total
	};
};

const createInvoice = ({ quantity, unitPrice, tax, subtotal }) => {
	return {
		id: uuidv4(),
		date: moment().toISOString(),
		name: 'Name',
		address: '123 Test St',
		lines: [
			{
				quantity,
				unitPrice,
				description: 'Credit purchase',
				tax,
				subtotal
			}
		],
		subtotal,
		tax,
		total: (parseFloat(subtotal) + parseFloat(tax)).toFixed(2)
	};
};

let credits = [];

for(let i = 0; i < 200; ++i) {
	const quantity = Math.floor(Math.random() * 100) + 1;

	const { tax, price: subtotal } = calculateCreditPrice(quantity);

	credits.push({
		id: uuidv4(),
		date: moment().subtract(Math.random() * 200, 'days'),
		jobId: null,
		description: 'Lorem ipsum',
		quantity,
		invoice: createInvoice({
			quantity,
			unitPrice: UNIT_PRICE.toFixed(2),
			tax: tax.toFixed(2),
			subtotal: subtotal.toFixed(2)
		})
	});
}

let creditPrices = [];

const addCreditPrice = quantity => {
	const { price, tax, total } = calculateCreditPrice(quantity);

	creditPrices.push({
		quantity,
		price: price.toFixed(2),
		tax: tax.toFixed(2),
		total: total.toFixed(2)
	});
};

addCreditPrice(15);
addCreditPrice(30);
addCreditPrice(45);
addCreditPrice(60);

export const getCredits = async (service, { startIndex, count }) => {
	console.log('getCredits');

	await randomLatency();

	let sortedCredits = orderBy(credits, ['date'], ['desc']);

	let result = {
		totalCount: credits.length,
		credits: sortedCredits.slice(startIndex, startIndex + count)
	};

	return result;
};

export const applyCredits = async (service, { /* saleId, */ credits: amount }) => {
	console.log('applyCredits');

	await randomLatency();

	const { tax, price: subtotal } = calculateCreditPrice(amount);

	let credit = {
		id: uuidv4(),
		date: moment(),
		jobId: null,
		description: 'Credit purchase',
		quantity: amount,
		invoice: createInvoice({
			quantity: amount,
			unitPrice: UNIT_PRICE.toFixed(2),
			tax: tax.toFixed(2),
			subtotal: subtotal.toFixed(2)
		})
	};

	credits.push(credit);

	return { ...credit };
};

export const getCreditPrices = async () => {
	console.log('getCreditPrices');

	await randomLatency();

	return [...creditPrices];
};

let balances = {};

export const getCreditBalance = async (service, { dealer }) => {
	console.log('getCreditBalance');

	await randomLatency();

	if(balances[dealer] == null)
		balances[dealer] = Math.round(Math.random() * 30);

	return {
		balance: balances[dealer]
	};
};

export const applyPromoCode = async (service, { promoCode }) => {
	console.log('applyPromoCode');

	await randomLatency();

	if(promoCode === 'PROMO')
		return {
			creditsApplied: 1
		};
	
	throw new Error('Invalid promo code');
};

export const getTemplates = async () => {
	console.log('getTemplates');

	await randomLatency();

	return templates;
};

export const getTemplate = async (service, { id }) => {
	console.log('getTemplate', { id });

	await randomLatency();

	return templates.find(t => t.id === id);
};