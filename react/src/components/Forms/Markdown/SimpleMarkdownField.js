import React from 'react';
import MarkdownEditor from './SimpleMarkdownEditor';
import Field, { AllFieldPropTypes } from 'components/Forms/Field';
import omit from 'lodash/omit';
import { makeReduxField } from '../common';
import './SimpleMarkdownField.css';

/* eslint-disable no-unused-vars, react/prop-types */
const MarkdownField = ({ className, ...otherProps }) => {
	const MarkdownComponent = ({ id, inputClassName, inputComponent, state, labelId, value, autofilled, ...otherProps }) => (
		/* eslint-enable */
		<MarkdownEditor 
			{...omit(otherProps, Object.keys(AllFieldPropTypes))}
			id={id}
			className={`simple-markdown-field-inner ${inputClassName || ''}`}
			aria-invalid={state === 'error'}
			state={state}
			autofilled={autofilled}
			value={value} />
	);

	return (
		<Field 
			{...otherProps} 
			className={`simple-markdown-field ${className || ''}`}
			inputComponent={MarkdownComponent} />
	);
};
 
export default MarkdownField;

const ReduxMarkdownField = makeReduxField(MarkdownField);
export { ReduxMarkdownField };