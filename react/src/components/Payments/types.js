import PropTypes from 'prop-types';

export const PricePropTypes = {
	price: PropTypes.string.isRequired,
	tax: PropTypes.string.isRequired,
	total: PropTypes.string.isRequired
};

export const Price = PropTypes.shape(PricePropTypes);

export const PaymentButtonPropTypes = {
	onClick: PropTypes.func,
	onCancel: PropTypes.func.isRequired,
	onError: PropTypes.func.isRequired,
	price: Price.isRequired,
	data: PropTypes.object,
	description: PropTypes.string,
	companyName: PropTypes.string,
	disabled: PropTypes.bool
};

export const PaymentReceiverPropTypes = {
	onSuccess: PropTypes.func.isRequired,
	onError: PropTypes.func.isRequired
};