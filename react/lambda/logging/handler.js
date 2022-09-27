'use strict';
/* eslint-disable no-console */

const util = require('util');
const AWS = require('aws-sdk');
const CWLogs = new AWS.CloudWatchLogs({ apiVersion: '2014-03-28' });

const LOG_GROUP_NAME = process.env.AWS_LAMBDA_LOG_GROUP_NAME;
const MAX_RETRIES = process.env.MAX_RETRIES || 10;

const describeLogStreams = util.promisify(CWLogs.describeLogStreams.bind(CWLogs));
const createLogStream = util.promisify(CWLogs.createLogStream.bind(CWLogs));
const putLogEvents = util.promisify(CWLogs.putLogEvents.bind(CWLogs));

const resolveStream = async name => {
	const streams = await describeLogStreams({
		logGroupName: LOG_GROUP_NAME,
		logStreamNamePrefix: name
	});

	const sequenceToken = (streams.logStreams.length > 0) ? streams.logStreams[0].uploadSequenceToken : undefined;

	if(!sequenceToken)
		await createLogStream({ 
			logGroupName: LOG_GROUP_NAME,
			logStreamName: name
		});

	return sequenceToken;
};

const tryWriteLog = async (streamName, message) => {
	const sequenceToken = await resolveStream(streamName);

	const params = {
		logEvents: [{
			message,
			timestamp: new Date().valueOf()
		}],

		logGroupName: LOG_GROUP_NAME,
		logStreamName: streamName,
		sequenceToken
	};

	return putLogEvents(params);
};

const writeLog = async (streamName, message) => {
	for(let i = 0; i <= MAX_RETRIES; ++i) {
		try {
			return await tryWriteLog(streamName, message);
		}
		// eslint-disable-next-line no-empty
		catch(e) {	}
	}
};

module.exports.log = async event => {
	const message = event.body;
	const domain = event.queryStringParameters.domain;

	await writeLog(domain, message);

	return {
		statusCode: 200
	};
};
