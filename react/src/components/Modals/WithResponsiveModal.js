import React from 'react';
import PropTypes from 'prop-types';
import Media from 'react-media';
import { mediaQuery } from 'utils/style';
import Modal from 'components/Modals/Modal';

const WithResponsiveModal = ({ isOpen, modalContent, children, ...otherProps }) => {
	// please note, the ordering and structure of the returns of these render functions should be as similar as possible,
	// to avoid unnecessary remounting of child components

	const renderMobile = () => (
		<React.Fragment>
			{(() => {
				if(isOpen)
					return modalContent({ mobile: true, isOpen, ...otherProps });
				else
					return children();
			})()}
		</React.Fragment>
	);

	const renderOther = () => (
		<React.Fragment>
			{children()}

			<Modal {...otherProps} isOpen={isOpen} className="with-responsive-modal">
				{modalContent({ mobile: false, isOpen, ...otherProps })}
			</Modal>
		</React.Fragment>
	);

	return (
		<Media query={mediaQuery('xs')}>
			{mobile => mobile ? renderMobile() : renderOther()}
		</Media>
	);
};

WithResponsiveModal.propTypes = {
	isOpen: PropTypes.bool,
	modalContent: PropTypes.func,
	children: PropTypes.func
};
 
export default WithResponsiveModal;