//import mock from './mock';
import * as jobs from './jobs';
import * as profile from './profile';
import * as localization from './localization';
import * as employer from './employer';
import * as contact from './contact';
import * as education from './education';
import * as content from './content';
import * as admin from './admin';
import * as user from './user';
import * as tiles from './tiles';
import * as assets from './assets';
import ApiService from './ApiService';

export default new ApiService({
	//...mock,
	...jobs,
	...profile,
	...localization,
	...employer,
	...contact,
	...education,
	...content,
	...admin,
	...user,
	...tiles,
	...assets
});