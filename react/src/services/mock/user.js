import { randomLatency } from './common';

/* eslint-disable no-console */

export const signInJobseeker = async (service, credentials) => {
	console.log('signInJobseeker', credentials);

	await randomLatency();

	return {
		jobseeker: true
	};
};

export const signInDealer = async (service, credentials) => {
	console.log('signInDealer', credentials);

	await randomLatency();

	return {
		dealer: true
	};
};

export const signInTada = async (service, credentials) => {
	console.log('signInTada', credentials);

	await randomLatency();

	return {
		tada: true
	};
};