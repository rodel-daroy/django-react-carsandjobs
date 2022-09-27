const development = {
	API: 'http://localhost:8000/',	// https://api.test.carsandjobs.com/
	MEDIA_URL: 'https://d22oes0c9mfxez.cloudfront.net',
	PAYPAL_ENV: 'sandbox',
	AUTHORIZE_NET_ENV: 'sandbox',
	MONERIS_ENV: 'sandbox',
	LOG_URL: 'https://u1mol25yqa.execute-api.us-east-2.amazonaws.com/dev/log'
};
const test = {
	API: 'https://api.test.carsandjobs.com/',
	MEDIA_URL: 'https://d22oes0c9mfxez.cloudfront.net',
	PAYPAL_ENV: 'sandbox',
	AUTHORIZE_NET_ENV: 'sandbox', 
	MONERIS_ENV: 'sandbox',
	LOG_URL: 'https://u1mol25yqa.execute-api.us-east-2.amazonaws.com/dev/log'
};
const production = {
	API: 'https://api.carsandjobs.com/',
	MEDIA_URL: 'https://d15kn8h4izyiz.cloudfront.net',
	PAYPAL_ENV: 'production',
	AUTHORIZE_NET_ENV: 'production',
	MONERIS_ENV: 'production',
	LOG_URL: 'https://u1mol25yqa.execute-api.us-east-2.amazonaws.com/dev/log'
};
const staging = {
	API: 'https://api.test.carsandjobs.com/',
	MEDIA_URL: 'https://d22oes0c9mfxez.cloudfront.net',
	PAYPAL_ENV: 'sandbox',
	AUTHORIZE_NET_ENV: 'sandbox',
	MONERIS_ENV: 'sandbox',
	LOG_URL: 'https://u1mol25yqa.execute-api.us-east-2.amazonaws.com/dev/log'
};

const Config = (env = process.env.REACT_APP_ENV) => {
	if (env === 'production') {
		return production;
	} else if (env === 'staging') {
		return staging;
	} else if(env === 'test') {
		return test;
	}
	return development;
};
export default Config();
