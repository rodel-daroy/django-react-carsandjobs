import React from 'react';
import { Route, Switch } from 'react-router';
import { makeLoadable } from 'utils/loadable';
import ContactUsView from 'layout/components/ContactUsView';
import NotFoundView from 'layout/components/NotFoundView';
import VerifyEmail from 'layout/components/User/VerifyEmail';
import content from 'routes/Content';
import LocaleRoutes from 'components/Localization/LocaleRoutes';

const LoadableHome = makeLoadable(() => import(/* webpackChunkName: 'home' */ 'routes/Home'));
const LoadableJobs = makeLoadable(() => import(/* webpackChunkName: 'jobs' */ 'routes/Jobs'));
const LoadableNews = makeLoadable(() => import(/* webpackChunkName: 'news' */ 'routes/News'));
const LoadableStudents = makeLoadable(() => import(/* webpackChunkName: 'students' */ 'routes/Students'));
const LoadableProfile = makeLoadable(() => import(/* webpackChunkName: 'profile' */ 'routes/Profile'));
const LoadableRegister = makeLoadable(() => import(/* webpackChunkName: 'register' */ 'routes/Profile/Register'));
const LoadableEmployer = makeLoadable(() => import(/* webpackChunkName: 'employer' */ 'routes/Employer'));
const LoadableAdmin = makeLoadable(() => import(/* webpackChunkName: 'admin' */ 'routes/Admin'));

const Routes = () => (
	<LocaleRoutes>
		{(baseUrl = '') => {
			const contentRoute = content(`${baseUrl}/content`);
			const rootContentRoute = content(baseUrl);

			return (
				<Switch>
					<Route exact path={`${baseUrl}/`} component={LoadableHome} />
					<Route exact path={`${baseUrl}/search`} component={LoadableHome} />

					<Route path={`${baseUrl}/jobs`} component={LoadableJobs} />
					<Route path={`${baseUrl}/news`} component={LoadableNews} />
					<Route path={`${baseUrl}/students`} component={LoadableStudents} />
					<Route path={`${baseUrl}/profile`} component={LoadableProfile} />
					<Route path={`${baseUrl}/register`} component={LoadableRegister} />
					<Route path={`${baseUrl}/employer`} component={LoadableEmployer} />
					<Route path={`${baseUrl}/admin`} component={LoadableAdmin} />

					<Route path={`${baseUrl}/contact-us`} component={ContactUsView} />

					<Route exact path={`${baseUrl}/verify`} render={props => (
						<React.Fragment>
							<LoadableHome {...props} />
							<VerifyEmail {...props} />
						</React.Fragment>
					)} />

					{contentRoute}
					{rootContentRoute}

					<Route component={NotFoundView} />
				</Switch>
			);
		}}
	</LocaleRoutes>
);

export default Routes;