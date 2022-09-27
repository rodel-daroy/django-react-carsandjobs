import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Waypoint from 'react-waypoint';

class Placeholder extends Component {
	state = {}

	handleEnter = () => {
		this.setState({
			entered: true
		});
	}

	render() {
		const { className, children } = this.props;
		const { entered } = this.state;

		if(!entered)
			return (
				<Waypoint onEnter={this.handleEnter}>
					<div className={`placeholder ${className || ''}`}></div>
				</Waypoint>
			);

		return children();
	}
}

Placeholder.propTypes = {
	children: PropTypes.func.isRequired,
	className: PropTypes.string
};
 
export default Placeholder;

export const placeholder = className => WrappedComponent => {
	const WrapperComponent = props => (
		<Placeholder className={className}>
			{() => <WrappedComponent {...props} />}
		</Placeholder>
	);

	WrapperComponent.displayName = `placeholder(${WrappedComponent.displayName || WrappedComponent.name})`;

	return WrapperComponent;
};
