export const PAYPAL_CLIENT = {
	sandbox: 'ATbM6SYQngaYDCZ8rHI1dpGSIsULJNLq1qJhCz037ir1NYc3C_ehTqA2Ya5wMf3Ttc-Qw9LKTW-Q5WLr',
	production: 'AQM_EW6_XWUbFZreWk55Zlm-PFVFAO09hpZEpDkNyjcjkE5LI5Rbeh8LiN49jqSBL3WV7meDYtLCB8Gb'
};

export const AUTHORIZE_NET_CLIENT = {
	sandbox: {
		url: 'https://lyfei091hd.execute-api.us-east-2.amazonaws.com/dev/getHostedPaymentPage',
		formUrl: 'https://test.authorize.net/payment/payment'
	},
	production: {
		url: 'https://s2dkcbreqi.execute-api.us-east-2.amazonaws.com/prod/getHostedPaymentPage',
		formUrl: 'https://accept.authorize.net/payment/payment'
	}
};

export const MONERIS_CLIENT = {
	sandbox: {
		url: 'https://esqa.moneris.com/HPPDP/index.php',
		ps_store_id: 'VGCPP03482',
		hpp_key: 'hpP4D76B27JZ'
	},
	production: {
		url: 'https://www3.moneris.com/HPPDP/index.php',
		ps_store_id: 'LT7JZ17264',
		hpp_key: 'hp2ULHCK874L'
	}
};