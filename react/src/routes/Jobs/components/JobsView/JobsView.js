import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import LocaleLink from 'components/Localization/LocaleLink';
import JobFilter from '../Filter/JobFilter';
import JobsViewList from './JobsViewList';
import JobDetailView from '../JobDetailView';
import JobsViewBrowse from './JobsViewBrowse';
import JobFilterBreadcrumbs from '../Filter/JobFilterBreadcrumbs';
import ViewPanel from 'components/Layout/ViewPanel';
import HeaderStrip from 'components/Layout/HeaderStrip';
import HeaderStripContent from 'components/Layout/HeaderStripContent';
import { parseFilter, updateFilter } from 'routes/Jobs/filter';
import { mergeUrlSearch, urlSearchToObj } from 'utils/url';
import MasterDetail from 'components/Layout/MasterDetail';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';
import { connect } from 'react-redux';
import { loadJobs } from 'redux/actions/jobs';
import WithResponsiveModal from 'components/Modals/WithResponsiveModal';
import ResponsiveModalFrame from 'components/Modals/ResponsiveModalFrame';
import JobFilterSearch from '../Filter/JobFilterSearch';
import JobDetailCommands from '../JobDetailCommands';
import CommandBar from 'components/Layout/CommandBar';
import SaveSearch from '../SaveSearch';
import EmptyState from 'components/Layout/EmptyState';
import Localized from 'components/Localization/Localized';
import LocalizedNode from 'components/Localization/LocalizedNode';
import errorBoundary from 'components/Decorators/errorBoundary';
import { language, region } from 'redux/selectors';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import { parseMarkdown } from 'utils/format';
import NoJobsFound from './NoJobsFound';
import './JobsView.css';

class JobsView extends Component {
	state = {
		detail: false,
		refine: false,
		jobId: null,
		filter: null,
		allProvinces: false
	}

	static getDerivedStateFromProps(props) {
		const { location: { search }, jobs } = props;

		const searchObj = urlSearchToObj(search);

		const detail = !!parseInt(searchObj.detail, 10);
		const refine = !!parseInt(searchObj.refine, 10);

		let jobId = searchObj.id;

		if(jobs && jobs.result && jobId) {
			if(!jobs.result.jobs.find(job => job.id === jobId))
				jobId = null;
		}

		const filter = parseFilter(searchObj);

		const allProvinces = !!parseInt(searchObj.allProvinces, 10);

		return {
			detail,
			refine,
			jobId,
			filter,
			allProvinces
		};
	}

	componentDidMount() {
		const { location: { search }, loadJobs } = this.props;

		const filter = parseFilter(search);
		loadJobs(this.transformFilter(filter));
	}

	componentDidUpdate(prevProps, prevState) {
		const { language, loadJobs, province, location } = this.props;
		const { allProvinces } = this.state;

		const currentFilter = parseFilter(location.search);
		const prevFilter = parseFilter(prevProps.location.search);

		if(language !== prevProps.language 
			|| province !== prevProps.province 
			|| allProvinces !== prevState.allProvinces
			|| !isEqual(currentFilter, prevFilter)) {

			loadJobs(this.transformFilter(currentFilter));
		}
	}

	transformFilter(filter) {
		const { province, language } = this.props;
		const { allProvinces } = this.state;

		let result = {
			...filter,
			language
		};

		if(!result.location && !allProvinces)
			result.location = { province };

		return result;
	}

	getSearchJobSelectLink = selectedId => {
		const { location } = this.props;

		const search = mergeUrlSearch(location.search, { id: selectedId, detail: 1 });

		return {
			...location,
			search
		};
	}

	getBrowseJobSelectLink = selectedId => {
		const { location } = this.props;

		const prev = {
			...location,
			search: mergeUrlSearch(location.search, { id: selectedId })
		};
		const browse = {
			...location,
			search: mergeUrlSearch(location.search, { id: selectedId, detail: null })
		};

		const search = mergeUrlSearch(location.search, { id: selectedId });

		return {
			...location,
			pathname: '/jobs/detail',
			search,
			state: {
				...(location.state || {}),
				prev,
				browse
			}
		};
	}

	getBackLink = () => {
		const { location } = this.props;

		const search = mergeUrlSearch(location.search, { detail: 0 });

		return {
			...location,
			search
		};
	}

	handleUpdateFilter = filter => {
		const { location, history } = this.props;
		updateFilter(filter, { location, history }, { refine: null, detail: null });
	};

	handleCloseRefine = () => {
		const { location, history } = this.props;

		const search = mergeUrlSearch(location.search, { refine: null });
		history.push({
			...location,
			search
		});
	}

	renderListFooter = () => {
		const { allProvinces, filter } = this.state;

		if(allProvinces || filter.location)
			return null;

		return this.renderShowJobsForAllProvinces();
	}

	renderShowJobsForAllProvinces() {
		const { location, province } = this.props;

		const link = {
			...location,
			search: mergeUrlSearch(location.search, { allProvinces: 1 })
		};

		return (
			<Localized names="Jobs">
				{({ 
					OnlyShowingJobsWithinMessage,
					ShowJobsForAllProvincesLabel
				}) => (
					<div className="jobs-view-show-all-provinces">
						<div dangerouslySetInnerHTML={{ 
							__html: parseMarkdown((OnlyShowingJobsWithinMessage || '').replace('[province]', province))
						}} />

						<PrimaryButton size="medium" as={LocaleLink} to={link}>
							{ShowJobsForAllProvincesLabel}
						</PrimaryButton>
					</div>
				)}
			</Localized>
		);
	}

	handleJobSelect = id => {
		const { history, location } = this.props;
		
		history.replace({
			...location,
			search: mergeUrlSearch(location.search, { id })
		});
	}

	renderMaster = ({ detailVisible }) => {
		const { layout } = this.props;
		const { jobId, filter } = this.state;

		switch(layout) {
			case 'search': {
				return (
					<JobsViewList 
						jobId={jobId}
						to={this.getSearchJobSelectLink}
						onSelect={this.handleJobSelect}
						footer={this.renderListFooter} />
				);
			}

			case 'browse': {
				return (
					<JobsViewBrowse filter={filter} detailVisible={detailVisible} />
				);
			}

			default: {
				return null;
			}
		}
	}

	get noJobs() {
		const { jobs } = this.props;
		return !jobs.loading && jobs.result && jobs.result.totalCount === 0;
	}

	renderDetail = () => {
		const { layout } = this.props;
		const { jobId, filter } = this.state;

		switch(layout) {
			case 'search': {
				return (
					<Localized names={['Common', 'Jobs']}>
						{({ SelectAnItemLabel }) => (
							<JobDetailView 
								jobId={jobId}
								filter={filter}
								emptyState={() => this.noJobs ? null : <EmptyState>{SelectAnItemLabel}</EmptyState>}
								commands={JobDetailCommands} />
						)}
					</Localized>
				);
			}

			case 'browse': {
				return (
					<JobsViewList 
						jobId={jobId} 
						to={this.getBrowseJobSelectLink}
						onSelect={this.handleJobSelect}
						footer={this.renderListFooter} />
				);
			}

			default: {
				return null;
			}
		}
	}

	renderBrowseButton() {
		return (
			<PrimaryLink 
				as={LocaleLink} 
				size="large" 
				className="jobs-view-refine" 
				to={this.getBackLink()} 
				iconClassName="icon icon-filter"
				hasIcon>

				<Localized names={['Common', 'Jobs']}>
					{({ BrowseLabel }) => BrowseLabel}
				</Localized>
			</PrimaryLink>
		);
	}

	renderSearchButton() {
		const { location } = this.props;
		const refineLink = {
			...location,
			search: mergeUrlSearch(location.search, { refine: 1 })
		};

		return (
			<PrimaryLink 
				as={LocaleLink} 
				size="large" 
				className="jobs-view-refine" 
				to={refineLink} 
				iconClassName="icon icon-search"
				hasIcon>

				<Localized names={['Common', 'Jobs']}>
					{({ RefineSearchLabel, RefineLabel }) => (
						<React.Fragment>
							<span className="hidden-xs hidden-sm">{RefineSearchLabel}</span>
							<span className="hidden-md hidden-lg">{RefineLabel}</span>
						</React.Fragment>
					)}
				</Localized>
			</PrimaryLink>
		);
	}

	render() {
		const { layout, jobDetail, jobs: { result } } = this.props;
		const { detail, refine, filter, allProvinces } = this.state;

		const breadcrumbsUrlSearch = (layout === 'search') ? { detail: null } : null;

		let mainPlaceholder;
		if(this.noJobs) {
			if(layout === 'search')
				mainPlaceholder = () => (
					<EmptyState>
						<div>
							<NoJobsFound />

							{!allProvinces && !filter.location && this.renderShowJobsForAllProvinces()}
						</div>
					</EmptyState>
				);
		}
		else {
			if(layout === 'search' && !result) 
				mainPlaceholder = () => (
					<EmptyState.Loading>
						<LocalizedNode names="Jobs" groupKey="LoadingJobsLabel" />
					</EmptyState.Loading>
				);
		}

		return (
			<ViewPanel className={`jobs-view ${layout}`} scrolling>
				<WithResponsiveModal
					isOpen={refine}
					onRequestClose={this.handleCloseRefine}
					modalContent={props => (
						<ResponsiveModalFrame {...omit(props, ['isOpen'])} className="jobs-view-modal-frame" title="Refine search" onRequestClose={this.handleCloseRefine}>
							<JobFilterSearch showAllFields filter={filter} onUpdate={this.handleUpdateFilter} />
						</ResponsiveModalFrame>
					)}>

					{() => (
						<React.Fragment>
							<HeaderStrip>
								<MasterDetail 
									className="jobs-view-header-md"
									showDetail={detail}
									master={({ detailVisible }) => (
										<HeaderStripContent className="jobs-view-header">
											<JobFilterBreadcrumbs urlSearch={breadcrumbsUrlSearch} isSearch={layout === 'search'} />

											{!detailVisible && layout === 'search' && (
												<CommandBar className="jobs-view-commands">
													{this.renderSearchButton()}
													<SaveSearch filter={filter} />
												</CommandBar>
											)}
										</HeaderStripContent>
									)} 
									detail={({ masterVisible }) => (
										<HeaderStripContent className="jobs-view-header">
											{!masterVisible && <HeaderStripContent.Back to={this.getBackLink()} />}

											{masterVisible && (
												<JobFilter 
													filter={filter} 
													showRefine={layout === 'search'} />
											)}

											{!masterVisible && (
												<React.Fragment>
													<JobFilterBreadcrumbs urlSearch={breadcrumbsUrlSearch} isSearch={layout === 'search'} />

													{layout === 'browse' && this.renderBrowseButton()}
												</React.Fragment>
											)}

											{layout === 'search' && (
												<CommandBar className="jobs-view-commands">
													{this.renderSearchButton()}
													<SaveSearch filter={filter} />
												</CommandBar>
											)}
										</HeaderStripContent>
									)} />
							</HeaderStrip>

							<MasterDetail
								className="jobs-view-md"
								showDetail={detail}
								master={this.renderMaster}
								detail={this.renderDetail}>

								{mainPlaceholder}
							</MasterDetail>

							{detail && layout === 'search' && <JobDetailCommands layout="mobile" job={jobDetail} />}
						</React.Fragment>
					)}
				</WithResponsiveModal>
			</ViewPanel>
		);
	}
}

JobsView.propTypes = {
	layout: PropTypes.oneOf(['search', 'browse']).isRequired,

	match: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	loadJobs: PropTypes.func.isRequired,
	jobs: PropTypes.object,
	jobDetail: PropTypes.object,
	language: PropTypes.string.isRequired,
	province: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
	jobs: state.jobs.jobs,
	jobDetail: state.jobs.jobDetail.result,
	language: language(state),
	province: region(state)
});

export default errorBoundary(withLocaleRouter(connect(mapStateToProps, { loadJobs })(JobsView)));