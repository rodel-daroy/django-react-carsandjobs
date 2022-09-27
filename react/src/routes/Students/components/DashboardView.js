import React from 'react';
import CategoryTiles from 'components/Navigation/CategoryTiles';
import CategoryTile from 'components/Navigation/CategoryTile';
import findProgrammes from './img/find-programmes.svg';
import Localized from 'components/Localization/Localized';
import ContentMetaTags from 'components/Content/ContentMetaTags';
import errorBoundary from 'components/Decorators/errorBoundary';
import ASpot from 'components/Content/ASpot';
import findYourFirstJob from './img/find-your-first-job.svg';
import browseJobs from 'routes/Home/components/img/browse-jobs.svg';
import TileContainer from 'components/Tiles/TileContainer';
import { parseMarkdown } from 'utils/format';
import WithAsset from 'components/Content/WithAsset';
import './DashboardView.css';

const DashboardView = () => (
	<Localized names={['Common', 'Students']}>
		{({ DashboardTitle, DashboardText, EducationProgrammesTitle, FindYourFirstJobLabel, BrowseJobsTitle }) => (
			<div className="students-dashboard-view">
				<ContentMetaTags title={DashboardTitle} />

				<WithAsset name="Students A-Spot">
					{({ asImage }) => (
						<ASpot image={asImage}>
							<h1>{DashboardTitle}</h1>
						</ASpot>
					)}
				</WithAsset>
				
				<CategoryTiles
					size="medium"
					caption={(
						<React.Fragment>
							<div dangerouslySetInnerHTML={{ __html: parseMarkdown(DashboardText) }}>
							</div>
						</React.Fragment>
					)}>
					
					<CategoryTile caption={FindYourFirstJobLabel} to="/search" image={findYourFirstJob} />
					<CategoryTile caption={EducationProgrammesTitle} to="/students/programs" image={findProgrammes} />
					<CategoryTile caption={BrowseJobsTitle} to="/jobs/browse" image={browseJobs} />
				</CategoryTiles>

				<TileContainer name="Students Default" />
			</div>
		)}
	</Localized>
);
 
export default errorBoundary(DashboardView);