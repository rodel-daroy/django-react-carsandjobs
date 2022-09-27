import get from 'lodash/get';
import Config from 'config';
import { AUTHORIZE_NET_CLIENT } from 'config/constants';
import { COLORS } from 'utils/style';

export const CLIENT = AUTHORIZE_NET_CLIENT[Config.AUTHORIZE_NET_ENV];

export const fetchHostedPaymentPage = async (description, { total, tax }, companyName) => {
	const setting = (name, value) => ({
		settingName: name,
		settingValue: (typeof value === 'object') ? JSON.stringify(value) : value
	});

	const request = new Request(CLIENT.url, {
		method: 'POST',
		body: JSON.stringify({
			getHostedPaymentPageRequest: {
				transactionRequest: {
					transactionType: 'authCaptureTransaction',
					amount: total,
					order: {
						description
					},
					tax: {
						amount: tax,
						name: 'Tax',
						description: 'Tax'
					},
					billTo: {
						company: companyName
					}
				},
				hostedPaymentSettings: {
					setting: [
						setting('hostedPaymentReturnOptions', {
							showReceipt: false
						}),
						setting('hostedPaymentButtonOptions', {
							text: 'Pay'
						}),
						setting('hostedPaymentStyleOptions', {
							bgColor: COLORS.BRAND_RED
						}),
						setting('hostedPaymentPaymentOptions', {
							showCreditCard: true,
							showBankAccount: false
						}),
						setting('hostedPaymentVisaCheckoutOptions', {}),
						setting('hostedPaymentSecurityOptions', {
							captcha: false
						}),
						setting('hostedPaymentShippingAddressOptions', {
							show: false,
							required: false
						}),
						setting('hostedPaymentBillingAddressOptions', {
							show: true,
							required: true
						}),
						setting('hostedPaymentCustomerOptions', {
							showEmail: false,
							requiredEmail: false
						}),
						setting('hostedPaymentOrderOptions', {
							show: false
						}),
						setting('hostedPaymentIFrameCommunicatorUrl', {
							url: window.location.origin + '/iframe-communicator.html'
						})
					]
				}
			}
		})
	});

	const response = await fetch(request);

	if(response.ok) {
		const result = await response.json();
		const code = get(result, 'messages.resultCode');

		if(code === 'Ok')
			return get(result, 'token');
	}

	throw new Error('Failed');
};