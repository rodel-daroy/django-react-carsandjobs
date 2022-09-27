const modernizr = require('modernizr');
const config = require('./modernizr.json');
const fs = require('fs');
const mkdirp = require('mkdirp');

/* eslint-disable no-console */
modernizr.build(config, result => {
	result = '/* eslint-disable */' + result + '; export default window.Modernizr;';

	mkdirp('./src/generated', err => {
		if(!err) {
			fs.writeFile('./src/generated/modernizr.js', result, err => {
				if(err)
					console.log(err);
				else
					console.log('Modernizr module created');
			});
		}
		else {
			console.log(err);
		}
	});
});