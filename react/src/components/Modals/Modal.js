import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import ThemeContext from 'components/Common/ThemeContext';
import './Modal.css';

const CLOSE_TIMEOUT = 500;

ReactModal.setAppElement('#root');

class Modal extends Component {
	handleContentClick = () => {
		const { clickToClose, onRequestClose } = this.props;

		if(clickToClose)
			onRequestClose();
	}

	setContentRef = ref => {
		if(this._content)
			this._content.removeEventListener('click', this.handleContentClick);
			
		if(ref) {
			this._content = ref;
			this._content.addEventListener('click', this.handleContentClick);
		}
	}

	render() {
		/* eslint-disable-next-line */
		const { isOpen, children, onRequestClose, className, clickToClose, ...otherProps } = this.props;

		const getClassName = suffix => className ? `${className}${suffix || ''}` : '';

		return (
			<ThemeContext.Consumer>
				{({ dark }) => (
					<ReactModal 
						{...otherProps} 
						isOpen={isOpen} 
						onRequestClose={onRequestClose}
						portalClassName={`modal-portal ${getClassName('-modal-portal')}`}
						overlayClassName={{
							base: `modal-overlay ${getClassName('-modal-overlay')}`,
							afterOpen: '',
							beforeClose: 'closing'
						}}
						className={{
							base: `modal-content ${dark ? 'dark' : 'light'} ${getClassName('-modal-content')}`,
							afterOpen: '',
							beforeClose: 'closing'
						}}
						closeTimeoutMS={CLOSE_TIMEOUT}
						contentRef={this.setContentRef}>

						{children}
					</ReactModal>
				)}
			</ThemeContext.Consumer>
		);
	}
}

Modal.propTypes = {
	isOpen: PropTypes.bool,
	children: PropTypes.node,
	onRequestClose: PropTypes.func.isRequired,
	className: PropTypes.string,
	clickToClose: PropTypes.bool
};

export default Modal;