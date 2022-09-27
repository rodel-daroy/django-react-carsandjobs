import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FieldPropTypes } from './common';
import omit from 'lodash/omit';
import { scrollTo } from 'utils';
import ThemeContext from 'components/Common/ThemeContext';
import './Field.css';

let id = 0;

class Field extends Component {
	constructor (props) {
		super(props);

		this.state = {
			id: `field-${id++}`,
			focused: false
		};
	}

	handleFocus = () => {
		this.setState({
			focused: true
		});
	}

	handleBlur = () => {
		this.setState({
			focused: false
		});
	}

	render () {
		const {
			name,
			label,
			children,
			className,
			state,
			helpText,
			button,
			inputComponent,
			last,
			autofilled,
			autofilledText,
			orientation,
			size
		} = this.props;
		const stateClass = state ? `has-${state}` : null;
		const { id, focused } = this.state;

		const actualId = this.props.id || id;
		const labelId = `${actualId}-label`;

		const input = inputComponent({
			...omit(this.props, ['children']),
			id: actualId,
			labelId
		});

		const actualHelpText = helpText || (autofilled && autofilledText);

		return (
			<ThemeContext.Consumer>
				{({ dark }) => (
					<div 
						className={`field ${stateClass || ''} 
							${last ? 'last' : ''} 
							${focused ? 'focused' : ''} 
							${dark ? 'dark' : ''} 
							${autofilled ? 'autofilled' : ''} 
							${className || ''}
							${orientation}
							${size || ''}`}
						aria-invalid={state === 'error'}>

						<div className="anchor absolute" id={name}></div>

						{label && (
							<label htmlFor={actualId} id={labelId}>
								{label}
							</label>
						)}

						<div className="field-inner">
							<div className="form-group-line" onFocus={this.handleFocus} onBlur={this.handleBlur}>
								{input}

								{button && (
									<div className="form-group-line-button">
										{button}
									</div>
								)}
							</div>

							<div className="form-group-children">
								{actualHelpText &&
									<div className="help-block">
										{actualHelpText}
									</div>}
								{children}
							</div>
						</div>
					</div>
				)}
			</ThemeContext.Consumer>
		);
	}
}

export const AllFieldPropTypes = {
	id: PropTypes.string,
	className: PropTypes.string,
	children: PropTypes.node,
	button: PropTypes.element,
	inputButton: PropTypes.element,
	inputComponent: PropTypes.func.isRequired,
	last: PropTypes.bool,
	autofilled: PropTypes.bool,
	orientation: PropTypes.oneOf(['horizontal', 'vertical']),
	size: PropTypes.oneOf(['small', 'large']),
	
	...FieldPropTypes
};

Field.propTypes = {
	...AllFieldPropTypes
};

Field.defaultProps = {
	orientation: 'vertical',
	autofilledText: 'Autofilled'
};

export default Field;

const getFieldParent = field => {
	if(field.classList.contains('field'))
		return field;
	else
		return field.parentNode;
};

const focus = field => {
	const label = getFieldParent(field).querySelector('label');
	
	if(label && label.control) {
		if(label.control instanceof HTMLInputElement)
			label.control.select();
		else
			label.control.focus();
	}
};

export const focusField = name => {
	const field = document.getElementById(name);
	if(field)
		focus(field);
};

export const highlightField = name => {
	const field = document.getElementById(name);

	scrollTo(field);
	focus(field);
};