import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Modal from 'components/Modals/Modal';
import ResponsiveModalFrame from 'components/Modals/ResponsiveModalFrame';
import withLocaleRouter from 'components/Localization/withLocaleRouter';

class ModalContainer extends Component {
	state = {}

	componentDidUpdate(prevProps) {
		const { modal } = this.props;

		if(modal && modal !== prevProps.modal) {
			this.setState({
				modal,
				isOpen: true
			});
		}
	}

	handleRequestClose = modal => (redirect = true) => {
		if(modal === this.state.modal) {
			this.setState({
				isOpen: false
			});

			if(modal.onClose)
				modal.onClose();

			if(redirect && modal.redirectTo)
				this.props.history.push(modal.redirectTo);
		}
	}

	renderContent() {
		const { modal } = this.state;

		if(typeof modal.content === 'function') {
			const parameters = {
				close: this.handleRequestClose(modal)
			};

			return modal.content(parameters);
		}
		else
			return modal.content;
	}

	render() { 
		const { modal, isOpen } = this.state;

		if(modal)
			return (
				<Modal 
					isOpen={isOpen} 
					onRequestClose={this.handleRequestClose(modal)} 
					className={modal.className} 
					clickToClose={modal.clickToClose}>
					
					<ResponsiveModalFrame title={modal.title} onRequestClose={this.handleRequestClose(modal)}>
						{this.renderContent()}
					</ResponsiveModalFrame>
				</Modal>
			);
		else
			return null;
	}
}

ModalContainer.propTypes = {
	modal: PropTypes.object,
	history: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	modal: state.modals.modal
});
 
export default withLocaleRouter(connect(mapStateToProps)(ModalContainer));