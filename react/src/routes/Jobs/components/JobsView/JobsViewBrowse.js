import React from 'react';
import PropTypes from 'prop-types';
import JobFilterBrowse from '../Filter/JobFilterBrowse';
import { JobFilter } from 'types/jobs';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import { getFilterBreadcrumbs, FILTER_MASK, updateFilter } from 'routes/Jobs/filter';
import { mergeUrlSearch } from 'utils/url';
import { connect } from 'react-redux';
import CommandBar from 'components/Layout/CommandBar';
import Localized from 'components/Localization/Localized';
import './JobsViewBrowse.css';

const JobsViewBrowse = ({ filter, location, history, lookups, detailVisible, language }) => (
	<Localized names={['Common', 'Jobs']}>
		{({ GoBackLabel, ViewResultsLabel, WithinLastDaysLabel }) => {
			const { pathname, search } = location;

			const breadcrumbs = getFilterBreadcrumbs(pathname, search, lookups, language, WithinLastDaysLabel);

			const handleUpdate = filter => {
				updateFilter(filter, { location, history }, { detail: 1 });
			};

			const handleViewResults = () => {
				const newSearch = mergeUrlSearch(search, { detail: 1 });

				history.push(pathname + newSearch);
			};

			const handleBack = () => {
				if(breadcrumbs.length > 1)
					history.push(breadcrumbs[breadcrumbs.length - 2].path);
				else {
					const newSearch = mergeUrlSearch(search, FILTER_MASK);

					history.push(pathname + newSearch);
				}
			};

			return (
				<div className="jobs-view-browse">
					<JobFilterBrowse 
						className="jobs-view-browse-refine"
						filter={filter} 
						onUpdate={handleUpdate} />

					<CommandBar className="jobs-view-browse-commands" layout="alwaysMobile">
						{breadcrumbs.length > 0 && (
							<PrimaryLink as="button" onClick={handleBack} size="large" iconClassName="icon icon-angle-left" hasIcon>
								{GoBackLabel}
							</PrimaryLink>
						)}

						{!detailVisible && (
							<PrimaryButton onClick={handleViewResults}>
								{ViewResultsLabel}
							</PrimaryButton>
						)}
					</CommandBar>
				</div>
			);
		}}
	</Localized>
);

JobsViewBrowse.propTypes = {
	filter: JobFilter,
	detailVisible: PropTypes.bool,

	location: PropTypes.object,
	history: PropTypes.object,
	lookups: PropTypes.object,
	language: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
	lookups: state.jobs.lookups,
	language: state.localization.current.language
});
 
export default withLocaleRouter(connect(mapStateToProps)(JobsViewBrowse));