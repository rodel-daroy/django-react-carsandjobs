import React from 'react';
import { Route } from 'react-router';
import { makeLoadable } from 'utils/loadable';

const LoadableContentView = makeLoadable(() => import(/* webpackChunkName: 'content-view' */ './components/ContentView'));

const content = baseUrl => [
	<Route key={0} path={`${baseUrl || ''}/preview/:contentId`} render={props => <LoadableContentView {...props} preview />} />,
	<Route key={1} path={`${baseUrl || ''}/:contentId`} component={LoadableContentView} />
];
 
export default content;