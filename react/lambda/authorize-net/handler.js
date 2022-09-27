'use strict';

const fetch = require('node-fetch');

const API_LOGIN_ID = process.env.API_LOGIN_ID;
const TRANSACTION_KEY = process.env.TRANSACTION_KEY;
const API_ENDPOINT = process.env.API_ENDPOINT;

const fetchHostedPaymentPage = async body => {
	let json = (typeof body === 'object') ? body : JSON.parse(body);
	json = {
		...json,

		getHostedPaymentPageRequest: {
			merchantAuthentication: {
				name: API_LOGIN_ID,
				transactionKey: TRANSACTION_KEY
			},

			...json.getHostedPaymentPageRequest,
		}
	};

	const response = await fetch(API_ENDPOINT, {
		method: 'POST',
		body: JSON.stringify(json)
	});

	return response.text();
};

module.exports.getHostedPaymentPage = async event => {
	const body = await fetchHostedPaymentPage(event.body);

	return {
		statusCode: 200,
		body,
		headers: {
			'Access-Control-Allow-Origin': '*'
		}
	};
};
