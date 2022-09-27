import componentForOrigin from './componentForOrigin';
import { PaymentButtonPropTypes } from './types';

const PaymentButton = componentForOrigin('Button');

PaymentButton.propTypes = {
	...PaymentButtonPropTypes
};

PaymentButton.displayName = 'Payment.Button';

export default PaymentButton;