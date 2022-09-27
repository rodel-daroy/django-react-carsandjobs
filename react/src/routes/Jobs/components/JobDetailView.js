import React, { Component } from 'react';
import PropTypes from 'prop-types';
import JobDetail from './JobDetail';
import { connect } from 'react-redux';
import { loadJobDetail, saveJob, unsaveJob } from 'redux/actions/jobs';
import EmptyState from 'components/Layout/EmptyState';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import { urlSearchToObj, mergeUrlSearch } from 'utils/url';
import { language } from 'redux/selectors';
import ApiError from 'services/ApiError';
import NotFoundView from 'layout/components/NotFoundView';
import './JobDetailView.css';

class JobDetailView extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentId: null
		};
	}

	static getDerivedStateFromProps(props, state) {
		const { jobId: id, loadJobDetail, location: { search }, preview, language } = props;

		const tabIndex = parseInt(urlSearchToObj(search).tab || 0, 10);

		const newId = !preview && (id !== state.currentId || language !== state.language);
		if(newId) {
			if(id) {
				loadJobDetail({ id, language });

				return {
					currentId: id,
					tabIndex,
					language
				};
			}
			else
				return {
					currentId: null,
					tabIndex,
					language
				};
		}
		
		return { tabIndex };
	}

	handleChangeTab = tab => {
		const { history, location: { pathname, search, state } } = this.props;

		const newSearch = mergeUrlSearch(search, { tab });
		history.replace({
			pathname,
			search: newSearch,
			state
		});
	}

	renderError() {
		const { jobDetail: { error } } = this.props;

		if(error instanceof ApiError && error.status === 404)
			return (
				<NotFoundView />
			);
		else
			return null;
	}

	render() {
		const { 
			jobDetail: { result, loading, error }, 
			jobId, 
			saveJob, 
			unsaveJob, 
			className, 
			preview, 
			emptyState, 
			commands 
		} = this.props;
		const { tabIndex } = this.state;

		const hasJob = (result && result.id === jobId) || !!preview;
		const isLoading = loading && !preview;
		const hasError = jobId && error;

		if(hasError)
			return this.renderError();

		if(hasJob && !isLoading)
			return (
				<div className={`job-detail-view ${className || ''}`}>
					{hasJob && (
						<JobDetail 
							job={preview || result} 
							onSave={() => saveJob({ id: jobId })}
							onUnsave={() => unsaveJob({ id: jobId })}
							tabIndex={tabIndex}
							onChangeTab={this.handleChangeTab}
							commands={commands} />
					)}
				</div>
			);
		else {
			if(isLoading)
				return <EmptyState.Loading />;
			else
				return emptyState && emptyState();
		}
	}
}

JobDetailView.propTypes = {
	jobId: PropTypes.any,
	className: PropTypes.string,
	preview: PropTypes.object,
	emptyState: PropTypes.func,
	commands: PropTypes.elementType,
	
	jobDetail: PropTypes.object,
	loadJobDetail: PropTypes.func.isRequired,
	saveJob: PropTypes.func.isRequired,
	unsaveJob: PropTypes.func.isRequired,
	location: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	language: PropTypes.string.isRequired
};

JobDetailView.defaultProps = {
	visible: true,
	emptyState: null
};

const mapStateToProps = state => ({
	jobDetail: state.jobs.jobDetail,
	language: language(state)
});

export default withLocaleRouter(connect(mapStateToProps, { loadJobDetail, saveJob, unsaveJob })(JobDetailView));