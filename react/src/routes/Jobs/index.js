import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect, Switch } from 'react-router';
import JobsView from './components/JobsView/JobsView';
import JobDetailFullView from './components/JobDetailFullView';
import UserSavedJobsView from './components/UserSavedJobsView';
import JobApplicationView from './components/Apply/JobApplicationView';
import JobApplicationHistoryView from './components/Apply/JobApplicationHistoryView';
import WithLocalization from 'components/Localization/WithLocalization';
import reloadOnSignIn from 'components/Decorators/reloadOnSignIn';
import ContentMetaTags from 'components/Content/ContentMetaTags';
import Localized from 'components/Localization/Localized';

const Jobs = ({ match: { url } }) => (
	<WithLocalization names="Jobs">
		{() => (
			<React.Fragment>
				<Localized names="Jobs">
					{({ JobsTitle }) => (
						<ContentMetaTags title={JobsTitle} />
					)}
				</Localized>

				<Switch>
					<Route 
						path={`${url}/:layout(search|browse)`} 
						render={({ match }) => <JobsView layout={match.params.layout} />} />

					<Route 
						path={`${url}/detail`} 
						component={JobDetailFullView} />

					<Route
						path={`${url}/preview`}
						render={({ ...otherProps }) => <JobDetailFullView {...otherProps} preview />} />

					<Route
						path={`${url}/saved`}
						component={UserSavedJobsView} />

					<Route
						path={`${url}/apply/:jobId`}
						component={JobApplicationView} />

					<Route
						path={`${url}/applications`}
						component={JobApplicationHistoryView} />

					<Redirect exact from={`${url}`} to={`${url}/browse`} />
				</Switch>
			</React.Fragment>
		)}
	</WithLocalization>
);

Jobs.propTypes = {
	match: PropTypes.object
};

export default reloadOnSignIn(Jobs);