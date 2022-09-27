import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import { PaymentButtonPropTypes } from 'components/Payments/types';
import { urlSearchToObj } from 'utils/url';
import Modal from 'components/Modals/Modal';
import EmptyState from 'components/Layout/EmptyState';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import { redirectToSimpleReceiver } from 'components/Payments/receiver';
import usePrevious from 'hooks/usePrevious';
import { fetchHostedPaymentPage, CLIENT } from './helpers';
import useAuthTokenRefresh from 'hooks/useAuthTokenRefresh';
import './AuthorizeNetButton.css';

const AuthorizeNetButton = ({ 
	price, 
	onCancel, 
	onError, 
	onClick, 
	disabled, 
	data, 
	description, 
	companyName,
	location, 
	match, 
	history 
}) => {
	const formRef = useRef();
	const [token, setToken] = useState('');
	const [modalOpen, setModalOpen] = useState(false);
	const [iframeLoading, setIframeLoading] = useState(true);

	const prevModalOpen = usePrevious(modalOpen);
	useEffect(() => {
		if(modalOpen && !prevModalOpen)
			fetchHostedPaymentPage(description, price, companyName).then(setToken);
	}, [modalOpen, prevModalOpen, description, price, companyName]);

	const { refreshToken } = useAuthTokenRefresh();

	useEffect(() => {
		let cancelled = false;

		if(token)
			refreshToken(token => {
				if(!cancelled && token)
					formRef.current.submit();
			});

		return () => {
			cancelled = true;
		};
	}, [token, refreshToken]);

	const closeModal = () => {
		setModalOpen(false);
		setIframeLoading(true);
	};

	useEffect(() => {
		window.AuthorizeNetIFrame = {
			resizeWindow() {
				setIframeLoading(false);
			},

			cancel() {
				closeModal();
				onCancel();
			},

			transactResponse({ response }) {
				response = JSON.parse(response);

				closeModal();

				if(response.responseCode !== '1')
					onError();
				else {
					const payload = {
						...data,
						
						saleId: response.transId,
						paymentGateway: 'authorize',
						result: response,
					};

					redirectToSimpleReceiver(payload, { location, match, history });
				}
			},

			onReceiveCommunication(query) {
				const { action, ...params } = urlSearchToObj(query);
				if(this[action])
					this[action](params);
			}
		};

		return () => {
			window.AuthorizeNetIFrame = null;
		};
	}, [location, match, history, onCancel, data, onError]);

	const handleCheckOutClick = () => {
		if(onClick)
			onClick();
			
		setModalOpen(true);
	};

	return (
		<div className="authorize-net-button">
			<PrimaryButton onClick={handleCheckOutClick} disabled={disabled}>
				Check out
			</PrimaryButton>

			<Modal isOpen={modalOpen} onRequestClose={closeModal}>
				<div className="authorize-net-button-modal">
					{iframeLoading && (
						<EmptyState.Loading className="authorize-net-button-modal-loading" />
					)}

					<form 
						ref={formRef} 
						action={CLIENT.formUrl} 
						method="POST"
						target="AcceptJsIframe">

						<input type="hidden" name="token" value={token} />
					</form>

					<iframe 
						name="AcceptJsIframe" 
						title="AcceptJsIframe"
						allowpaymentrequest="allowpaymentrequest">
					</iframe>
				</div>
			</Modal>
		</div>
	);
};

AuthorizeNetButton.propTypes = {
	...PaymentButtonPropTypes,

	location: PropTypes.object.isRequired,
	match: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired
};
 
export default withLocaleRouter(AuthorizeNetButton);