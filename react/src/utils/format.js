import moment from 'moment';
import Remarkable from 'remarkable';
import words from 'lodash/words';
import isEqual from 'lodash/isEqual';
import kebabCase from 'lodash/kebabCase';
import memoizeOne from 'memoize-one';
import TurndownService from 'turndown';
import { Parser } from 'json2csv';
import saveAs from 'file-saver';
import { DEFAULT_LANGUAGE } from 'config/constants';

export const getLocale = (language = DEFAULT_LANGUAGE) => `${language}-ca`;

export const humanizePastDate = (date, language = DEFAULT_LANGUAGE) => moment.duration(moment(date).diff(moment())).locale(getLocale(language)).humanize(true);

export const formatDate = (date, language = DEFAULT_LANGUAGE) => moment(date).locale(getLocale(language)).format('LL');

export const formatShortDate = (date, language = DEFAULT_LANGUAGE) => date ? moment(date).locale(getLocale(language)).format('D MMM YYYY') : '';

const getSlug = content => kebabCase(content);

const createParser = (options = {}) => {
	const parser = new Remarkable({
		html: false,
		breaks: false,
		linkify: true
	});

	const safeLinks = md => {
		md.renderer.rules.link_open = function(tokens, idx, /* options */ /* env */) {
			const title = tokens[idx].title ? (' title="' + Remarkable.utils.escapeHtml(Remarkable.utils.replaceEntities(tokens[idx].title)) + '"') : '';
			const target = ' target="_blank" rel="noopener noreferrer"';
			return '<a href="' + Remarkable.utils.escapeHtml(tokens[idx].href) + '"' + title + target + '>';
		};
	};

	const headings = (md, options) => {
		const offset = options.offsetHeadings || 0;

		const getRenderLevel = level => Math.max(1, Math.min(6, level + offset));

		md.renderer.rules.heading_open = function(tokens, idx /*, options, env */) {
			const originalLevel = tokens[idx].hLevel;
			const renderLevel = getRenderLevel(originalLevel);

			const content = tokens[idx + 1].content;
			const slug = getSlug(content);

			if(options.extractHeadings) {
				options.headings = options.headings || [];

				options.headings.push({
					slug,
					text: content,
					level: originalLevel
				});
			}

			return `<h${renderLevel} id="${slug}">`;
		};
		md.renderer.rules.heading_close = function(tokens, idx /*, options, env */) {
			return `</h${getRenderLevel(tokens[idx].hLevel)}>\n`;
		};
	};

	const embedVideo = (md, { videoClassName }) => {
		const originalLinkOpen = md.renderer.rules.link_open;
		const originalLinkClose = md.renderer.rules.link_close;

		const matchVideoLink = href => {
			const match = /^(((http|https):)?\/\/)?(www\.)?(youtu\.be|youtube\.com)(\/watch\?v=|\/)([^&]+)/i.exec(href);

			if(match)
				return match[7];
			
			return null;
		};

		md.renderer.rules.link_open = (tokens, idx, options, env) => {
			const href = tokens[idx].href;

			const videoId = matchVideoLink(href);
			if(videoId) {
				env.video = true;

				const text = tokens[idx + 1];
				if(text.type === 'text' && text.content === href)
					text.content = '';
					
				return `<div class="${videoClassName || ''}"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe></div>`;
			}

			return originalLinkOpen(tokens, idx, options, env);
		};

		md.renderer.rules.link_close = (tokens, idx, options, env) => {
			if(env.video) {
				env.video = false;
				return '';
			}

			return originalLinkClose(tokens, idx, options, env);
		};
	};

	parser.use(safeLinks, options);
	parser.use(headings, options);
	parser.use(embedVideo, options);

	return parser;
};

const memoizeCreateParser = memoizeOne(createParser, isEqual);

export const parseMarkdown = (markdown, options) => {
	const parser = memoizeCreateParser(options);

	return parser.render(markdown);
};

export const splitMarkdown = (content, intervals = []) => {
	const paragraphs = (content || '').split('\n').filter(c => !!c);

	let wordCount = 0;
	let intervalIndex = 0;
	let lastBreak = -1;
	let chunks = [];

	for (let i = 0; i < paragraphs.length; ++i) {
		const paragraph = paragraphs[i];

		wordCount += words(paragraph).length;

		if (wordCount >= intervals[intervalIndex]) {
			let chunk = '';
			for (let j = i; j > lastBreak; --j) {
				chunk = paragraphs[j] + '\n' + chunk;
			}
			chunks[intervalIndex] = chunk;

			lastBreak = i;

			wordCount = 0;
			++intervalIndex;

			if (intervalIndex > intervals.length - 1) { break; }
		}
	}

	if (lastBreak !== paragraphs.length - 1) {
		let chunk = '';
		for (let i = lastBreak + 1; i < paragraphs.length; ++i) {
			chunk += paragraphs[i] + '\n';
		}

		chunks[chunks.length] = chunk;
	}

	return chunks;
};

export const isoDateString = date => moment(date).toISOString(true).split('T')[0];

export const formatLocation = ({ city, province } = {}) => {
	if(city || province)
		return `${city ? (city + ', ') : ''}${province}`;
	else
		return null;
};

export const htmlToMarkdown = html => {
	const BULLETS = '•·◦‣⁌⁍';

	const doc = new DOMParser().parseFromString(html, 'text/html');

	let markdown = new TurndownService().turndown(doc.body);

	markdown = markdown
		// replace \r\n with \n
		.replace(/\r\n/gm, '\n')
		// remove spaces between newline characters
		.replace(/\n *(?=\n)/gm, '\n')
		.replace(/\n{3,}/gm, '\n\n');

	markdown = markdown
		// replace bullet characters with asterisks
		.replace(new RegExp(`^(\\s*)[${BULLETS}]\\s+(.+)$`, 'gm'), '$1 * $2')
		// remove extra line breaks between bullets
		.replace(/^( *\*\s+.+)\n\n(?= *\*\s)/gm, '$1\n')
		// remove extra line breaks between numbered list items
		.replace(/^(\d+\.\s+.+)\n\n(?=\d+\.\s)/gm, '$1\n');

	return markdown;
};

export const objToCsv = obj => {
	if(!obj || Object.keys(obj).length === 0)
		return '';

	const parser = new Parser();
	return parser.parse(obj);
};

export const downloadCsv = (obj, filename) => {
	const csv = objToCsv(obj);
	const blob = new Blob([csv], { type: 'text/csv' });
	
	saveAs(blob, filename, { type: 'text/csv' });
};
