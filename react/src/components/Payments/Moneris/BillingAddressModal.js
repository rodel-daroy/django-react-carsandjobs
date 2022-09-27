import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modals/Modal';
import ResponsiveModalFrame from 'components/Modals/ResponsiveModalFrame';
import BillingAddressForm from './BillingAddressForm';
import './BillingAddressModal.css';

const BillingAddressModal = ({ isOpen, onCancel, onSubmit }) => ( 
	<Modal className="billing-address-modal" isOpen={isOpen} onRequestClose={onCancel}>
		<ResponsiveModalFrame 
			className="billing-address-modal-frame" 
			title={<h2>Enter billing address</h2>} 
			onRequestClose={onCancel}>

			<BillingAddressForm onSubmit={onSubmit} />
		</ResponsiveModalFrame>
	</Modal>
);

BillingAddressModal.propTypes = {
	isOpen: PropTypes.bool,
	onCancel: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired
};
 
export default BillingAddressModal;