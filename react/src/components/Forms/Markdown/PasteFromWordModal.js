import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modals/Modal';
import TextAreaField from 'components/Forms/TextAreaField';
import { htmlToMarkdown } from 'utils/format';
import ResponsiveModalFrame from 'components/Modals/ResponsiveModalFrame';
import Localized from 'components/Localization/Localized';
import './PasteFromWordModal.css';

class PasteFromWordModal extends Component {
	handlePaste = e => {
		const { onSubmit } = this.props;

		e.stopPropagation();
		e.preventDefault();

		const tryGetData = type => {
			try {
				return e.clipboardData.getData(type);
			}
			catch(error) {
				return null;
			}
		};

		// text/html doesn't work in IE 11
		const html = tryGetData('text/html');
		const plainText = tryGetData('text/plain') || tryGetData('text');

		const markdown = html ? htmlToMarkdown(html) : plainText;

		/* console.log('html', html);
		console.log('text', e.clipboardData.getData('text/plain'));
		console.log('markdown', markdown); */

		onSubmit(markdown);
	}

	render() { 
		const { isOpen, onClose } = this.props;

		return (
			<Localized names="Common">
				{({ 
					PasteFromWordTitle = 'Paste from Word', 
					PasteFromWordPlaceholder = 'Paste your text here'
				}) => (
					<Modal isOpen={isOpen} onRequestClose={onClose} className="paste-from-word">
						<ResponsiveModalFrame 
							title={<h2>{PasteFromWordTitle}</h2>}
							onRequestClose={onClose}>

							<TextAreaField 
								className="paste-from-word-field"
								onPaste={this.handlePaste}
								placeholder={PasteFromWordPlaceholder}
								autoFocus />
						</ResponsiveModalFrame>
					</Modal>
				)}
			</Localized>
		);
	}
}

PasteFromWordModal.propTypes = {
	isOpen: PropTypes.bool,
	onSubmit: PropTypes.func.isRequired,
	onClose: PropTypes.func.isRequired
};
 
export default PasteFromWordModal;