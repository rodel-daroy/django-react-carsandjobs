import React from 'react';
import PropTypes from 'prop-types';
import { makeReduxField } from './common';
import Field, { AllFieldPropTypes } from './Field';
import omit from 'lodash/omit';
import './TextAreaField.css';

/* eslint-disable no-unused-vars, react/prop-types */
const TextAreaField = ({ inputComponent, className, prefix, suffix, size, ...otherProps }) => {
	const TextArea = ({ inputClassName, inputComponent, state, labelId, value, id, ...otherProps }) => (
		/* eslint-enable */
		<textarea 
			{...omit(otherProps, Object.keys(AllFieldPropTypes))}

			id={id}
			className={`form-control textarea-field-inner ${inputClassName || ''}`}
			aria-invalid={state === 'error'}
			value={value} />
	);

	return (
		<Field 
			{...otherProps} 
			className={`textarea-field ${className || ''}`}
			inputComponent={TextArea} />
	);
};

TextAreaField.propTypes = {
	prefix: PropTypes.node,
	suffix: PropTypes.node,
	size: PropTypes.oneOf(['short']),

	...omit(Field.propTypes || {}, ['inputComponent'])
};

export default TextAreaField;

const ReduxTextAreaField = makeReduxField(TextAreaField);

export { ReduxTextAreaField };