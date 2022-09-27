function ApiError(message, request, { status, signedIn, payload, response } = {}) {
	let instance = new Error(message);
	
	if(typeof request === 'string') {
		instance.url = request;
		instance.method = 'GET';
	}
	else {
		instance.url = request.url;
		instance.method = request.method;
	}

	instance.status = status || 'NETWORK_FAILURE';
	instance.signedIn = signedIn;
	instance.payload = payload;
	instance.response = response;

	Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
	if(Error.captureStackTrace)
		Error.captureStackTrace(instance, ApiError);

	return instance;
}

ApiError.prototype = Object.create(Error.prototype, {
	constructor: {
		value: Error,
		enumerable: false,
		writable: true,
		configurable: true
	},
	name: {
		value: 'ApiError'
	}
});

if(Object.setPrototypeOf)
	Object.setPrototypeOf(ApiError, Error);
else
	ApiError.__proto__ = Error;

ApiError.prototype.toString = function() {
	let result = `${this.status}: ${this.method} ${this.url}`;
	if(this.payload)
		result += `\nPayload: ${JSON.stringify(this.payload)}`;
	if(this.response)
		result += `\nResponse: ${JSON.stringify(this.response)}`;

	return result;
};

export default ApiError;