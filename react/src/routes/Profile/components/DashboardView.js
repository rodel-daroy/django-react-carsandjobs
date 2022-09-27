import React from 'react';
import CategoryTiles from 'components/Navigation/CategoryTiles';
import CategoryTile from 'components/Navigation/CategoryTile';
import profileDetails from './img/profile-details.svg';
import coverLetters from './img/cover-letters.svg';
import resumes from './img/resumes.svg';
import savedSearches from './img/saved-searches.svg';
import applicationHistory from './img/application-history.svg';
import savedJobs from './img/saved-jobs.svg';
import Localized from 'components/Localization/Localized';
import ContentMetaTags from 'components/Content/ContentMetaTags';
import errorBoundary from 'components/Decorators/errorBoundary';

const DashboardView = () => (
	<Localized names="Profile">
		{({
			DashboardTitle,
			ProfileDetailsTitle, 
			CoverLettersTitle, 
			ResumesTitle, 
			SavedSearchesTitle, 
			ApplicationHistoryTitle, 
			SavedJobsTitle
		}) => (
			<React.Fragment>
				<ContentMetaTags title={DashboardTitle} />

				<CategoryTiles>
					<CategoryTile caption={ProfileDetailsTitle} to="/profile/details" image={profileDetails} />
					<CategoryTile caption={CoverLettersTitle} to="/profile/cover-letters" image={coverLetters} />
					<CategoryTile caption={ResumesTitle} to="/profile/resumes" image={resumes} />
					<CategoryTile caption={SavedSearchesTitle} to="/profile/searches" image={savedSearches} />
					<CategoryTile caption={ApplicationHistoryTitle} to="/jobs/applications?prev=/profile" image={applicationHistory} />
					<CategoryTile caption={SavedJobsTitle} to="/jobs/saved?prev=/profile" image={savedJobs} />
				</CategoryTiles>
			</React.Fragment>
		)}
	</Localized>
);
 
export default errorBoundary(DashboardView);