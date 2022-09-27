import React from 'react';
import Field, { AllFieldPropTypes } from 'components/Forms/Field';
import { makeReduxField } from 'components/Forms/common';
import MarkdownEditor from './MarkdownEditor';
import omit from 'lodash/omit';
import Media from 'react-media';
import TextAreaField from '../TextAreaField';
import { mediaQuery } from 'utils/style';
import './MarkdownField.css';

/* eslint-disable no-unused-vars, react/prop-types */
const MarkdownField = ({ inputComponent, className, ...otherProps }) => {
	const MarkdownComponent = ({ inputClassName, inputComponent, state, labelId, value, ...otherProps }) => (
		/* eslint-enable */
		<MarkdownEditor 
			{...omit(otherProps, Object.keys(AllFieldPropTypes))}
			className={`markdown-field-inner ${inputClassName || ''}`}
			aria-invalid={state === 'error'}
			state={state}
			value={value} />
	);

	return (
		<Media query={mediaQuery('xs')}>
			{mobile => {
				if(mobile) {
					// markdown editor component doesn't work properly on mobile devices, so display text area on mobile

					const handleChange = e => {
						const { onChange } = otherProps;

						if(onChange)
							onChange(e.target.value);
					};

					return (
						<TextAreaField className={className} {...otherProps} onChange={handleChange} />
					);
				}
				else
					return (
						<Field 
							{...otherProps} 
							className={`markdown-field ${className || ''}`}
							inputComponent={MarkdownComponent} />
					);
			}}
		</Media>
	);
};
 
export default MarkdownField;

const ReduxMarkdownField = makeReduxField(MarkdownField);

export { ReduxMarkdownField };