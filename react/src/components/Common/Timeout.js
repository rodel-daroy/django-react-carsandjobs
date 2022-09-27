import { Component } from 'react';
import PropTypes from 'prop-types';
import { integer } from 'airbnb-prop-types';

class Timeout extends Component {
	componentDidMount() {
		const { timeout, onTimeout } = this.props;

		this._timeout = setTimeout(onTimeout, timeout);
	}

	componentWillUnmount() {
		clearTimeout(this._timeout);
	}

	render() { 
		return this.props.children || null;
	}
}

Timeout.propTypes = {
	timeout: integer().isRequired,
	onTimeout: PropTypes.func.isRequired,
	children: PropTypes.node
};
 
export default Timeout;