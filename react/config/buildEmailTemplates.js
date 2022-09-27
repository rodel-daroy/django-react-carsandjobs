/* eslint-disable no-console */
const jsdom = require('jsdom');
const fs = require('fs');
const mkdirp = require('mkdirp');

const BASE_PATH = './public/email-templates/';
const BUILD_PATH = BASE_PATH + 'build/';

const BASE_URL = process.argv[2] + '/';
const BASE_ASSET_URL = BASE_URL + 'email-templates/';

console.log('build-email-templates:', BASE_URL);

const transformPath = (path, baseUrl) => {
	if(path && path.match(/^\.\//)) {
		path = path.replace('./', baseUrl);

		console.log('replace:', path);
	}

	return path;
};

const transformAttribute = (node, attrName, baseUrl = BASE_ASSET_URL) => {
	let path = node.getAttribute(attrName);
	path = transformPath(path, baseUrl);

	node.setAttribute(attrName, path);
};

const transformHtml = file => {
	console.log();
	console.log('transforming:', file);

	const content = fs.readFileSync(BASE_PATH + file);
	const dom = new jsdom.JSDOM(content);

	dom.window.document.querySelectorAll('link').forEach(link => transformAttribute(link, 'href'));
	dom.window.document.querySelectorAll('img').forEach(img => transformAttribute(img, 'src'));
	dom.window.document.querySelectorAll('a').forEach(a => transformAttribute(a, 'href', BASE_URL));

	return dom.serialize();
};

mkdirp.sync(BUILD_PATH);

fs.readdirSync(BASE_PATH).forEach(file => {
	if(file.match(/.*\.html$/)) {
		const html = transformHtml(file);

		fs.writeFileSync(BUILD_PATH + file, html);
	}
});


