import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SearchBox from 'layout/components/SearchBox';
import CategoryTiles from 'components/Navigation/CategoryTiles';
import CategoryTile from 'components/Navigation/CategoryTile';
import allJobs from './img/all-jobs.svg';
import salesJobs from './img/sales-jobs.svg';
import officeJobs from './img/office-jobs.svg';
import serviceJobs from './img/service-jobs.svg';
import partsJobs from './img/parts-jobs.svg';
import savedJobs from './img/saved-jobs.svg';
import applicationHistory from './img/application-history.svg';
import Localized from 'components/Localization/Localized';
import WithLocalization from 'components/Localization/WithLocalization';
import { connect } from 'react-redux';
import { authRole, JOBSEEKER_ROLE } from 'redux/selectors';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import './SearchView.css';

class SearchView extends Component {
	componentDidUpdate(prevProps) {
		const { location } = this.props;

		if(location !== prevProps.location && location.pathname === '/search' && !location.search)
			this._searchBox.focus();
	}

	render() {
		const { authRole } = this.props;

		return (
			<WithLocalization names={['Common', 'Jobs']}>
				{() => (
					<Localized names={['Common', 'Jobs']}>
						{({ 
							BrowseJobsTitle,
							AllJobsTitle,
							SalesJobsTitle,
							OfficeJobsTitle,
							ServiceJobsTitle,
							PartsJobsTitle,
							SavedJobsTitle,
							ApplicationHistoryTitle,
							MyJobsTitle
						}) => (
							<div className="search-view">
								<SearchBox ref={ref => this._searchBox = ref} background />
				
								<CategoryTiles caption={BrowseJobsTitle} size="medium">
									<CategoryTile caption={AllJobsTitle} to="/jobs/browse" image={allJobs} />
									<CategoryTile caption={SalesJobsTitle} to="/jobs/browse?category=sales&amp;detail=1" image={salesJobs} />
									<CategoryTile caption={OfficeJobsTitle} to="/jobs/browse?category=office&amp;detail=1" image={officeJobs} />
									<CategoryTile caption={ServiceJobsTitle} to="/jobs/browse?category=service&amp;detail=1" image={serviceJobs} />
									<CategoryTile caption={PartsJobsTitle} to="/jobs/browse?category=parts&amp;detail=1" image={partsJobs} />
								</CategoryTiles>

								{authRole === JOBSEEKER_ROLE && (
									<CategoryTiles className="search-view-my-jobs" caption={MyJobsTitle} size="medium">
										<CategoryTile caption={SavedJobsTitle} to="/jobs/saved" image={savedJobs} />
										<CategoryTile caption={ApplicationHistoryTitle} to="/jobs/applications" image={applicationHistory} />
									</CategoryTiles>
								)}
							</div>
						)}
					</Localized>
				)}
			</WithLocalization>
		);
	}
}

SearchView.propTypes = {
	authRole: PropTypes.any,
	location: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	authRole: authRole(state)
});

export default withLocaleRouter(connect(mapStateToProps)(SearchView));