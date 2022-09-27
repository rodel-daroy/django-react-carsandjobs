import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import common from './common';
import jobs from './jobs';
import metadata from './metadata';
import modals from './modals';
import profile from './profile';
import employer from './employer';
import localization from './localization';
import education from './education';
import layout from './layout';
import contact from './contact';
import content from './content';
import admin from './admin';
import user from './user';
import geolocation from './geolocation';
import autoLife from './autolife';
import tiles from './tiles';
import assets from './assets';

export default combineReducers({
	common,
	form,
	jobs,
	metadata,
	modals,
	profile,
	employer,
	localization,
	education,
	layout,
	contact,
	content,
	admin,
	user,
	geolocation,
	autoLife,
	tiles,
	assets
});