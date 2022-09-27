import React, { Component } from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import { makeReduxField, FieldPropTypes } from './common';
import './CheckboxField.css';

let id = 0;

class CheckboxField extends Component {
	constructor (props) {
		super(props);

		this.state = {
			id: `checkbox-${id++}`
		};
	}

	render () {
		const { label, children, state, helpText, offState, className, readOnly, disabled } = this.props;
		const { id } = this.state;
		const actualId = this.props.id || id;

		const innerProps = omit(this.props, Object.keys(CheckboxFieldPropTypes));

		const stateClass = state ? `has-${state}` : null;

		return (
			<div className={`checkbox-field ${!label ? 'no-label' : ''} ${stateClass || ''}`}>
				<input 
					{...innerProps} 

					className={`${offState ? 'off-state' : ''} ${className || ''}`}
					id={actualId} 
					type="checkbox" 
					aria-invalid={state === 'error'}
					disabled={disabled || readOnly} />

				<label htmlFor={actualId}>
					<div className="checkbox-box">
						<span className="icon icon-check" />
						<span className="icon icon-cancel" />
					</div>

					<div className="checkbox-label">
						{label}
					</div>
				</label>

				{children && (
					<div className="checkbox-content">
						{children}
					</div>
				)}

				{helpText && (
					<div className="help-block">
						{helpText}
					</div>
				)}
			</div>
		);
	}
}

const CheckboxFieldPropTypes = {
	children: PropTypes.node,
	offState: PropTypes.bool,
	className: PropTypes.string,
	readOnly: PropTypes.bool,

	...FieldPropTypes
};

CheckboxField.propTypes = {
	...CheckboxFieldPropTypes
};

const makeReduxCheckbox = WrappedComponent => {
	const ReduxField = makeReduxField(WrappedComponent);

	const component = props =>
		<ReduxField {...props} checked={props.input.value} />;

	component.propTypes = {
		// eslint-disable-next-line react/forbid-foreign-prop-types
		...ReduxField.propTypes
	};

	component.defaultProps = {
		...ReduxField.defaultProps
	};

	return component;
};

const ReduxCheckboxField = makeReduxCheckbox(CheckboxField);

export default CheckboxField;
export { ReduxCheckboxField };
