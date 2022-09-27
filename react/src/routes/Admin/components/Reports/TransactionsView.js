import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContentMetaTags from 'components/Content/ContentMetaTags';
import HeaderStrip from 'components/Layout/HeaderStrip';
import HeaderStripContentLarge from 'components/Layout/HeaderStripContentLarge';
import HeaderStripContent from 'components/Layout/HeaderStripContent';
import TransactionsFilterForm from './TransactionsFilterForm';
import ContentBlock from 'components/Layout/ContentBlock';
import PagedList from 'components/Layout/PagedList';
import { connect } from 'react-redux';
import { loadInvoices } from 'redux/actions/admin';
import { formatShortDate } from 'utils/format';
import EmptyState from 'components/Layout/EmptyState';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import LocaleLink from 'components/Localization/LocaleLink';
import { getNextLink } from 'utils/router';
import { urlSearchToObj, mergeUrlSearch, objToUrlSearch } from 'utils/url';
import isEqual from 'lodash/isEqual';
import moment from 'moment';
import { authDealers, authRole } from 'redux/selectors';
import { selectedDealers } from './helpers';
import Localized from 'components/Localization/Localized';
import withLocaleRouter from 'components/Localization/withLocaleRouter';

const formatFilter = ({ from, to, ...otherProps } = {}) => ({
	...otherProps,
	from: from ? moment(from).format('YYYY-MM-DD') : undefined,
	to: to ? moment(to).format('YYYY-MM-DD') : undefined
});

const parseFilter = ({ from, to, ...otherProps }) => ({
	...otherProps,
	from: from ? moment(from, 'YYYY-MM-DD').toISOString() : null,
	to: to ? moment(to, 'YYYY-MM-DD').toISOString() : null
});

class TransactionsView extends Component {
	state = {
		pageIndex: 0,
		key: 0
	}

	static getDerivedStateFromProps(props) {
		const { location } = props;
		const { p: pageIndex, ...filter } = urlSearchToObj(location.search);

		return {
			pageIndex: parseInt(pageIndex, 10) || 0,
			filter: parseFilter(filter)
		};
	}

	componentDidUpdate(prevProps, prevState) {
		const { filter, key } = this.state;

		if(!isEqual(filter, prevState.filter))
			this.setState({ key: key + 1 });
	}

	handleFilterSubmit = values => {
		const { location, history } = this.props;

		const filter = formatFilter(values);

		history.replace({
			...location,
			search: objToUrlSearch(filter)
		});
	}

	handlePageChange = pageIndex => {
		const { location, history } = this.props;

		history.replace({
			...location,
			search: mergeUrlSearch(location.search, { p: pageIndex })
		});
	}

	handleRangeChange = ({ startIndex, endIndex }) => {
		const { loadInvoices, dealers, role } = this.props;
		let { filter } = this.state;

		filter = {
			...filter,
			dealer: selectedDealers(filter.dealer, dealers, role),
			paypalSaleId: filter.invoiceNo
		};

		loadInvoices({
			startIndex,
			count: (endIndex - startIndex) + 1,
			filter
		}, {
			cancelPrevious: true
		});
	}

	renderResult = ({ startIndex, endIndex }) => {
		const { invoices: { all }, location } = this.props;

		if(all) {
			const items = all.slice(startIndex, endIndex).filter(i => !!i);

			return (
				<Localized names={['Common', 'Employer', 'Admin']}>
					{({
						DateLabel,
						DealerLabel,
						AmountLabel,
						InvoiceLabel,
						NoTransactionsFoundLabel
					}) => (
						<table>
							<thead>
								<tr>
									<th>{DateLabel}</th>
									<th>{DealerLabel}</th>
									<th>{AmountLabel}</th>
									<th className="min-width">{InvoiceLabel}</th>
								</tr>
							</thead>
							<tbody>
								{items.map(({ date, dealerName, price, invoiceId, paypalSaleId }, i) => (
									<tr key={i}>
										<td>{formatShortDate(date)}</td>
										<td>{dealerName}</td>
										<td>{price}</td>
										<td className="min-width">
											{invoiceId && paypalSaleId && (
												<PrimaryLink 
													className="credits-view-link" 
													as={LocaleLink}
													to={getNextLink(`/admin/credits/invoice/${invoiceId}`, location)}
													hasIcon
													iconClassName="icon icon-doc-text-inv">

													{paypalSaleId}
												</PrimaryLink>
											)}
										</td>
									</tr>
								))}

								{items.length === 0 && (
									<tr>
										<td colSpan={4}>
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

	render() {
		const { invoices: { loading, all } } = this.props;
		const { pageIndex, key, filter } = this.state;

		return (
			<Localized names={['Common', 'Employer', 'Admin']}>
				{({
					TransactionsTitle
				}) => (
					<div className="transactions-view">
						<ContentMetaTags title={TransactionsTitle} />

						<HeaderStrip>
							<HeaderStripContentLarge>
								<HeaderStripContent.Back to="/admin" />

								<h1>{TransactionsTitle}</h1>
							</HeaderStripContentLarge>
						</HeaderStrip>

						<ContentBlock>
							<TransactionsFilterForm initialValues={filter} onSubmit={this.handleFilterSubmit} />
						</ContentBlock>

						<ContentBlock>
							<PagedList
								key={`transactions-list-${key}`}
								pageIndex={pageIndex}
								onChange={this.handlePageChange}
								onRangeChange={this.handleRangeChange}
								loading={loading}
								totalCount={all ? all.length : 0}>

								{this.renderResult}
							</PagedList>
						</ContentBlock>
					</div>
				)}
			</Localized>
		);
	}
}

TransactionsView.propTypes = {
	invoices: PropTypes.object.isRequired,
	loadInvoices: PropTypes.func.isRequired,
	location: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	dealers: PropTypes.array.isRequired,
	role: PropTypes.any.isRequired
};

const mapStateToProps = state => ({
	invoices: state.admin.invoices,
	dealers: authDealers(state),
	role: authRole(state)
});
 
export default withLocaleRouter(connect(mapStateToProps, { loadInvoices })(TransactionsView));