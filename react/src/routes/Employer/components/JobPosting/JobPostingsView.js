import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import LocaleLink from 'components/Localization/LocaleLink';
import { connect } from 'react-redux';
import { loadJobPostings } from 'redux/actions/employer';
import Localized from 'components/Localization/Localized';
import ContentMetaTags from 'components/Content/ContentMetaTags';
import errorBoundary from 'components/Decorators/errorBoundary';
import requireRole from 'components/Decorators/requireRole';
import { authDealers, DEALER_ROLES } from 'redux/selectors';
import PagedList from 'components/Layout/PagedList';
import ViewPanel from 'components/Layout/ViewPanel';
import HeaderStrip from 'components/Layout/HeaderStrip';
import HeaderStripContentLarge from 'components/Layout/HeaderStripContentLarge';
import HeaderStripContent from 'components/Layout/HeaderStripContent';
import DealerField from '../DealerField';
import JobPostingsTable from './JobPostingsTable';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import { mergeUrlSearch, urlSearchToObj } from 'utils/url';
import { getNextLink } from 'utils/router';
import './JobPostingsView.css';

class JobPostingsView extends Component {
	constructor(props) {
		super(props);

		this.state = {
			dealer: (props.dealers[0] || {}).id
		};
	}

	static getDerivedStateFromProps(props) {
		const { location: { search }, dealers } = props;

		let { dealer, p } = urlSearchToObj(search);

		if(!dealer)
			dealer = (dealers[0] || {}).id;

		return {
			dealer,
			pageIndex: parseInt(p, 10) || 0
		};
	}

	handleDealerChange = dealer => {
		const { location, history } = this.props;

		if(dealer !== this.state.dealer)
			history.replace({
				...location,
				search: mergeUrlSearch(location.search, { dealer, p: 0 })
			});
	}

	handlePageChange = pageIndex => {
		const { location, history } = this.props;

		if(pageIndex !== this.state.pageIndex)
			history.replace({
				...location,
				search: mergeUrlSearch(location.search, { p: pageIndex })
			});
	}

	handleRangeChange = ({ startIndex, endIndex }) => {
		const { loadJobPostings } = this.props;
		const { dealer } = this.state;

		loadJobPostings({
			dealer,
			startIndex,
			count: (endIndex - startIndex) + 1
		});
	}

	render() { 
		const { postings: { loading, all }, location } = this.props;
		const { dealer, pageIndex } = this.state;

		return (
			<Localized names={['Common', 'Employer']}>
				{({ JobPostingsTitle, AddJobPostingLabel, ShowingJobsForDealerLabel }) => (
					<React.Fragment>
						<ContentMetaTags title={JobPostingsTitle} />

						<ViewPanel className="job-postings-view">
							<HeaderStrip>
								<HeaderStripContentLarge>
									<HeaderStripContent.Back to="/employer/dashboard" />

									<h1>{JobPostingsTitle}</h1>
								</HeaderStripContentLarge>
							</HeaderStrip>

							<div className="job-postings-view-inner">
								<div className="job-postings-view-controls">
									<PrimaryButton 
										className="job-postings-view-add" 
										as={LocaleLink} 
										to={getNextLink('/employer/job-posting', location)}>

										+ {AddJobPostingLabel}
									</PrimaryButton>
								</div>
							</div>

							<div className="job-postings-view-inner">
								<div className="job-postings-view-controls">
									<DealerField
										className="job-postings-view-dealer"
										label={ShowingJobsForDealerLabel}
										value={dealer}
										onChange={this.handleDealerChange}
										showBalance />

									{dealer && (
										<PagedList
											key={dealer}
											className="job-postings-view-list"
											totalCount={all ? all.length : 0}
											onChange={this.handlePageChange}
											onRangeChange={this.handleRangeChange}
											loading={loading}
											pageIndex={pageIndex}>

											{({ startIndex, endIndex }) => {
												const items = (all || []).slice(startIndex, endIndex + 1).filter(i => !!i);

												return (
													<JobPostingsTable items={items} />
												);
											}}
										</PagedList>
									)}
								</div>
							</div>
						</ViewPanel>
					</React.Fragment>
				)}
			</Localized>
		);
	}
}

JobPostingsView.propTypes = {
	loadJobPostings: PropTypes.func.isRequired,
	postings: PropTypes.object.isRequired,
	dealers: PropTypes.array.isRequired,
	location: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	postings: state.employer.postings,
	dealers: authDealers(state)
});
 
export default errorBoundary(withLocaleRouter(connect(mapStateToProps, { 
	loadJobPostings
})(requireRole(DEALER_ROLES)(JobPostingsView))));