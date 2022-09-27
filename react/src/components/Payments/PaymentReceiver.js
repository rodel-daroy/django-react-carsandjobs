import React from 'react';
import PropTypes from 'prop-types';
import componentForOrigin from './componentForOrigin';
import { Route } from 'react-router';
import { RECEIVER_PATH } from './receiver';
import { PaymentReceiverPropTypes } from './types';
import withLocaleRouter from 'components/Localization/withLocaleRouter';

const Receiver = componentForOrigin('Receiver');

const PaymentReceiver = ({ match: { url }, ...otherProps }) => (
	<Route 
		path={url + RECEIVER_PATH}
		render={props => (
			<Receiver {...otherProps} {...props} />
		)} />
);

PaymentReceiver.propTypes = {
	...PaymentReceiverPropTypes,

	match: PropTypes.object.isRequired
};

PaymentReceiver.displayName = 'Payment.Receiver';

export default withLocaleRouter(PaymentReceiver);