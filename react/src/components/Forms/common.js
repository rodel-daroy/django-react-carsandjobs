import React from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import withMetadata, { getMetadata } from 'components/Decorators/withMetadata';
import { connect } from 'react-redux';
import { localized } from 'redux/selectors';

const FieldPropTypes = {
	value: PropTypes.any,
	label: PropTypes.node,
	state: PropTypes.oneOf(['success', 'error', 'warning']),
	helpText: PropTypes.string,
	autofilled: PropTypes.bool,
	autofilledText: PropTypes.string,
	dark: PropTypes.bool
};

const getReduxMetadataKey = (form, name) => `${form}.${name}`;

const withReduxMetadata = WrappedComponent => {
	const propsToKey = ({ input: { name }, meta: { form }}) => getReduxMetadataKey(form, name);

	const mapPropsToState = ({ shortLabel, label, parentField }) => ({
		shortLabel: shortLabel || label,
		parentField
	});

	return withMetadata(propsToKey, mapPropsToState)(WrappedComponent);
};

const getReduxMetadata = (form, name) => getMetadata(getReduxMetadataKey(form, name));

const makeReduxField = WrappedComponent => {
	const component = props => {
		const { input, meta } = props;
		const fieldProps = {
			...input
		};
		const innerProps = omit(props, [
			'meta',
			'input',
			'shortLabel',
			'parentField',
			'localized',
			'dispatch',
			...Object.keys(fieldProps)
		]);

		let { state } = props;
		if(meta.touched || meta.submitFailed) {
			if(meta.error)
				state = 'error';
			if(meta.warning)
				state = 'warning';
		}

		let { helpText } = props;
		if(meta.touched || meta.submitFailed) {
			helpText = meta.error || meta.warning || helpText;

			if(typeof helpText === 'object') {
				const { key, args } = helpText;

				helpText = (props.localized[key] || '');
				for(let i = 0; i < (args || []).length; ++i)
					helpText = helpText.replace(`[${i}]`, args[i]);
			}
		}

		let { autofilled } = props;
		autofilled = autofilled || meta.autofilled;

		return (
			<WrappedComponent 
				{...innerProps} 
				{...fieldProps}
				state={state}
				helpText={helpText}
				autofilled={autofilled} />
		);
	};

	component.propTypes = {
		input: PropTypes.object,
		meta: PropTypes.object,
		...WrappedComponent.propTypes,

		localized: PropTypes.object.isRequired
	};

	component.defaultProps = {
		...WrappedComponent.defaultProps
	};

	component.displayName = `Redux${WrappedComponent.name}`;

	const mapStateToProps = state => ({
		localized: localized('Common')(state)
	});

	//return withReduxMetadata(component);
	return connect(mapStateToProps)(component);
};

export { makeReduxField, FieldPropTypes, withReduxMetadata, getReduxMetadata, getReduxMetadataKey };