import React from 'react';
import PropTypes from 'prop-types';
import SavedJobsView from './SavedJobsView';
import { connect } from 'react-redux';
import { loadSavedJobs } from 'redux/actions/jobs';
import { humanizePastDate } from 'utils/format';
import JobCard from './JobCard';
import LocalizedNode from 'components/Localization/LocalizedNode';
import errorBoundary from 'components/Decorators/errorBoundary';
import { language } from 'redux/selectors';

const UserSavedJobsView = ({ language, ...props }) => {
	/* eslint-disable react/prop-types */
	const title = () => <LocalizedNode as="h1" names={['Common', 'Jobs']} groupKey="SavedJobsTitle" />;

	const jobAge = ({ job }) => (
		<span>
			<LocalizedNode names={['Common', 'Jobs']} groupKey="PostedLabel" /><br />
			{humanizePastDate(job.postDate, language)}
		</span>
	);

	const card = props => <JobCard {...props} jobAge={jobAge} />;
	/* eslint-enable */

	return (
		<SavedJobsView {...props} title={title} card={card} />
	);
};

UserSavedJobsView.propTypes = {
	language: PropTypes.string.isRequired
};

const mapStateToProps = state => {
	const savedJobs = state.jobs.savedJobs;

	const jobs = {
		...savedJobs,

		result: savedJobs.result ? savedJobs.result.filter(job => job.appliedDate == null) : null
	};

	return {
		jobs,
		language: language(state)
	};
};

const mapDispatchToProps = {
	loadJobs: loadSavedJobs
};

export default errorBoundary(connect(mapStateToProps, mapDispatchToProps)(UserSavedJobsView));