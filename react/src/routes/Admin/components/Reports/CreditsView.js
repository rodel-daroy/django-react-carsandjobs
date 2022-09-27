import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContentMetaTags from 'components/Content/ContentMetaTags';
import HeaderStrip from 'components/Layout/HeaderStrip';
import HeaderStripContentLarge from 'components/Layout/HeaderStripContentLarge';
import HeaderStripContent from 'components/Layout/HeaderStripContent';
import { connect } from 'react-redux';
import { loadCreditReport } from 'redux/actions/admin';
import EmptyState from 'components/Layout/EmptyState';
import PagedList from 'components/Layout/PagedList';
import { formatShortDate } from 'utils/format';
import { urlSearchToObj, mergeUrlSearch, objToUrlSearch } from 'utils/url';
import DealerField from 'routes/Employer/components/DealerField';
import ContentBlock from 'components/Layout/ContentBlock';
import LocaleLink from 'components/Localization/LocaleLink';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import { getNextLink } from 'utils/router';
import { authDealers, authRole } from 'redux/selectors';
import { selectedDealers } from './helpers';
import Localized from 'components/Localization/Localized';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import './CreditsView.css';

class CreditsView extends Component {
	state = {}

	static getDerivedStateFromProps(props) {
		const { location } = props;

		const { p, dealer } = urlSearchToObj(location.search);

		return {
			pageIndex: parseInt(p, 10) || 0,
			dealer
		};
	}

	renderResult = ({ startIndex, endIndex }) => {
		const { report: { all }, location } = this.props;
		
		if(all) {
			const items = all.slice(startIndex, endIndex);

			return (
				<Localized names={['Common', 'Employer', 'Admin']}>
					{({
						TransactionDateLabel,
						InvoiceLabel,
						DealershipLabel,
						JobLabel,
						DetailLabel,
						DebitsLabel,
						CreditsLabel,
						NoTransactionsFoundLabel
					}) => (
						<table>
							<thead>
								<tr>
									<th>{TransactionDateLabel}</th>
									<th className="min-width align-center">{InvoiceLabel}</th>
									<th>{DealershipLabel}</th>
									<th className="min-width align-center">{JobLabel}</th>
									<th>{DetailLabel}</th>
									<th className="min-width">{DebitsLabel}</th>
									<th className="min-width">{CreditsLabel}</th>
								</tr>
							</thead>

							<tbody>
								{items.map((item, i) => (
									<tr key={i}>
										<td>{formatShortDate(item.transactionDate)}</td>
										<td className="min-width align-center">
											{item.invoiceId && (
												<PrimaryLink 
													className="credits-view-link" 
													as={LocaleLink}
													to={getNextLink(`/admin/credits/invoice/${item.invoiceId}`, location)}
													hasIcon
													iconClassName="icon icon-doc-text-inv"
													size="x-large">
												</PrimaryLink>
											)}
										</td>
										<td>{item.dealerName}</td>
										<td className="min-width align-center">
											{item.jobId && (
												<PrimaryLink
													className="credits-view-link"
													as={LocaleLink}
													to={`/jobs/detail?id=${item.jobId}`}
													target="_blank"
													hasIcon
													iconClassName="icon icon-briefcase"
													size="x-large">
												</PrimaryLink>
											)}
										</td>
										<td>{item.description}</td>
										<td className="credits-view-debits min-width">{item.quantity < 0 && Math.abs(item.quantity)}</td>
										<td className="credits-view-credits min-width">{item.quantity >= 0 && item.quantity}</td>
									</tr>
								))}

								{items.length === 0 && (
									<tr>
										<td colSpan={7}>
											<EmptyState inline>
												{NoTransactionsFoundLabel}
											</EmptyState>
										</td>
									</tr>
								)}
							</tbody>
						</table>
					)}
				</Localized>
			);
		}
		
		return null;
	}

	handlePageChange = pageIndex => {
		const { location, history } = this.props;

		history.replace({
			...location,
			search: mergeUrlSearch(location.search, { p: pageIndex })
		});
	}

	handleListChange = ({ startIndex, endIndex }) => {
		const { loadCreditReport, dealers, role } = this.props;
		const { dealer } = this.state;

		const filter = {
			dealer: selectedDealers(dealer, dealers, role)
		};

		loadCreditReport({ startIndex, endIndex, filter }, { cancelPrevious: true });
	}

	handleDealerChange = dealer => {
		const { location, history } = this.props;

		history.replace({
			...location,
			search: objToUrlSearch({ dealer })
		});
	}

	render() {
		const { report: { loading, all } } = this.props;
		const { pageIndex, dealer } = this.state;

		return (
			<Localized names={['Common', 'Employer', 'Admin']}>
				{({ 
					CreditsTitle,
					ForDealerLabel,
					AllDealersPlaceholder
				}) => (
					<div className="credits-view">
						<ContentMetaTags title={CreditsTitle} />
						
						<HeaderStrip>
							<HeaderStripContentLarge>
								<HeaderStripContent.Back to="/admin" />

								<h1>{CreditsTitle}</h1>
							</HeaderStripContentLarge>
						</HeaderStrip>

						<ContentBlock>
							<DealerField 
								label={ForDealerLabel}
								allDealers
								nullLabel={AllDealersPlaceholder}
								placeholder={AllDealersPlaceholder}
								value={dealer}
								onChange={this.handleDealerChange} />
						</ContentBlock>

						<ContentBlock>
							<PagedList
								key={dealer || 'default'}
								totalCount={all ? all.length : 0}
								onChange={this.handlePageChange}
								onRangeChange={this.handleListChange}
								loading={loading}
								pageIndex={pageIndex}>

								{this.renderResult}
							</PagedList>
						</ContentBlock>
					</div>
				)}
			</Localized>
		);
	}
}

CreditsView.propTypes = {
	report: PropTypes.object.isRequired,
	loadCreditReport: PropTypes.func.isRequired,
	location: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	dealers: PropTypes.array.isRequired,
	role: PropTypes.any.isRequired
};

const mapStateToProps = state => ({
	report: state.admin.creditReport,
	dealers: authDealers(state),
	role: authRole(state)
});
 
export default withLocaleRouter(connect(mapStateToProps, { loadCreditReport })(CreditsView));