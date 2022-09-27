import React from 'react';
import PropTypes from 'prop-types';
import CategoryTiles from 'components/Navigation/CategoryTiles';
import CategoryTile from 'components/Navigation/CategoryTile';
import createPosting from './img/create-posting.svg';
import jobPostings from './img/job-postings.svg';
import resumeSearch from './img/resume-search.svg';
import credits from './img/credits.svg';
import jobTemplates from './img/job-templates.svg';
import Localized from 'components/Localization/Localized';
import ContentMetaTags from 'components/Content/ContentMetaTags';
import errorBoundary from 'components/Decorators/errorBoundary';
import requireRole from 'components/Decorators/requireRole';
import { DEALER_ROLES } from 'redux/selectors';
import withLocaleRouter from 'components/Localization/withLocaleRouter';

const DashboardView = ({ location: { pathname, search } }) => (
	<Localized names="Employer">
		{({ 
			DashboardTitle, 
			CreateJobPostingTitle, 
			JobPostingsTitle, 
			CreditsTitle, 
			SearchResumesTitle, 
			JobTemplatesTitle 
		}) => (
			<React.Fragment>
				<ContentMetaTags title={DashboardTitle} />

				<CategoryTiles>
					<CategoryTile caption={JobTemplatesTitle} to="/employer/templates" image={jobTemplates} />
					<CategoryTile caption={CreateJobPostingTitle} to={{ pathname: '/employer/job-posting', state: { prev: pathname + search }}} image={createPosting} />
					<CategoryTile caption={JobPostingsTitle} to="/employer/job-postings" image={jobPostings} />
					<CategoryTile caption={CreditsTitle} to="/employer/credits" image={credits} />
					<CategoryTile caption={SearchResumesTitle} to="/employer/search-resumes" image={resumeSearch} />
				</CategoryTiles>
			</React.Fragment>
		)}
	</Localized>
);

DashboardView.propTypes = {
	location: PropTypes.object.isRequired
};
 
export default errorBoundary(withLocaleRouter(requireRole(DEALER_ROLES)(DashboardView)));