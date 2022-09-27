import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ViewPanel from 'components/Layout/ViewPanel';
import HeaderStrip from 'components/Layout/HeaderStrip';
import HeaderStripContent from 'components/Layout/HeaderStripContent';
import HeaderStripContentLarge from 'components/Layout/HeaderStripContentLarge';
import MasterDetail from 'components/Layout/MasterDetail';
import JobDetailView from './JobDetailView';
import CardList from 'components/Layout/CardList';
import JobCard from './JobCard';
import { urlSearchToObj, mergeUrlSearch } from 'utils/url';
import EmptyState from 'components/Layout/EmptyState';
import JobDetailCommands from './JobDetailCommands';
import { connect } from 'react-redux';
import Media from 'react-media';
import { mediaQuery } from 'utils/style';
import requireRole from 'components/Decorators/requireRole';
import { JOBSEEKER_ROLE } from 'redux/selectors';
import Localized from 'components/Localization/Localized';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import './SavedJobsView.css';

class SavedJobsView extends Component {
	constructor(props) {
		super(props);

		props.loadJobs();
	}

	state = {
		detail: false,
		jobId: null
	}

	static getDerivedStateFromProps(props) {
		const params = urlSearchToObj(props.location.search);

		let detail = !!params.detail;
		let jobId = params.id || null;

		const { jobs } = props;
		if(jobs && jobs.result && jobId) {
			if(!jobs.result.find(job => job.id === jobId)) {
				jobId = null;
				detail = false;
			}
		}

		return {
			detail,
			jobId
		};
	}

	handleJobSelect = id => () => {
		const { history, location } = this.props;

		history.replace({
			...location,
			search: mergeUrlSearch(location.search, { id })
		});
	}

	renderList = () => {
		const { jobs, location: { pathname, search }, card } = this.props;
		const { jobId } = this.state;

		const jobsList = jobs.result || [];

		return (
			<CardList className="saved-jobs-view-list" loading={jobs.loading} totalCount={jobsList.length}>
				{jobsList.map((job, i) => card({
					key: i,
					job, 
					selected: job.id === jobId,
					to: `${pathname}${mergeUrlSearch(search, { id: job.id, detail: 1 })}`,
					onClick: this.handleJobSelect(job.id)
				}))}
			</CardList>
		);
	}

	renderDetail = jobSelected => () => {
		const { jobId } = this.state;

		if(jobSelected)
			return (
				<JobDetailView jobId={jobId} commands={JobDetailCommands} />
			);
		else
			return (
				<Localized names="Jobs">
					{({ SelectAJobLabel }) => (
						<EmptyState>{SelectAJobLabel}</EmptyState>
					)}
				</Localized>
			);
	}

	renderHeaderContent = matches => {
		const { title, jobs, location: { pathname, search } } = this.props;
		const { detail } = this.state;

		const count = (jobs && jobs.result) ? jobs.result.length : 0;

		let backPath;
		if(matches && detail)
			backPath = `${pathname}${mergeUrlSearch(search, { detail: null })}`;
		else
			backPath = urlSearchToObj(search).prev || '/search';

		return (
			<HeaderStripContentLarge className="saved-jobs-view-header">
				{backPath && <HeaderStripContent.Back to={backPath} />}

				{title({ count })}
			</HeaderStripContentLarge>
		);
	}

	render() {
		const { detail, jobId } = this.state;
		/* eslint-disable no-unused-vars */
		const { jobs, jobDetail, emptyState, className } = this.props;
		/* eslint-enable */

		const noSavedJobs = jobs && jobs.result && jobs.result.length === 0;
		const jobSelected = jobs && jobs.result && !!jobs.result.find(job => job.id === jobId);

		return (
			<ViewPanel scrolling className={`saved-jobs-view ${className || ''}`}>
				<HeaderStrip className="saved-jobs-view-header-strip">
					<Media query={mediaQuery('xs sm')}>
						{this.renderHeaderContent}
					</Media>
				</HeaderStrip>

				{!noSavedJobs && (
					<MasterDetail 
						className="saved-jobs-view-md"
						showDetail={detail}
						master={this.renderList}
						detail={this.renderDetail(jobSelected)} />
				)}

				{noSavedJobs && emptyState()}

				{detail && jobSelected && !jobDetail.loading && <JobDetailCommands layout="mobile" job={jobDetail.result} />}
			</ViewPanel>
		);
	}
}

SavedJobsView.propTypes = {
	jobs: PropTypes.object,
	jobDetail: PropTypes.object,
	loadJobs: PropTypes.func.isRequired,
	location: PropTypes.object.isRequired,
	title: PropTypes.func,
	emptyState: PropTypes.func,
	className: PropTypes.string,
	card: PropTypes.func,
	history: PropTypes.object.isRequired
};

SavedJobsView.defaultProps = {
	/* eslint-disable react/display-name, react/prop-types */
	title: ({ count }) => (
		<Localized names="Jobs">
			{({ JobsCountLabel }) => (
				<h1>{count} {JobsCountLabel}</h1>
			)}
		</Localized>
	),
	emptyState: () => (
		<Localized names="Jobs">
			{({ NoSavedJobsLabel }) => (
				<EmptyState>{NoSavedJobsLabel}</EmptyState>
			)}
		</Localized>
	),
	card: props => <JobCard {...props} />
	/* eslint-enable */
};

const mapStateToProps = state => ({
	jobDetail: state.jobs.jobDetail
});
 
export default requireRole(JOBSEEKER_ROLE)(withLocaleRouter(connect(mapStateToProps)(SavedJobsView)));