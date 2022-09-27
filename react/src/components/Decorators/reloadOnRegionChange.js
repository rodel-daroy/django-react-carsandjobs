import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { language, region } from 'redux/selectors';

const reloadOnRegionChange = WrappedComponent => {
	class WrapperComponent extends Component {
		state = {
			key: 0
		}

		componentDidUpdate(prevProps) {
			const { language, region } = this.props;

			if(language !== prevProps.language || region !== prevProps.region)
				this.setState({
					key: this.state.key + 1
				});
		}

		render() {
			const { key } = this.state;

			return <WrappedComponent {...this.props} key={`reloadOnRegionChange-${key}`} />;
		}
	}

	WrapperComponent.displayName = `reloadOnRegionChange(${WrappedComponent.displayName || WrappedComponent.name})`;

	WrapperComponent.propTypes = {
		language: PropTypes.string,
		region: PropTypes.string
	};

	const mapStateToProps = state => ({
		language: language(state),
		region: region(state)
	});

	return connect(mapStateToProps)(WrapperComponent);
};

export default reloadOnRegionChange;