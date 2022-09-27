import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import ViewPanel from 'components/Layout/ViewPanel';
import HeaderStrip from 'components/Layout/HeaderStrip';
import HeaderStripContent from 'components/Layout/HeaderStripContent';
import { parseFilter, updateFilter } from './filter';
import { mergeUrlSearch, urlSearchToObj } from 'utils/url';
import MasterDetail from 'components/Layout/MasterDetail';
import isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import { loadResumeSearch, loadMoreResumeSearch } from 'redux/actions/employer';
import ResumeFilterForm from './ResumeFilterForm';
import ResumeCard from './ResumeCard';
import CardList from 'components/Layout/CardList';
import Localized from 'components/Localization/Localized';
import ContentMetaTags from 'components/Content/ContentMetaTags';
import errorBoundary from 'components/Decorators/errorBoundary';
import requireRole from 'components/Decorators/requireRole';
import { DEALER_ROLES } from 'redux/selectors';
import './ResumeSearchView.css';

class ResumeSearchView extends Component {
	state = {
		detail: false,
		filter: null
	}

	static getDerivedStateFromProps(props) {
		const { location: { search } } = props;

		const searchObj = urlSearchToObj(search);

		const detail = !!parseInt(searchObj.detail, 10);

		const filter = parseFilter(searchObj);

		return {
			detail,
			filter
		};
	}

	componentDidMount() {
		const { location: { search }, loadResumeSearch } = this.props;

		const filter = parseFilter(search);
		loadResumeSearch(filter);

		this.setState({
			newSearch: true
		});
	}

	componentDidUpdate(prevProps) {
		const currentFilter = parseFilter(this.props.location.search);
		const prevFilter = parseFilter(prevProps.location.search);

		if(!isEqual(currentFilter, prevFilter)) {
			this.props.loadResumeSearch(currentFilter);

			this.setState({
				newSearch: true
			});
		}

		if(!this.props.resumeSearch.loading && this.state.newSearch)
			this.setState({
				newSearch: false
			});
	}

	handleUpdateFilter = filter => {
		const { location, history } = this.props;
		updateFilter(filter, { location, history }, { detail: 1 });
	};

	renderMaster = () => {
		const { filter } = this.state;

		return (
			<ResumeFilterForm initialValues={filter} onSubmit={this.handleUpdateFilter} />
		);
	}

	renderDetail = () => {
		const { loadMoreResumeSearch, resumeSearch: { loading, result } } = this.props;
		const { newSearch } = this.state;

		const items = (result && !newSearch) ? result.resumes : [];
		const totalCount = (result && !newSearch) ? result.totalCount : null;

		return (
			<Localized names="Employer">
				{({ NoResumesFoundLabel }) => (
					<CardList 
						className="resume-search-view-cards" 
						onLoadMore={loadMoreResumeSearch} 
						totalCount={totalCount}
						loading={loading}
						emptyText={NoResumesFoundLabel}>

						{items.map((r, i) => r ? (
							<ResumeCard key={i} resume={r} />
						) : null)}
					</CardList>
				)}
			</Localized>
		);
	}

	render() {
		const { detail } = this.state;
		const { location } = this.props;

		const search = mergeUrlSearch(location.search, { detail: 0 });

		const backPath = location.pathname + search;

		return (
			<Localized names="Employer">
				{({ SearchResumesTitle }) => (
					<ViewPanel className="resume-search-view" scrolling>
						<ContentMetaTags title={SearchResumesTitle} />

						<HeaderStrip>
							<MasterDetail 
								className="resume-search-view-header-md"
								showDetail={detail}
								master={() => (
									<HeaderStripContent className="resume-search-view-header">
										<HeaderStripContent.Back to="/employer/dashboard" />

										<h1>{SearchResumesTitle}</h1>
									</HeaderStripContent>
								)} 
								detail={({ masterVisible }) => (
									<HeaderStripContent className="resume-search-view-header">
										{!masterVisible && <HeaderStripContent.Back to={backPath} />}
									</HeaderStripContent>
								)} />
						</HeaderStrip>

						<MasterDetail
							className="resume-search-view-md"
							showDetail={detail}
							master={this.renderMaster}
							detail={this.renderDetail} />
					</ViewPanel>
				)}
			</Localized>
		);
	}
}

ResumeSearchView.propTypes = {
	match: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	loadResumeSearch: PropTypes.func.isRequired,
	loadMoreResumeSearch: PropTypes.func.isRequired,
	resumeSearch: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	resumeSearch: state.employer.resumeSearch
});

export default errorBoundary(withLocaleRouter(connect(mapStateToProps, { loadResumeSearch, loadMoreResumeSearch })(requireRole(DEALER_ROLES)(ResumeSearchView))));