import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import paypal from 'paypal-checkout';
import Config from 'config';
import { PAYPAL_CLIENT } from 'config/constants';
import { PaymentButtonPropTypes } from 'components/Payments/types';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import { redirectToSimpleReceiver } from 'components/Payments/receiver';
import './PayPalButton.css';

const PPButton = paypal.Button.driver('react', { React, ReactDOM });

const PayPalButton = ({ 
	size, 
	onCancel, 
	onError, 
	price: { price, tax, total }, 
	data: userData, 
	location,
	match,
	history
}) => {
	const payment = (data, actions) => {
		return actions.payment.create({
			transactions: [
				{
					amount: {
						total,
						currency: 'CAD',
						details: {
							subtotal: price,
							tax
						}
					}
				}
			]
		});
	};

	const handleAuthorize = (data, actions) => {
		return actions.payment.execute()
			.then(result => {
				const saleId = result.transactions[0].related_resources[0].sale.id;

				const payload = {
					...userData,
					
					saleId, 
					paymentGateway: 'paypal',
					result
				};
				redirectToSimpleReceiver(payload, { location, match, history });
			});
	};

	return (
		<span className="paypal-button">
			<PPButton
				env={Config.PAYPAL_ENV}
				client={PAYPAL_CLIENT}
				payment={payment}
				onAuthorize={handleAuthorize}
				onCancel={onCancel}
				onError={onError}
				style={{
					size,
					shape: 'rect'
				}} />
		</span>
	);
};

PayPalButton.propTypes = {
	...PaymentButtonPropTypes,

	size: PropTypes.oneOf(['tiny', 'small', 'medium']),

	location: PropTypes.object.isRequired,
	match: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired
};

PayPalButton.defaultProps = {
	size: 'medium'
};
 
export default withLocaleRouter(PayPalButton);