import React from 'react';
import SavedJobsView from '../SavedJobsView';
import { connect } from 'react-redux';
import { loadApplicationHistory } from 'redux/actions/jobs';
import JobCard from '../JobCard';
import { humanizePastDate } from 'utils/format';
import LocalizedNode from 'components/Localization/LocalizedNode';
import errorBoundary from 'components/Decorators/errorBoundary';

const JobApplicationHistoryView = ({ ...props }) => {
	/* eslint-disable react/prop-types */
	const title = () => <LocalizedNode as="h1" names={['Common', 'Jobs']} groupKey="ApplicationHistoryTitle" />;

	const jobAge = ({ job, language }) => (
		<span>
			<LocalizedNode names={['Common', 'Jobs']} groupKey="AppliedLabel" /><br />
			{humanizePastDate(job.appliedDate, language)}
		</span>
	);

	const card = ({ ...otherProps }) => <JobCard {...otherProps} jobAge={jobAge} />;
	/* eslint-enable */

	return (
		<SavedJobsView {...props} title={title} card={card} />
	);
};

const mapStateToProps = state => {
	const history = state.jobs.applications.history;

	const jobs = {
		...history,

		result: history.result ? history.result.map(app => app.job) : null
	};

	return {
		jobs
	};
};

const mapDispatchToProps = {
	loadJobs: loadApplicationHistory
};
 
export default errorBoundary(connect(mapStateToProps, mapDispatchToProps)(JobApplicationHistoryView));