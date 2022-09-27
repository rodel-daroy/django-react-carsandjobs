import React from 'react';
import PropTypes from 'prop-types';
import './FormSection.css';

const FormSection = ({ children, className, title, first, last, nested, ...props }) => (
	<section {...props} className={`form-section ${first ? 'first' : ''} ${last ? 'last' : ''} ${nested ? 'nested' : ''} ${className || ''}`}>
		{title && (
			<header className="form-section-header">
				{title}
			</header>
		)}

		<div className="form-section-body">
			{children}
		</div>
	</section>
);

FormSection.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	title: PropTypes.node,
	first: PropTypes.bool,
	last: PropTypes.bool,
	nested: PropTypes.bool
};

export default FormSection;