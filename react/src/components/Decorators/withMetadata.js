import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { saveMetadata, removeMetadata } from 'redux/actions/metadata';
import isEqual from 'lodash/isEqual';

const withMetadata = (propsToKey, mapPropsToState) => WrappedComponent => {
	class WrapperComponent extends Component {
		constructor(props) {
			super(props);

			this.store(props);
		}

		store(props = this.props) {
			const key = propsToKey(props);
			const state = mapPropsToState(props);

			props.saveMetadata(key, state);
		}

		UNSAFE_componentWillReceiveProps(nextProps) {
			const oldKey = propsToKey(this.props);
			const newKey = propsToKey(nextProps);

			if(oldKey !== newKey) {
				this.props.removeMetadata(oldKey);
				this.store(nextProps);
			}
			else {
				const oldState = mapPropsToState(this.props);
				const newState = mapPropsToState(nextProps);

				if(!isEqual(oldState, newState))
					this.store(nextProps);
			}
		}

		componentWillUnmount() {
			const key = propsToKey(this.props);

			this.props.removeMetadata(key);
		}

		render() {
			/* eslint-disable no-unused-vars */
			const { saveMetadata, removeMetadata, ...otherProps } = this.props;
			/* eslint-enable */

			return <WrappedComponent {...otherProps} />;
		}
	}

	WrapperComponent.propTypes = {
		saveMetadata: PropTypes.func,
		removeMetadata: PropTypes.func
	};

	WrapperComponent.displayName = `withMetadata(${WrappedComponent.displayName || WrappedComponent.name})`;

	const mapDispatchToProps = {
		saveMetadata,
		removeMetadata
	};

	return connect(null, mapDispatchToProps)(WrapperComponent);
};

export default withMetadata;

const getMetadata = key => state => state.metadata.metadata[key];

export { getMetadata };