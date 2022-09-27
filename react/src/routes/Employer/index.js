import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router';
import WithLocalization from 'components/Localization/WithLocalization';
import JobPostingWizardView from './components/JobPosting/JobPostingWizardView';
import JobPostingsView from './components/JobPosting/JobPostingsView';
import DashboardView from './components/DashboardView';
import ResumeSearchView from './components/ResumeSearch/ResumeSearchView';
import JobPostingUpdateView from './components/JobPosting/JobPostingUpdateView';
import ApplicationView from './components/Application/ApplicationView';
import BuyCreditsView from './components/Credit/BuyCreditsView';
import CreditsView from './components/Credit/CreditsView';
import HomeView from './components/HomeView';
import InvoiceView from './components/Credit/InvoiceView';
import ApplicationDetailFullView from './components/Application/ApplicationDetailFullView';
import TemplatesView from './components/Templates/TemplatesView';

const Profile = ({ match: { url }}) => (
	<WithLocalization names={['Jobs', 'Employer']}>
		{() => (
			<Switch>
				<Route exact path={url} component={HomeView} />

				<Route path={`${url}/dashboard`} component={DashboardView} />

				<Route exact path={`${url}/job-posting`} component={JobPostingWizardView} />
				<Route exact path={`${url}/job-posting/:id`} component={JobPostingUpdateView} />
				<Route path={`${url}/job-posting/:id/applications`} component={ApplicationView} />

				<Route exact path={`${url}/job-postings`} component={JobPostingsView} />

				<Route path={`${url}/search-resumes`} component={ResumeSearchView} />

				<Route path={`${url}/credits/buy`} component={BuyCreditsView} />
				<Route path={`${url}/credits/invoice/:id`} component={InvoiceView} />
				<Route exact path={`${url}/credits`} component={CreditsView} />

				<Route path={`${url}/application/:id`} component={ApplicationDetailFullView} />

				<Route exact path={`${url}/templates`} component={TemplatesView} />
			</Switch>
		)}
	</WithLocalization>
);

Profile.propTypes = {
	match: PropTypes.object.isRequired
};

export default Profile;