import React from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import { makeReduxField } from './common';
import Field, { AllFieldPropTypes } from './Field';
import './TextField.css';

/* eslint-disable no-unused-vars */
const TextField = ({ inputComponent, className, prefix, suffix, ...otherProps }) => {
	const input = ({ id, type, inputClassName, placeholder, inputComponent, labelId, state, value, ...otherProps }) => {
		/* eslint-enable */
		const control = () => (
			<input
				{...omit(otherProps, Object.keys(TextFieldPropTypes))}

				id={id}
				type={type}
				className={`form-control text-field-inner ${inputClassName || ''}`}
				placeholder={placeholder}
				aria-invalid={state === 'error'}
				value={value}
			/>
		);

		if(!prefix && !suffix)
			return control();
		else
			return (
				<div className="input-group text-field-inner">
					{prefix && <div className="input-group-addon">{prefix}</div>}

					{control()}

					{suffix && <div className="input-group-addon">{suffix}</div>}
				</div>
			);
	};

	return (
		<Field {...otherProps} className={`text-field ${className || ''}`} inputComponent={input} />
	);
};

export const TextFieldPropTypes = {
	prefix: PropTypes.node,
	suffix: PropTypes.node,

	...omit(AllFieldPropTypes, ['inputComponent'])
};

TextField.propTypes = {
	...TextFieldPropTypes
};

export default TextField;

const ReduxTextField = makeReduxField(TextField);

export { ReduxTextField };
