import { ERROR } from 'redux/actions/common';
import { all, takeEvery, select } from 'redux-saga/effects';
import { authUserMetadata, locale } from 'redux/selectors';
import Config from 'config';
import { getDomain } from 'utils/url';

const sendLogEntry = (body, domain = getDomain()) => {
	const request = new Request(`${Config.LOG_URL}?domain=${domain}`, {
		method: 'POST',
		body,
		mode: 'no-cors'
	});

	fetch(request);
};

const getLogEntry = (error, metadata) => JSON.stringify({
	...metadata,

	error: { 
		...error,

		name: error.name,
		message: error.message,
		stack: error.stack
	},
	location: {
		domain: getDomain(),
		pathname: window.location.pathname,
		search: window.location.search
	},
	browser: {
		userAgent: navigator.userAgent
	}
});

const logErrors = takeEvery(ERROR, function* ({ error }) {
	// eslint-disable-next-line no-console
	console.error(error.toString());

	const logEntry = getLogEntry(error, {
		user: yield select(authUserMetadata),
		locale: yield select(locale)
	});

	sendLogEntry(logEntry);
});

export default function* () {
	yield all([
		logErrors
	]);
}