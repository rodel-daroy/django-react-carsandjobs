/* eslint-disable no-console */
'use strict';

const AWS = require('aws-sdk');
const S3 = new AWS.S3({
	signatureVersion: 'v4',
});
const Sharp = require('sharp');

const BUCKET = process.env.BUCKET;
const URL = process.env.URL;
const ALLOWED_RESOLUTIONS = process.env.ALLOWED_RESOLUTIONS ? new Set(process.env.ALLOWED_RESOLUTIONS.split(/\s*,\s*/)) : new Set([]);

exports.handler = function(event, context, callback) {
	const key = event.queryStringParameters.key;
	const match = key.match(/((\d*)x(\d*))\/(.*)/);
	//const dimensions = match[1];

	let width = parseInt(match[2], 10);
	if(!width || isNaN(width)) 
		width = null;

	let height = parseInt(match[3], 10);
	if(!height || isNaN(height)) 
		height = null;

	const originalKey = match[4];

	//Check if requested resolution is allowed
	if(0 != ALLOWED_RESOLUTIONS.size && !ALLOWED_RESOLUTIONS.has(match[1]) ) {
		callback(null, {
			statusCode: '403',
			headers: {},
			body: '',
		});
		return;
	}

	console.log({ width, height, originalKey });

	S3.getObject({Bucket: BUCKET, Key: originalKey}).promise()
		.then(data => {
			const image = Sharp(data.Body);

			return image.metadata()
				.then(metadata => {
					console.log({ format: metadata.format });

					return image.resize(width, height)
						.jpeg({
							force: true
						})
						.toBuffer()
						.then(buffer => ({ 
							buffer: buffer, 
							contentType: 'image/jpeg'
						}));
				});
		})
		.then(data => S3.putObject({
			Body: data.buffer,
			Bucket: BUCKET,
			ContentType: data.contentType,
			Key: key,
		}).promise()
		)
		.then(() => callback(null, {
			statusCode: '301',
			headers: {'location': `${URL}/${key}`},
			body: '',
		})
		)
		.catch(err => callback(err));
};
