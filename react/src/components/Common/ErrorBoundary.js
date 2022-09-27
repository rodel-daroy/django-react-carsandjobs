import { Component } from 'react';
import PropTypes from 'prop-types';
import { error } from 'redux/actions/common';
import { connect } from 'react-redux';

class ErrorBoundary extends Component {
	state = {}

	componentDidCatch(err) {
		this.props.error(err);
		
		this.setState({
			error: err
		});
	}

	render() { 
		if(!this.state.error)
			return this.props.children;
		else
			return null;
	}
}

ErrorBoundary.propTypes = {
	children: PropTypes.node,

	error: PropTypes.func.isRequired
};
 
export default connect(null, { error })(ErrorBoundary);