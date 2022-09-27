import React from 'react';
import { MEDIA_BUCKETS, LANGUAGES } from 'config/constants';
import Config from 'config';
import { TweenLite } from 'gsap';

export const capitalise = str => str.replace(/\b\w/g, l => l.toUpperCase());

export const firstChild = props => {
	const childrenArray = React.Children.toArray(props.children);
	return childrenArray[0] || null;
};

export const getScrollParent = node => {
	const isElement = node instanceof HTMLElement;
	const overflowY = isElement && window.getComputedStyle(node).overflowY;
	const isScrollable = overflowY !== 'visible' && overflowY !== 'hidden';

	if (!node) {
		return null;
	}
	else {
		if (isScrollable && node.scrollHeight >= node.clientHeight) {
			return node;
		}
	}

	return getScrollParent(node.parentNode) || document.documentElement;
};

export const scrollTo = node => {
	const scrollParent = getScrollParent(node);

	TweenLite.killTweensOf(scrollParent);
	TweenLite.to(scrollParent, .5, { scrollTop: node.offsetTop });
};

export const scrollToTop = childNode => {
	const scrollParent = getScrollParent(childNode);

	TweenLite.killTweensOf(scrollParent);
	TweenLite.to(scrollParent, .5, { scrollTop: 0 });
};

export const resizeImageUrl = (url, width, height = '') => {
	/* eslint-disable no-unused-vars */
	const [match, protocol, domain, path] = (url || '').match(/(https|http):\/\/([^/]*)\/(.*)/) || [];
	/* eslint-enable no-unused-vars */

	if(MEDIA_BUCKETS.includes(domain))
		return `${Config.MEDIA_URL}/${width}x${height}/${path}`;
	else
		return url;
};

export const combineFuncs = (...funcs) => (...args) => funcs.forEach(f => f && f(...args));

export const flattenObject = (obj, result = {}, path = null) => {
	if(obj == null)
		return obj;

	for(const [key, value] of Object.entries(obj)) {
		let combinedPath;
		if(obj instanceof Array)
			combinedPath = `${path || ''}[${key}]`;
		else
			combinedPath = path ? `${path}.${key}` : key;

		if(typeof value === 'object')
			flattenObject(value, result, combinedPath);
		else
			result[combinedPath] = value;
	}

	return result;
};

export const getLanguageValue = (value, language) => {
	if(!value || typeof value !== 'object')
		return value;
	else {
		let result = value[language];
		if(!result) {
			for(const [, lang] of LANGUAGES)
				result = result || value[lang];
		}

		return result;
	}
};