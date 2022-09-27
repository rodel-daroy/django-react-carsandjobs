import React from 'react';
import Default from './Default';
import Students from './Students';
import Regional from './Regional';
import AboutPAE from './AboutPAE';

/* eslint-disable react/display-name, react/prop-types, no-unused-vars */
export default {
	Default,
	'Default - no date': ({ date, ...otherProps }) => <Default {...otherProps} />,
	'Default - anchor nav': props => <Default {...props} anchorNav />,
	'Default - anchor nav, no date': ({ date, ...otherProps }) => <Default {...otherProps} anchorNav />,
	Students,
	Regional,
	'About PAE': AboutPAE
};
/* eslint-enable react/display-name, react/prop-types, no-unused-vars */