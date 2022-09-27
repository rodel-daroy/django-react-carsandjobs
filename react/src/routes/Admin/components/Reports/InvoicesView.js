import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ViewPanel from 'components/Layout/ViewPanel';
import HeaderStrip from 'components/Layout/HeaderStrip';
import HeaderStripContentLarge from 'components/Layout/HeaderStripContentLarge';
import HeaderStripContent from 'components/Layout/HeaderStripContent';
import ContentBlock from 'components/Layout/ContentBlock';
import PagedList from 'components/Layout/PagedList';
import { connect } from 'react-redux';
import { loadInvoices, exportInvoices } from 'redux/actions/admin';
import { mergeUrlSearch, urlSearchToObj, objToUrlSearch } from 'utils/url';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import { getNextLink } from 'utils/router';
import { formatShortDate, downloadCsv } from 'utils/format';
import LocaleLink from 'components/Localization/LocaleLink';
import EmptyState from 'components/Layout/EmptyState';
import InvoicesFilterForm from './InvoicesFilterForm';
import isEqual from 'lodash/isEqual';
import { authDealers, authRole, localized } from 'redux/selectors';
import { selectedDealers } from './helpers';
import Localized from 'components/Localization/Localized';
import ContentMetaTags from 'components/Content/ContentMetaTags';
import moment from 'moment';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import Big from 'big.js';
import './InvoicesView.css';

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

const exportCsv = (invoices = [], localized, filename = 'invoices') => {
	const data = invoices.map(i => ({
		[localized.DateLabel]: i.date,
		[localized.CompanyNameLabel]: i.dealerName,
		[localized.CompanyAddressLabel]: i.dealerAddress,
		[localized.ProvinceLabel]: i.dealerProvince,
		[localized.AmountLabel]: i.price,
		[localized.TaxLabel]: i.tax,
		[localized.TotalLabel]: i.total,
		[localized.InvoiceNoLabel]: i.paypalSaleId,
		[localized.QuantityLabel]: i.quantity
	}));

	downloadCsv(data, `${filename}.csv`);
};

class InvoicesView extends Component {
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
		const { filter, key, exportData } = this.state;
		const { exported, exportInvoices, adminLocalized, employerLocalized, commonLocalized } = this.props;

		if(!isEqual(filter, prevState.filter))
			this.setState({ key: key + 1 });

		if(exportData && prevState.exportData !== exportData)
			exportInvoices({ filter: this.filter });

		if(exported !== prevProps.exported && !exported.loading && exported.result) {
			const localized = Object.assign({}, commonLocalized, employerLocalized, adminLocalized);
			exportCsv(exported.result.invoices, localized, localized.InvoicesTitle);
		}
	}

	doSubmit(values, exportData) {
		const { location, history } = this.props;

		const filter = formatFilter(values);

		if(exportData)
			this.setState(state => ({
				exportData: (state.exportData || 0) + 1
			}));

		history.replace({
			...location,
			search: objToUrlSearch(filter)
		});
	}

	handleSubmit = values => {
		this.doSubmit(values);
	}

	handleExport = values => {
		this.doSubmit(values, true);
	}

	handlePageChange = pageIndex => {
		const { location, history } = this.props;

		history.replace({
			...location,
			search: mergeUrlSearch(location.search, { p: pageIndex })
		});
	}

	get filter() {
		const { dealers, role } = this.props;
		let { filter } = this.state;

		filter = {
			...filter,
			dealer: selectedDealers(filter.dealer, dealers, role),
			paidOnly: true,
			paypalSaleId: filter.invoiceNo
		};

		return filter;
	}

	handleRangeChange = ({ startIndex, endIndex }) => {
		const { loadInvoices } = this.props;

		loadInvoices({
			startIndex,
			count: (endIndex - startIndex) + 1,
			filter: this.filter
		}, {
			cancelPrevious: true
		});
	}

	renderResults = ({ startIndex, endIndex }) => {
		const { invoices: { all }, location } = this.props;

		if(all) {
			const items = all.slice(startIndex, endIndex).filter(i => !!i);

			const { totalPrice, totalTax, totalTotal, totalQuantity } = items.reduce((prev, cur) => {
				return {
					totalPrice: prev.totalPrice.plus(cur.price),
					totalTax: prev.totalTax.plus(cur.tax),
					totalTotal: prev.totalTotal.plus(cur.total),
					totalQuantity: prev.totalQuantity.plus(cur.quantity)
				};
			}, { totalPrice: Big(0), totalTax: Big(0), totalTotal: Big(0), totalQuantity: Big(0) });

			return (
				<Localized names={['Common', 'Employer', 'Admin']}>
					{({
						InvoiceNoLabel,
						DateLabel,
						CompanyNameLabel,
						CompanyAddressLabel,
						ProvinceLabel,
						AmountLabel,
						TaxLabel,
						TotalLabel,
						NoTransactionsFoundLabel,
						QuantityLabel,
						SubtotalLabel
					}) => (
						<table>
							<thead>
								<tr>
									<th>{DateLabel}</th>
									<th>{CompanyNameLabel}</th>
									<th>{CompanyAddressLabel}</th>
									<th>{ProvinceLabel}</th>
									<th>{AmountLabel}</th>
									<th>{TaxLabel}</th>
									<th>{TotalLabel}</th>
									<th className="min-width">{InvoiceNoLabel}</th>
									<th>{QuantityLabel}</th>
								</tr>
							</thead>
							<tbody>
								{items.map(({ 
									date, 
									dealerName, 
									dealerAddress, 
									dealerProvince, 
									price, 
									tax, 
									total, 
									invoiceId, 
									paypalSaleId, 
									quantity 
								}, i) => (
									<tr key={i}>
										<td>{formatShortDate(date)}</td>
										<td>{dealerName}</td>
										<td>{dealerAddress}</td>
										<td>{dealerProvince}</td>
										<td>{price}</td>
										<td>{tax}</td>
										<td>{total}</td>
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
										<td>{quantity}</td>
									</tr>
								))}

								{items.length === 0 && (
									<tr>
										<td colSpan={6}>
											<EmptyState inline>
												{NoTransactionsFoundLabel}
											</EmptyState>
										</td>
									</tr>
								)}
							</tbody>
							<tfoot>
								<tr>
									<th colSpan={4} className="invoices-view-total">
										{SubtotalLabel}
									</th>
									<td>{totalPrice.toFixed(2)}</td>
									<td>{totalTax.toFixed(2)}</td>
									<td>{totalTotal.toFixed(2)}</td>
									<td className="min-width"></td>
									<td>{totalQuantity.toFixed(0)}</td>
								</tr>
							</tfoot>
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
					InvoicesTitle
				}) => (
					<div className="invoices-view">
						<ContentMetaTags title={InvoicesTitle} />

						<ViewPanel>
							<HeaderStrip>
								<HeaderStripContentLarge>
									<HeaderStripContent.Back to="/admin" />

									<h1>{InvoicesTitle}</h1>
								</HeaderStripContentLarge>
							</HeaderStrip>

							<ContentBlock>
								<InvoicesFilterForm 
									initialValues={filter} 
									onSubmit={this.handleSubmit}
									onExport={this.handleExport} />
							</ContentBlock>

							<ContentBlock>
								<PagedList
									key={`invoices-${key}`}
									totalCount={all ? all.length : 0}
									pageIndex={pageIndex}
									onChange={this.handlePageChange}
									onRangeChange={this.handleRangeChange}
									loading={loading}>

									{this.renderResults}
								</PagedList>
							</ContentBlock>
						</ViewPanel>
					</div>
				)}
			</Localized>
		);
	}
}

InvoicesView.propTypes = {
	loadInvoices: PropTypes.func.isRequired,
	exportInvoices: PropTypes.func.isRequired,
	invoices: PropTypes.object.isRequired,
	exported: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	dealers: PropTypes.array.isRequired,
	role: PropTypes.any.isRequired,
	adminLocalized: PropTypes.object.isRequired,
	commonLocalized: PropTypes.object.isRequired,
	employerLocalized: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	invoices: state.admin.invoices,
	exported: state.admin.exportInvoices,
	dealers: authDealers(state),
	role: authRole(state),
	adminLocalized: localized('Admin')(state),
	commonLocalized: localized('Common')(state),
	employerLocalized: localized('Employer')(state)
});
 
export default withLocaleRouter(connect(mapStateToProps, { loadInvoices, exportInvoices })(InvoicesView));