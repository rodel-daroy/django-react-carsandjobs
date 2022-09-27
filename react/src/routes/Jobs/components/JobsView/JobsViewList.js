import React from 'react';
import PropTypes from 'prop-types';
import CardList from 'components/Layout/CardList';
import JobCard from '../JobCard';
import { connect } from 'react-redux';
import { loadMoreJobs } from 'redux/actions/jobs';
import NoJobsFound from './NoJobsFound';
import './JobsViewList.css';

const JobsViewList = ({ jobId, onSelect, jobs, loadMoreJobs, loading, to, footer }) => {
	const totalCount = jobs ? jobs.totalCount : 0;
	const jobList = jobs ? jobs.jobs : [];

	const handleSelect = jobId => onSelect ? onSelect.bind(this, jobId) : null;

	return (
		<div className="jobs-view-list">
			<CardList 
				className="jobs-view-list-inner" 
				onLoadMore={loadMoreJobs} 
				totalCount={totalCount} 
				loading={loading}
				emptyText={(
					<div className="jobs-view-list-empty">
						<div className="jobs-view-list-empty-label">
							<NoJobsFound />
						</div>

						{footer()}
					</div>
				)}
				footer={totalCount > 0 ? footer : null}>

				{jobList.map((job, i) => (
					<JobCard 
						key={i} 
						job={job} 
						onClick={handleSelect(job.id)} 
						selected={jobId === job.id}
						to={to ? to(job.id) : null} />
				))}
			</CardList>
		</div>
	);
};

JobsViewList.propTypes = {
	jobId: PropTypes.any,
	onSelect: PropTypes.func,
	to: PropTypes.func,
	footer: PropTypes.func,

	jobs: PropTypes.object,
	loading: PropTypes.bool,
	loadMoreJobs: PropTypes.func
};

const mapStateToProps = state => ({
	jobs: state.jobs.jobs.result,
	loading: state.jobs.jobs.loading
});
 
export default connect(mapStateToProps, { loadMoreJobs })(JobsViewList);