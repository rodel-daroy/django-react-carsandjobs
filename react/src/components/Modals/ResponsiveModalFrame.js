import React from 'react';
import PropTypes from 'prop-types';
import HeaderStrip from 'components/Layout/HeaderStrip';
import HeaderStripContent from 'components/Layout/HeaderStripContent';
import RadialButton from 'components/Buttons/RadialButton';
import './ResponsiveModalFrame.css';

const ResponsiveModalFrame = ({ mobile, children, className, title, onRequestClose, ...otherProps }) => {
	const renderMobile = () => (
		<React.Fragment>
			<HeaderStrip>
				<HeaderStripContent>
					<HeaderStripContent.Back as="button" onClick={onRequestClose} />

					{typeof title === 'string' && <h1>{title}</h1>}
					{typeof title !== 'string' && <span>{title}</span>}
				</HeaderStripContent>
			</HeaderStrip>

			<div className="responsive-modal-frame-content">
				{children}
			</div>
		</React.Fragment>
	);

	const renderOther = () => (
		<React.Fragment>
			<div className="responsive-modal-frame-header">
				{title && (
					<div className="responsive-modal-frame-title">
						{typeof title === 'string' ? <h1>{title}</h1> : title}
					</div>
				)}

				<RadialButton className="responsive-modal-frame-close" size="large" onClick={onRequestClose}>
					<span className="icon icon-cancel"></span>
				</RadialButton>
			</div>

			<div className="responsive-modal-frame-content">
				{children}
			</div>
		</React.Fragment>
	);

	return (
		<div {...otherProps} className={`responsive-modal-frame ${mobile ? 'mobile' : ''} ${className || ''}`}>
			{mobile ? renderMobile() : renderOther()}
		</div>
	);
};

ResponsiveModalFrame.propTypes = {
	mobile: PropTypes.bool,
	children: PropTypes.node,
	className: PropTypes.string,
	title: PropTypes.node,
	onRequestClose: PropTypes.func.isRequired
};
 
export default ResponsiveModalFrame;