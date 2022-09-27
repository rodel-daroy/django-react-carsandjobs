import React, { useState, useRef, useEffect } from 'react';
import { PaymentButtonPropTypes } from 'components/Payments/types';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import { MONERIS_CLIENT } from 'config/constants';
import Config from 'config';
import BillingAddressModal from './BillingAddressModal';
import useAuthTokenRefresh from 'hooks/useAuthTokenRefresh';
import './MonerisButton.css';

const MonerisButton = ({ price: { total }, data, onCancel, onClick, disabled }) => {
	const { url, ps_store_id, hpp_key } = MONERIS_CLIENT[Config.MONERIS_ENV];

	const formRef = useRef();
	const [billingAddressOpen, setBillingAddressOpen] = useState(false);
	const [billingAddress, setBillingAddress] = useState();

	const handleCancelBillingAddress = () => {
		setBillingAddressOpen(false);
		onCancel();
	};

	const handleSubmitBillingAddress = address => {
		setBillingAddressOpen(false);
		setBillingAddress(address);
	};

	const { refreshToken } = useAuthTokenRefresh();
	
	useEffect(() => {
		let cancelled = false;

		if(billingAddress)
			refreshToken(token => {
				if(!cancelled && token)
					formRef.current.submit();
			});

		return () => {
			cancelled = true;
		};
	}, [billingAddress, refreshToken]);

	const handleCheckOutClick = () => {
		if(onClick)
			onClick();

		setBillingAddressOpen(true);
	};

	return (
		<div className="moneris-button">
			<form ref={formRef} method="POST" action={url}>
				<input type="hidden" name="ps_store_id" value={ps_store_id} />
				<input type="hidden" name="hpp_key" value={hpp_key} />
				<input type="hidden" name="charge_total" value={total} />

				{Object.keys(billingAddress || {}).map(name => (
					<input key={`billing-${name}`} type="hidden" name={name} value={billingAddress[name]} />
				))}

				{/* pass data as rvar_ form values */}
				{Object.keys(data || {}).map(name => {
					const value = data[name];
					if(typeof value === 'string' || typeof value === 'number')
						return (
							<input key={name} type="hidden" name={`rvar_${name}`} value={data[name]} />
						);

					return null;
				})}
			</form>

			<PrimaryButton onClick={handleCheckOutClick} disabled={disabled}>
				Check out
			</PrimaryButton>

			<BillingAddressModal 
				isOpen={billingAddressOpen} 
				onCancel={handleCancelBillingAddress} 
				onSubmit={handleSubmitBillingAddress} />
		</div>
	);
};

MonerisButton.propTypes = {
	...PaymentButtonPropTypes
};
 
export default MonerisButton;