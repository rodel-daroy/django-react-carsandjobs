import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HeaderStrip from 'components/Layout/HeaderStrip';
import HeaderStripContentLarge from 'components/Layout/HeaderStripContentLarge';
import HeaderStripContent from 'components/Layout/HeaderStripContent';
import { connect } from 'react-redux';
import { showModal } from 'redux/actions/modals';
import { applyCredits } from 'redux/actions/employer';
import CreditSelector from './CreditSelector';
import FormSection from 'components/Forms/FormSection';
import errorBoundary from 'components/Decorators/errorBoundary';
import ContentMetaTags from 'components/Content/ContentMetaTags';
import requireRole from 'components/Decorators/requireRole';
import Big from 'big.js';
import { authDealers, DEALER_ROLES } from 'redux/selectors';
import Localized from 'components/Localization/Localized';
import DealerField from '../DealerField';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import { urlSearchToObj } from 'utils/url';
import { parseMarkdown } from 'utils/format';
import LocalizedNode from 'components/Localization/LocalizedNode';
import { passiveModal } from 'components/Modals/helpers';
import { getPrevLink } from 'utils/router';
import Payment from 'components/Payments';
import { setGlobalOverlay } from 'redux/actions/layout';
import './BuyCreditsView.css';

class BuyCreditsView extends Component {
	constructor(props) {
		super(props);

		const { dealers, location: { search } } = props;

		const searchObj = urlSearchToObj(search);

		let dealer = dealers.find(d => d.id === searchObj.dealer);
		if(!dealer)
			dealer = dealers[0];

		this.state = {
			dealer: dealer ? dealer.id : null,
			dealerName: dealer ? dealer.name : null
		};
	}

	componentDidUpdate(prevProps) {
		const { applyCreditsResult: { loading, result, error }, showModal, location, setGlobalOverlay } = this.props;
		const { applyCreditsResult: { loading: prevLoading } } = prevProps;

		if(prevLoading && !loading) {
			setGlobalOverlay(null);

			this.setState({ formDisabled: false });
			
			if(result && !error) {
				const { quantityPurchased } = this.state;

				showModal(passiveModal({
					title: <LocalizedNode names="Employer" groupKey="CreditsAddedTitle" as="h2" />,
					content: () => (
						<Localized names="Employer">
							{({ CreditsAddedMessage }) => (
								<div dangerouslySetInnerHTML={{ 
									__html: parseMarkdown((CreditsAddedMessage || '').replace('[credits]', quantityPurchased)) 
								}}>
								</div>
							)}
						</Localized>
					),
					redirectTo: getPrevLink(location, '/employer/credits')
				}));
			}
		}
	}

	handleSuccess = payload => {
		const { applyCredits, setGlobalOverlay } = this.props;

		const transformError = error => {
			try {
				const email = 'nicolem@tada.ca';
		
				const { saleId, dealer, creditId, paymentGateway } = sale;
		
				const payloadString = JSON.stringify({ saleId, dealer, creditId, paymentGateway }, null, 2);
				const body = encodeURIComponent(payloadString);
				const emailLink = 
					`mailto:${email}?subject=${encodeURIComponent('Credit transaction error')}&body=${body}`;
		
				const message = 
				'An error has occurred with this transaction.\n\n' +
				'**Please contact TADA for assistance with credits.**\n\n' +
				`**Contact:** Nicole M - [${email}](${emailLink}) or by phone 905 940 2857.\n\n` +
				`[Please click here to open your email client and send us the transaction directly](${emailLink})`;
		
				return new Error(message);
			}
			catch(e) {
				return error;
			}
		};

		const { quantityPurchased, ...sale } = payload;

		this.setState({ quantityPurchased });

		setGlobalOverlay(
			<Localized names={['Common', 'Employer']}>
				{({
					CompletingPurchaseMessage
				}) => (
					<div 
						className="buy-credits-view-overlay"
						dangerouslySetInnerHTML={{ __html: parseMarkdown(CompletingPurchaseMessage) }}></div>
				)}
			</Localized>
		);
		applyCredits(sale, { transformError });
	}

	handleFailure = () => {
		const { showModal } = this.props;

		this.setState({ formDisabled: false });

		showModal({
			title: <LocalizedNode names="Employer" groupKey="PaymentFailedTitle" as="h2" />,
			content: () => null
		});
	}

	handleCreditChange = credits => {
		this.setState({
			credits
		});
	}

	handleDealerChange = (dealer, { name }) => {
		this.setState({
			dealer,
			dealerName: name
		});
	}

	handleCheckOutClick = () => {
		this.setState({
			formDisabled: true
		});
	}

	render() {
		const { credits, dealer, formDisabled, dealerName } = this.state;
		const { location } = this.props;

		let paymentData;
		if(credits && dealer)
			paymentData = {
				creditId: credits.id,
				dealer,
				quantityPurchased: credits.quantity
			};

		return (
			<Localized names={['Common', 'Jobs', 'Employer']}>
				{({ 
					DealerLabel, 
					BuyCreditsTitle, 
					QuantityLabel, 
					PriceLabel, 
					TaxLabel, 
					TotalLabel, 
					CreditsCountLabel,
					CompletePurchaseMessage
				}) => (
					<div className="buy-credits-view">
						<ContentMetaTags title={BuyCreditsTitle} />

						<HeaderStrip>
							<HeaderStripContentLarge>
								<HeaderStripContent.Back to={getPrevLink(location, '/employer/credits')} />

								<h1>{BuyCreditsTitle}</h1>
							</HeaderStripContentLarge>
						</HeaderStrip>

						<Payment.Receiver 
							onSuccess={this.handleSuccess}
							onError={this.handleFailure} />

						<div className="buy-credits-view-content">
							<FormSection first last>
								<DealerField
									label={DealerLabel} 
									onChange={this.handleDealerChange}
									value={dealer}
									showBalance
									linkToCredits={false}
									disabled={formDisabled} />

								{dealer && (
									<CreditSelector onChange={this.handleCreditChange} disabled={formDisabled} />
								)}

								{credits && (
									<React.Fragment>
										<table className="buy-credits-view-summary">
											<tbody>
												<tr>
													<th>{QuantityLabel}</th>
													<td>{(CreditsCountLabel || '').replace('[credits]', credits.quantity)}</td>
												</tr>
												<tr>
													<th>{PriceLabel}</th>
													<td>{Big(credits.price).toFixed(2)}</td>
												</tr>
												<tr>
													<th>{TaxLabel}</th>
													<td>{Big(credits.tax).toFixed(2)}</td>
												</tr>
												<tr>
													<th>{TotalLabel}</th>
													<td>{Big(credits.total).toFixed(2)}</td>
												</tr>
											</tbody>
										</table>

										<div dangerouslySetInnerHTML={{ __html: parseMarkdown(CompletePurchaseMessage) }}>
										</div>

										<Payment.Button
											companyName={dealerName}
											description={(CreditsCountLabel || '').replace('[credits]', credits.quantity)}
											data={paymentData}
											price={credits}
											onError={this.handleFailure}
											onCancel={this.handleFailure}
											onClick={this.handleCheckOutClick}
											disabled={formDisabled} />
									</React.Fragment>
								)}
							</FormSection>
						</div>
					</div>
				)}
			</Localized>
		);
	}
}

BuyCreditsView.propTypes = {
	showModal: PropTypes.func.isRequired,
	applyCredits: PropTypes.func.isRequired,
	applyCreditsResult: PropTypes.object.isRequired,
	dealers: PropTypes.array.isRequired,
	location: PropTypes.object.isRequired,
	setGlobalOverlay: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	applyCreditsResult: state.employer.applyCredits,
	dealers: authDealers(state)
});
 
export default errorBoundary(withLocaleRouter(connect(mapStateToProps, { showModal, applyCredits, setGlobalOverlay })(requireRole(DEALER_ROLES)(BuyCreditsView))));
