import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ViewPanel from 'components/Layout/ViewPanel';
import MasterDetail from 'components/Layout/MasterDetail';
import HeaderStrip from 'components/Layout/HeaderStrip';
import CardList from 'components/Layout/CardList';
import HeaderStripContent from 'components/Layout/HeaderStripContent';
import { connect } from 'react-redux';
import { loadApplications } from 'redux/actions/employer';
import { urlSearchToObj, mergeUrlSearch } from 'utils/url';
import ApplicationCard from './ApplicationCard';
import ApplicationDetail from './ApplicationDetail';
import EmptyState from 'components/Layout/EmptyState';
import ApplicationDetailCommands from './ApplicationDetailCommands';
import errorBoundary from 'components/Decorators/errorBoundary';
import requireRole from 'components/Decorators/requireRole';
import { DEALER_ROLES } from 'redux/selectors';
import Localized from 'components/Localization/Localized';
import { getPrevLink } from 'utils/router';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import './ApplicationView.css';

class ApplicationView extends Component {
	constructor(props) {
		super(props);

		const { loadApplications, match: { params } } = props;

		loadApplications({
			id: params.id
		});
	}

	state = {
		detail: false
	}

	static getDerivedStateFromProps(props, state) {
		const { location: { search } } = props;
		const urlSearch = urlSearchToObj(search);

		return {
			id: urlSearch.id || state.id,
			detail: !!urlSearch.id && !!parseInt(urlSearch.detail, 10)
		};
	}

	componentDidUpdate(prevProps) {
		const { loadApplications, match: { params } } = this.props;

		if(params.id !== prevProps.match.params.id)
			loadApplications({ id: params.id });
	}

	renderMaster = id => () => {
		const { location } = this.props;
		let { applications: { loading, result } } = this.props;

		result = result || [];

		return (
			<CardList
				className="application-view-card-list"
				loading={loading}
				totalCount={result.length}
				emptyText="No applications found">

				{result.map((item, i) => (
					<ApplicationCard 
						key={i} 
						application={item}
						to={{
							...location,
							search: mergeUrlSearch(location.search, { id: item.id, detail: 1 })
						}}
						selected={item.id === id} />
				))}
			</CardList>
		);
	}

	renderDetail = application => () => {
		if(application)
			return (
				<ApplicationDetail application={application} />
			);
		else
			return (
				<Localized names="Employer">
					{({ SelectAnApplicationLabel }) => (
						<EmptyState>
							{SelectAnApplicationLabel}
						</EmptyState>
					)}
				</Localized>
			);
	}

	render() {
		const { location, applications: { result } } = this.props;
		const { id, detail } = this.state;

		let application = (result || []).find(a => a.id === id);
		if(!application && result && result.length > 0)
			application = result[0];

		const masterBackPath = getPrevLink(location, '/employer/job-postings');
		const detailBackPath = {
			...location,
			search: mergeUrlSearch(location.search, { id: null, detail: null })
		};

		return (
			<ViewPanel className="application-view" scrolling>
				<HeaderStrip>
					<MasterDetail showDetail={detail}>
						{({ masterVisible }) => (
							<HeaderStripContent className="application-view-hs-content">
								<HeaderStripContent.Back to={masterVisible ? masterBackPath : detailBackPath} />

								<h1>Applications</h1>
							</HeaderStripContent>
						)}
					</MasterDetail>
				</HeaderStrip>

				<MasterDetail
					className="application-view-md"
					showDetail={detail}
					master={this.renderMaster(application ? application.id : null)}
					detail={this.renderDetail(application)}>

					{(result && result.length === 0) ? (() => (
						<EmptyState>
							No applications found
						</EmptyState>
					)) : null}
				</MasterDetail>

				{detail && application && <ApplicationDetailCommands application={application} layout="mobile" />}
			</ViewPanel>
		);
	}
}

ApplicationView.propTypes = {
	location: PropTypes.object.isRequired,
	match: PropTypes.object.isRequired,
	loadApplications: PropTypes.func.isRequired,
	applications: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	applications: state.employer.applications
});
 
export default errorBoundary(withLocaleRouter(connect(mapStateToProps, { loadApplications })(requireRole(DEALER_ROLES)(ApplicationView))));