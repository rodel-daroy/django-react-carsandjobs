import get from 'lodash/get';
import { createStructuredSelector } from 'reselect';

export const JOBSEEKER_ROLE = -1;
export const POSTED_JOBS_ROLE = 0;
export const INVOICES_ROLE = 1;
export const ALL_JOBS_ROLE = 2;
export const ALL_JOBS_INVOICES_ROLE = 3;
export const ADMIN_ROLE = 4;
export const VIEW_RESUMES_JOBS_ROLE = 5;

export const DEALER_ROLES = [
	POSTED_JOBS_ROLE,
	INVOICES_ROLE,
	ALL_JOBS_ROLE,
	ALL_JOBS_INVOICES_ROLE,
	ADMIN_ROLE,
	VIEW_RESUMES_JOBS_ROLE
];

export const REPORTING_ROLES = [
	ALL_JOBS_INVOICES_ROLE,
	ADMIN_ROLE
];

export const JOBSEEKER_ORIGIN = 'jobseeker';
export const DEALER_ORIGIN = 'dealer';
export const TADA_ORIGIN = 'tada';

export const isSignedIn = state => !!get(state, 'user.current.signedIn');
export const isSigningIn = state => get(state, 'user.current.loading');

export const authToken = state => get(state, 'user.current.result.data.token');
export const isAuthTokenRefreshing = state => !!get(state, 'user.current.refreshing');
export const hasAuthTokenRefreshError = state => !!get(state, 'user.current.refreshError');

export const authRole = state => {
	const signedIn = isSignedIn(state);

	if(signedIn) {
		const role = get(state, 'user.current.result.data.role');
		
		return (role == null) ? JOBSEEKER_ROLE : role;
	}
	else
		return null;
};
export const authOrigin = state => get(state, 'user.current.origin');

export const authDealers = state => get(state, 'user.current.result.data.dealers', []);

const authEmail = state => get(state, 'user.current.email');
const authUserId = state => get(state, 'user.current.result.data.userId');

export const authUserMetadata = createStructuredSelector({
	email: authEmail,
	userId: authUserId,
	role: authRole,
	origin: authOrigin
});

export const language = state => get(state, 'localization.current.language');
export const region = state => get(state, 'localization.current.region');

export const locale = createStructuredSelector({
	language,
	region
});

export const localized = groupName => state => get(state, `localization.strings.groups.${groupName}`, {});

export const lookupOptions = lookupName => state => {
	const lang = language(state);
	const lookup = get(state, `jobs.lookups.${lookupName}`, []);

	return lookup.map(l => ({
		label: l.name[lang],
		value: l.id
	}));
};

export const navigation = name => state => get(state, `localization.navigation.all.${name}`, []);