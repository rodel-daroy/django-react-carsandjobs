import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router';
import CoverLettersView from './components/CoverLetter/CoverLettersView';
import CoverLetterEditView from './components/CoverLetter/CoverLetterEditView';
import ResumesView from './components/Resume/ResumesView';
import ResumeEditView from './components/Resume/ResumeEditView';
import DashboardView from './components/DashboardView';
import ProfileUpdateView from './components/ProfileUpdateView';
import SavedSearchesView from './components/SavedSearch/SavedSearchesView';
import WithLocalization from 'components/Localization/WithLocalization';
import requireRole from 'components/Decorators/requireRole';
import { JOBSEEKER_ROLE } from 'redux/selectors';

const Profile = ({ match: { url }}) => (
	<WithLocalization names="Profile">
		{() => (
			<React.Fragment>
				<Switch>
					<Route exact path={url} component={DashboardView} />

					<Route path={`${url}/details`} component={ProfileUpdateView} />

					<Route exact path={`${url}/cover-letters`} component={CoverLettersView} />
					<Route path={`${url}/cover-letter/:id?`} component={CoverLetterEditView} />

					<Route exact path={`${url}/resumes`} component={ResumesView} />
					<Route path={`${url}/resume/:id?`} component={ResumeEditView} />

					<Route path={`${url}/searches`} component={SavedSearchesView} />
				</Switch>
			</React.Fragment>
		)}
	</WithLocalization>
);

Profile.propTypes = {
	match: PropTypes.object.isRequired
};

export default requireRole(JOBSEEKER_ROLE)(Profile);