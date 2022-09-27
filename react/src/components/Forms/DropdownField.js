import React, { Component } from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import Select from 'react-select';
import AsyncSelect from 'react-select/lib/Async';
import { makeReduxField } from './common';
import Field from './Field';
import Localized from 'components/Localization/Localized';
import Media from 'react-media';
import { mediaQuery } from 'utils/style';
import './DropdownField.css';

class DropdownFieldInner extends Component {
	constructor(props) {
		super(props);

		this.state = {
			lastValue: props.value
		};

		this.doLoadOption(props.value);
	}

	loadOption(value) {
		let cancelled = false;

		this.props.loadOption(value).then(option => {
			if(!cancelled)
				this.setState({
					asyncValue: option
				});
		});

		return () => {
			cancelled = true;
		};
	}

	doLoadOption(value = this.props.value) {
		if(!this.isAsync)
			return;
			
		const { lastSelectedOption } = this.state;

		if(this._cancelLoadOption)
			this._cancelLoadOption();
		
		if(lastSelectedOption && lastSelectedOption.value === value)
			this.setState({
				asyncValue: lastSelectedOption
			});
		else
			this._cancelLoadOption = this.loadOption(value);
	}

	componentDidUpdate(prevProps) {
		const { value } = this.props;

		if(value !== prevProps.value)
			this.doLoadOption();
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		const { value } = this.props;

		if(value !== nextProps.value) {
			this.setState({
				lastValue: nextProps.value
			});
		}
	}

	componentWillUnmount() {
		if(this._cancelLoadOption)
			this._cancelLoadOption();
	}

	handleChange = value => {
		const { onChange } = this.props;

		const actualValue = (value && typeof value === 'object') ? value.value : value;

		if(onChange) {
			this.setState({
				lastValue: actualValue,
				lastSelectedOption: value
			});

			onChange(actualValue, value);
		}
	}

	handleBlur = () => {
		const { onBlur } = this.props;
		const { lastValue } = this.state;

		if(onBlur)
			onBlur(lastValue);
	}

	renderClear = () => {
		return (
			<span className="icon icon-cancel"></span>
		);
	};

	/* eslint-disable-next-line no-unused-vars */
	renderArrow = ({ onMouseDown, isOpen }) => {
		const { noArrow } = this.props;

		if(!noArrow)
			return (
				<span onMouseDown={onMouseDown} className="icon icon-angle-down"></span>
			);

		return null;
	}

	/* eslint-disable-next-line no-unused-vars */
	renderOption = (option, i, inputValue) => <div>{option.label}</div>

	get isAsync() {
		return typeof this.props.options === 'function';
	}

	renderSelect() {
		const { options, value, disabled, searchable, placeholder, readOnly, responsive } = this.props;

		return (
			<Localized names="Common">
				{({ StartTypingPlaceholder, SelectPlaceholder }) => {
					let actualPlaceholder = placeholder;
					if(!actualPlaceholder)
						actualPlaceholder = searchable ? StartTypingPlaceholder : SelectPlaceholder;

					const baseProps = {
						...omit(this.props, ['noFrame', 'className', 'searchable', 'options', 'loadOption', 'responsive']),
			
						placeholder: actualPlaceholder,
						clearable: searchable,
						clearRenderer: this.renderClear,
						arrowRenderer: this.renderArrow,
						optionRenderer: this.renderOption,
						value: this.isAsync ? this.state.asyncValue : value,
						onChange: this.handleChange,
						onBlur: this.handleBlur,
						onBlurResetsInput: true,
						onCloseResetsInput: true,
						disabled: disabled || readOnly,
						searchPromptText: StartTypingPlaceholder,
						inputProps: {
							autoComplete: 'off'
						}
					};
			
					if(this.isAsync) {
						return (
							<AsyncSelect
								{...baseProps}
			
								searchable
								loadOptions={options}
								cacheOptions
								filterOptions={options => options} />
						);
					}
			
					return (
						<Media query={mediaQuery('xs sm')}>
							{mobile => {
								const responsiveSearchable = searchable && (!mobile || !responsive);
								const placeholder = responsiveSearchable ? StartTypingPlaceholder : SelectPlaceholder;

								return (
									<Select 
										{...baseProps} 

										options={options}
										searchable={responsiveSearchable}
										placeholder={placeholder} />
								);
							}}
						</Media>
					);
				}}
			</Localized>
		);
	}

	render() {
		const { noFrame, disabled, size, noArrow } = this.props;

		return (
			<div className={`custom-dropdown ${size} ${noFrame ? 'no-frame' : ''} ${noArrow ? 'no-arrow' : ''} ${disabled ? 'disabled' : ''}`}>
				<div className="custom-dropdown-inner">
					{this.renderSelect()}
				</div>
			</div>
		);
	}
}

DropdownFieldInner.propTypes = {
	// eslint-disable-next-line react/forbid-foreign-prop-types
	...omit(Select.propTypes, ['options']),

	options: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.shape({
			label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
			value: PropTypes.any
		})),
		PropTypes.func
	]),
	loadOption: PropTypes.func,
	size: PropTypes.oneOf(['small', 'medium', 'large']),
	noFrame: PropTypes.bool,
	noArrow: PropTypes.bool,
	placeholder: PropTypes.string,
	searchable: PropTypes.bool,
	readOnly: PropTypes.bool,
	responsive: PropTypes.bool,

	// eslint-disable-next-line react/forbid-foreign-prop-types
	...omit(Field.propTypes || {}, ['inputComponent'])
};

DropdownFieldInner.defaultProps = {
	size: 'large',
	searchable: true,
	responsive: true,

	...(Field.defaultProps || {})
};

const inputComponent = props => <DropdownFieldInner {...props} />;

const DropdownField = ({ className, ...otherProps }) => (
	<Field {...otherProps} className={`dropdown-field ${className || ''}`} inputComponent={inputComponent} />
);

DropdownField.propTypes = {
	// eslint-disable-next-line react/forbid-foreign-prop-types
	...DropdownFieldInner.propTypes
};

DropdownField.defaultProps = {
	...DropdownFieldInner.defaultProps
};

const ReduxDropdownField = makeReduxField(DropdownField);

export default DropdownField;
export { ReduxDropdownField };