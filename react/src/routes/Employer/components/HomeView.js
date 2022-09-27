import React from 'react';
import PropTypes from 'prop-types';
import ASpot from 'components/Content/ASpot';
import homeBackground from './img/home-background.jpg';
import CategoryTiles from 'components/Navigation/CategoryTiles';
import CategoryTile from 'components/Navigation/CategoryTile';
import Localized from 'components/Localization/Localized';
import createPosting from './img/create-posting.svg';
import jobPostings from './img/job-postings.svg';
import resumeSearch from './img/resume-search.svg';
import TileContainer from 'components/Tiles/TileContainer';
import withLocaleRouter from 'components/Localization/withLocaleRouter';

const HomeView = ({ location: { pathname, search } }) => (
	<Localized names="Employer">
		{({ DashboardTitle, CreateJobPostingTitle, JobPostingsTitle, SearchResumesTitle }) => (
			<React.Fragment>
				<ASpot image={{ src: homeBackground, alt: '' }}>
					<h1>Connecting talent to careers</h1>
				</ASpot>

				<CategoryTiles
					caption={(
						<React.Fragment>
							<h2>Looking for the next great candidate?</h2>
							<p>By posting your job offers with Cars and Jobs, you will have access to hundreds of active job seekers in the auto industry.</p>
						</React.Fragment>
					)}>

					<CategoryTile caption={CreateJobPostingTitle} to={{ pathname: '/employer/job-posting', state: { prev: pathname + search }}} image={createPosting} />
					<CategoryTile caption={JobPostingsTitle} to="/employer/job-postings" image={jobPostings} />
					<CategoryTile caption="Credits" to="/employer/credits" image={jobPostings} />
					<CategoryTile caption={SearchResumesTitle} to="/employer/search-resumes" image={resumeSearch} />
				</CategoryTiles>

				<TileContainer />
			</React.Fragment>
		)}
	</Localized>
);

HomeView.propTypes = {
	location: PropTypes.object.isRequired
};
 
export default withLocaleRouter(HomeView);