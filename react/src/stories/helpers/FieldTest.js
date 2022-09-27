import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { action } from '@storybook/addon-actions';

class FieldTest extends Component {
	constructor(props) {
		super(props);

		this.state = {
			value: props.value
		};
	}

	handleChange = (value, ...args) => {
		const { onChange } = this.props;

		action('onChange')(value, ...args);

		this.setState({ value });

		if(onChange)
			onChange(value, ...args);
	}

	render() {
		const { as: Component, valueProp } = this.props;
		const { value } = this.state;

		const valuePropObj = {
			[valueProp]: value
		};

		return (
			<Component {...this.props} {...valuePropObj} onChange={this.handleChange} />
		);
	}
}

FieldTest.propTypes = {
	value: PropTypes.any,
	as: PropTypes.any.isRequired,
	onChange: PropTypes.func,
	valueProp: PropTypes.string
};

FieldTest.defaultProps = {
	valueProp: 'value'
};
 
export default FieldTest;