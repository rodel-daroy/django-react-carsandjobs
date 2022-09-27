import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField, { TextFieldPropTypes } from './TextField';
import without from 'lodash/without';
import omit from 'lodash/omit';
import { COLORS } from 'utils/style';
import { makeReduxField } from './common';
import { calculatePasswordStrength } from 'utils/validation';
import Localized from 'components/Localization/Localized';
import './PasswordField.css';

export default class PasswordField extends Component {
	constructor(props) {
		super(props);

		this.state = {
			reveal: false,
			strength: 0,
			showControls: false
		};
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		const { value } = this.props;
		const { showControls } = this.state;

		if(nextProps.value !== value) {
			const shouldShowControls = nextProps.value && nextProps.value.length > 0;

			if(shouldShowControls !== showControls)
				this.setState({
					showControls: shouldShowControls,
					reveal: false
				});
		}
	}

	getStepKeys() {
		const { steps } = this.props;
		return Object.keys(steps).map(k => parseFloat(k)).sort((a, b) => a - b);
	}

	getStep(strength) {
		const { steps } = this.props;
		const keys = this.getStepKeys();

		for (let i = 0; i < keys.length - 1; ++i) {
			if (strength >= keys[i] && strength < keys[i + 1]) {
				let step = { ...steps[keys[i]] };

				return step;
			}
		}

		return steps[keys[keys.length - 1]];
	}

	handleChange = e => {
		const { onChange } = this.props;

		this.setState({
			strength: calculatePasswordStrength(e.target.value)
		});

		if (onChange) onChange(e);
	}

	handleToggleReveal = () => {
		this.setState({
			reveal: !this.state.reveal
		});
	}

	render() {
		const { className, inputClassName, hideMeter, dark, children } = this.props;
		const { strength, reveal, showControls } = this.state;

		const passwordPropTypes = without(
			Object.keys(PasswordFieldPropTypes),
			...Object.keys(TextFieldPropTypes)
		);
		const childProps = omit(this.props, passwordPropTypes);

		return (
			<Localized names="Common">
				{localized => {
					const { HidePasswordLabel, RevealPasswordLabel } = localized;

					const step = this.getStep(strength);
					const stepLabel = localized[step.label];

					return (
						<TextField
							{...childProps}
							type={reveal ? 'text' : 'password'}
							className={`${className || ''} password-field ${showControls ? 'show-controls' : ''}`}
							inputClassName={`${inputClassName || ''} password`}
							onChange={this.handleChange}
							button={
								showControls ? (
									<button
										type="button"
										className={`password-reveal ${dark ? 'dark' : ''}`}
										onClick={this.handleToggleReveal}
										aria-label={reveal ? HidePasswordLabel : RevealPasswordLabel}
										title={reveal ? HidePasswordLabel : RevealPasswordLabel}>

										<span className={`icon icon-eye${reveal ? '-off' : ''}`}></span>
									</button>
								) : null
							}>

							{showControls && !hideMeter && (
								<div className="password-strength">
									<div className="password-strength-bar">
										<div
											className="password-strength-fill"
											style={{
												width: `${Math.max(10, strength)}%`,
												backgroundColor: step.color
											}}
										/>
									</div>

									<div
										className="password-strength-label"
										style={{ color: step.color }}>

										{stepLabel}
									</div>
								</div>
							)}

							{children}
						</TextField>
					);
				}}
			</Localized>
		);
	}
}

export const PasswordFieldPropTypes = {
	steps: PropTypes.object.isRequired,
	hideMeter: PropTypes.bool,

	...TextFieldPropTypes
};

PasswordField.propTypes = {
	...PasswordFieldPropTypes
};

PasswordField.defaultProps = {
	steps: {
		0: {
			label: 'VeryWeakPasswordLabel',
			color: COLORS.BRAND_RED
		},
		10: {
			label: 'WeakPasswordLabel',
			color: COLORS.BRAND_ORANGE
		},
		30: {
			label: 'MediumPasswordLabel',
			color: COLORS.BRAND_YELLOW
		},
		50: {
			label: 'StrongPasswordLabel',
			color: COLORS.BRAND_GREEN
		},
		70: {
			label: 'VeryStrongPasswordLabel',
			color: COLORS.BRAND_GREEN
		},
		100: {
			label: 'VeryStrongPasswordLabel',
			color: COLORS.BRAND_GREEN
		}
	},
	
	...(TextField.defaultProps || {})
};

const ReduxPasswordField = makeReduxField(PasswordField);

export { ReduxPasswordField };
