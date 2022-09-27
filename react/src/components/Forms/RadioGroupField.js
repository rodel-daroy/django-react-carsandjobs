import React from 'react';
import PropTypes from 'prop-types';
import Field from 'components/Forms/Field';
import { makeReduxField } from './common';
import './RadioGroupField.css';

const RadioGroupFieldInner = ({ options, onChange, onBlur, onFocus, value, labelId }) => {
	const inputValue = value;

	const checkboxes = options.map(({ label, value }, index) => {
		const handleChange = () => {
			if(onBlur)
				onBlur(value);
			if(onChange)
				return onChange(value);
		};
		//const checked = (inputValue || '').includes(value);
		return (
			<div className={`radio-group-field-item ${value === inputValue ? 'active' : ''}`} onClick={handleChange} key={`radio-${index}`}>
				<input type="radio" onChange={handleChange} value={value} checked={value === inputValue} onFocus={onFocus} aria-label={label} />
				<div className="radio-group-field-item-label">{label}</div>
			</div>
		);
	});

	return (
		<div className="radio-group-field-inner" data-toggle="buttons" aria-labelledby={labelId}>
			{checkboxes}
		</div>
	);
};

RadioGroupFieldInner.propTypes = {
	options: PropTypes.arrayOf(PropTypes.shape({
		label: PropTypes.any,
		value: PropTypes.any
	})).isRequired,
	className: PropTypes.string,
	onChange: PropTypes.func,
	onBlur: PropTypes.func,
	onFocus: PropTypes.func,
	value: PropTypes.any,
	labelId: PropTypes.string
};

const RadioGroupField = ({ label, options, className, ...otherProps }) => {
	return (
		<Field
			{...otherProps}

			className={`radio-group-field ${className || ''}`}
			label={label}
			options={options}
			inputComponent={RadioGroupFieldInner} />
	);
};

RadioGroupField.propTypes = {
	// eslint-disable-next-line react/forbid-foreign-prop-types
	...RadioGroupFieldInner.propTypes,

	className: PropTypes.string
};

const ReduxRadioGroupField = makeReduxField(RadioGroupField);

export default RadioGroupField;
export { ReduxRadioGroupField };
