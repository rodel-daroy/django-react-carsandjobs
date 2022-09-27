import { DEALER_ORIGIN, TADA_ORIGIN } from 'redux/selectors';
import AuthorizeNet from './AuthorizeNet';
//import PayPal from './PayPal';
import Moneris from './Moneris';

export default {
	[DEALER_ORIGIN]: Moneris /* PayPal */,
	[TADA_ORIGIN]: AuthorizeNet
};