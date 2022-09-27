import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { showModal } from 'redux/actions/modals';
import { applyPromoCode } from 'redux/actions/employer';
import PromoCodeForm from './PromoCodeForm';
import Modal from 'components/Modals/Modal';
import ResponsiveModalFrame from 'components/Modals/ResponsiveModalFrame';
import LoadingOverlay from 'components/Common/LoadingOverlay';
import Localized from 'components/Localization/Localized';
import LocalizedNode from 'components/Localization/LocalizedNode';
import { parseMarkdown } from 'utils/format';
import { passiveModal } from 'components/Modals/helpers';
import { localized } from 'redux/selectors';

class ApplyPromoCode extends Component {
	state = {
		isOpen: false
	}

	componentDidUpdate(prevProps) {
		const { promoCode: { result, loading, error }, showModal, onCreditsApplied } = this.props;

		if(!loading && prevProps.promoCode.loading && result && !error) {
			this.setState({ isOpen: false });

			if(onCreditsApplied)
				onCreditsApplied();

			showModal(passiveModal({
				title: <LocalizedNode names="Employer" groupKey="CreditsAddedTitle" as="h2" />,
				content: () => (
					<Localized names="Employer">
						{({ CreditsAddedMessage }) => (
							<div dangerouslySetInnerHTML={{ 
								__html: parseMarkdown((CreditsAddedMessage || '').replace('[credits]', result.creditsApplied))
							}}>
							</div>
						)}
					</Localized>
				)
			}));
		}
	}

	handleSubmit = ({ promoCode }) => {
		const { applyPromoCode, dealer, localized: { NoPromoCodeMessage } } = this.props;

		const transformError = error => {
			if(error.status === 400)
				return new Error(NoPromoCodeMessage);

			return error;
		};

		applyPromoCode({
			promoCode,
			dealer
		}, { transformError });
	}

	handleClose = () => {
		this.setState({ isOpen: false });
	}

	handleClick = () => {
		this.setState({ isOpen: true });
	}

	render() {
		const { children, promoCode: { loading } } = this.props;
		const { isOpen } = this.state;

		return (
			<Localized names="Employer">
				{({ ApplyPromoCodeTitle }) => (
					<React.Fragment>
						{children({
							onClick: this.handleClick
						})}

						<Modal isOpen={isOpen} onRequestClose={this.handleClose}>
							<ResponsiveModalFrame title={<h2>{ApplyPromoCodeTitle}</h2>} onRequestClose={this.handleClose}>
								<PromoCodeForm onSubmit={this.handleSubmit} onCancel={this.handleClose} loading={loading} />

								{loading && <LoadingOverlay />}
							</ResponsiveModalFrame>
						</Modal>
					</React.Fragment>
				)}
			</Localized>
		);
	}
}

ApplyPromoCode.propTypes = {
	dealer: PropTypes.any.isRequired,
	children: PropTypes.func.isRequired,
	onCreditsApplied: PropTypes.func,

	showModal: PropTypes.func.isRequired,
	applyPromoCode: PropTypes.func.isRequired,
	promoCode: PropTypes.object.isRequired,
	localized: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	promoCode: state.employer.promoCode,
	localized: localized('Employer')(state)
});
 
export default connect(mapStateToProps, { showModal, applyPromoCode })(ApplyPromoCode);