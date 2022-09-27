import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { authToken } from 'redux/selectors';

const reloadOnSignIn = WrappedComponent => {
	class WrapperComponent extends Component {
		state = {
			key: 0
		}

		componentDidUpdate(prevProps) {
			const { authToken } = this.props;

			if(authToken !== prevProps.authToken) {
				this.setState({
					key: this.state.key + 1
				});
			}
		}

		render() {
			const { key } = this.state;

			return <WrappedComponent {...this.props} key={`reloadOnSignIn-${key}`} />;
		}
	}

	WrapperComponent.propTypes = {
		authToken: PropTypes.any
	};

	WrapperComponent.displayName = `reloadOnSignIn(${WrappedComponent.displayName || WrappedComponent.name})`;

	const mapStateToProps = state => ({
		authToken: authToken(state)
	});

	return connect(mapStateToProps)(WrapperComponent);
};

export default reloadOnSignIn;