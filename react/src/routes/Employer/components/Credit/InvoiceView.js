import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import { connect } from 'react-redux';
import { loadInvoice } from 'redux/actions/employer';
import ViewPanel from 'components/Layout/ViewPanel';
import HeaderStrip from 'components/Layout/HeaderStrip';
import HeaderStripContentLarge from 'components/Layout/HeaderStripContentLarge';
import HeaderStripContent from 'components/Layout/HeaderStripContent';
import EmptyState from 'components/Layout/EmptyState';
import { formatShortDate, parseMarkdown } from 'utils/format';
import Localized from 'components/Localization/Localized';
import ContentMetaTags from 'components/Content/ContentMetaTags';
import { getPrevLink } from 'utils/router';
import SiteLogo from 'layout/components/SiteLogo';
import { authOrigin } from 'redux/selectors';
import { CONTACT_ADDRESS } from 'config/constants';
import './InvoiceView.css';

class InvoiceView extends Component {
	state = {}

	static getDerivedStateFromProps(props) {
		const { match: { params: { id } } } = props;

		return {
			invoiceId: id
		};
	}

	componentDidMount() {
		const { invoiceId } = this.state;
		const { loadInvoice } = this.props;

		if(invoiceId)
			loadInvoice({ id: invoiceId });
	}

	componentDidUpdate(prevProps, prevState) {
		const { loadInvoice } = this.props;
		const { invoiceId } = this.state;

		if(prevState.invoiceId !== invoiceId)
			loadInvoice({ id: invoiceId });
	}

	renderInvoice() {
		const { invoice: { loading, result }, origin } = this.props;

		if(!loading && result) {
			const contactAddress = parseMarkdown(CONTACT_ADDRESS[origin]);

			return (
				<Localized names={['Common', 'Jobs', 'Employer']}>
					{({ 
						InvoiceLabel, 
						QuantityLabel, 
						DescriptionLabel, 
						UnitPriceLabel, 
						TotalLabel,
						SubtotalLabel,
						TaxLabel,
						BilledToLabel
					}) => (
						<div className="invoice-view-inner">
							<div className="invoice-view-header">
								<div className="invoice-view-header-left">
									<SiteLogo className="invoice-view-logo" />

									<div dangerouslySetInnerHTML={{ __html: contactAddress }}></div>
								</div>
								
								<div className="invoice-view-header-right">
									<h2>{InvoiceLabel} # <span className="invoice-view-number">{result.paypalSaleId}</span></h2>
									<h3>{formatShortDate(result.date)}</h3>
								</div>
							</div>
							
							<table className="invoice-view-address">
								<thead>
									<tr>
										<th>
											{BilledToLabel}
										</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>
											<strong>{result.dealerName}</strong><br />
											{result.dealerAddress}
										</td>
									</tr>
								</tbody>
							</table>

							<table className="invoice-view-table">
								<thead>
									<tr>
										<th>{QuantityLabel}</th>
										<th>{DescriptionLabel}</th>
										<th>{UnitPriceLabel}</th>
										<th>{TotalLabel}</th>
									</tr>
								</thead>

								<tbody>
									<tr>
										<td>{result.quantity}</td>
										<td>{result.item}</td>
										<td>{result.unitCost}</td>
										<td>{result.price}</td>
									</tr>

									<tr className="invoice-view-total-row">
										<td colSpan="3">
											{SubtotalLabel}
										</td>
										<td>
											{result.price}
										</td>
									</tr>

									<tr className="invoice-view-total-row">
										<td colSpan="3">
											{TaxLabel}
										</td>
										<td>
											{result.tax}
										</td>
									</tr>

									<tr className="invoice-view-total-row">
										<td colSpan="3">
											{TotalLabel}
										</td>
										<td>
											{result.total}
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					)}
				</Localized>
			);
		}

		if(loading)
			return <EmptyState.Loading />;
		else
			return null;
	}

	render() {
		const { location } = this.props;
		
		return (
			<Localized names="Employer">
				{({ InvoiceTitle }) => (
					<ViewPanel className="invoice-view">
						<ContentMetaTags title={InvoiceTitle} />

						<HeaderStrip className="invoice-view-header-strip">
							<HeaderStripContentLarge>
								<HeaderStripContent.Back to={getPrevLink(location, '/employer/credits')} />

								<h1>{InvoiceTitle}</h1>
							</HeaderStripContentLarge>
						</HeaderStrip>

						{this.renderInvoice()}
					</ViewPanel>
				)}
			</Localized>
		);
	}
}

InvoiceView.propTypes = {
	location: PropTypes.object.isRequired,
	match: PropTypes.object.isRequired,
	invoice: PropTypes.object.isRequired,
	loadInvoice: PropTypes.func.isRequired,
	origin: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
	invoice: state.employer.invoice,
	origin: authOrigin(state)
});
 
export default withLocaleRouter(connect(mapStateToProps, { loadInvoice })(InvoiceView));