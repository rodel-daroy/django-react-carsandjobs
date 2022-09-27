import React from 'react';
import PropTypes from 'prop-types';
import Breadcrumbs from 'components/Navigation/Breadcrumbs';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import { FILTER_MASK, getFilterBreadcrumbs, parseFilter } from 'routes/Jobs/filter';
import { connect } from 'react-redux';
import { mergeUrlSearch } from 'utils/url';
import Localized from 'components/Localization/Localized';
import './JobFilterBreadcrumbs.css';

const JobFilterBreadcrumbs = ({ 
	basePath, 
	urlSearch, 
	isSearch, 
	location: { pathname, search }, 
	lookups, 
	jobs, 
	language
}) => (
	<Localized names={['Common', 'Jobs']}>
		{({ SearchResultsLabel, AllJobsLabel, WithinLastDaysLabel }) => {
			if(jobs) {
				let paths = [];
				
				if(!isSearch)
					paths = getFilterBreadcrumbs(basePath || pathname, search, lookups, urlSearch, language, WithinLastDaysLabel);
				else {
					const filter = parseFilter(search);
					const hasFilter = Object.values(filter).filter(v => v != null).length > 0;
		
					if(hasFilter)
						paths = [{
							name: SearchResultsLabel,
							path: pathname + search
						}];
				}
		
				const rootPath = (basePath || pathname) + mergeUrlSearch(search, FILTER_MASK);
		
				const jobCount = (jobs || {}).totalCount || 0;
				const jobCountString = ` (${jobCount})`;
		
				return (
					<Breadcrumbs showHome={false} className="job-filter-breadcrumbs">
						<Breadcrumbs.Crumb to={rootPath}>
							{AllJobsLabel} {paths.length === 0 ? jobCountString : ''}
						</Breadcrumbs.Crumb>
		
						{paths.map((path, i) => (
							<Breadcrumbs.Crumb key={i} to={path.path}>
								{path.name} {i === paths.length - 1 ? jobCountString : ''}
							</Breadcrumbs.Crumb>
						))}
					</Breadcrumbs>
				);
			}
			else
				return null;
		}}
	</Localized>
);

JobFilterBreadcrumbs.propTypes = {
	basePath: PropTypes.string,
	urlSearch: PropTypes.any,
	isSearch: PropTypes.bool,

	location: PropTypes.object,
	lookups: PropTypes.object,
	jobs: PropTypes.object,
	language: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
	lookups: state.jobs.lookups,
	jobs: state.jobs.jobs.result,
	language: state.localization.current.language
});

export default withLocaleRouter(connect(mapStateToProps)(JobFilterBreadcrumbs));
