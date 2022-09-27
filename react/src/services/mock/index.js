import * as jobs from './jobs';
import * as profile from './profile';
import * as employer from './employer';
import * as localization from './localization';
import * as education from './education';
import * as user from './user';

export default {
	...jobs,
	...profile,
	...employer,
	...localization,
	...education,
	...user
};