import React, { Component } from 'react';
import PasswordField from 'components/Forms/PasswordField';

class PasswordFieldTest extends Component {
	state = {
		value: ''
	}

	render() {
		const { value } = this.state;

		return (
			<PasswordField {...this.props} value={value} onChange={e => this.setState({ value: e.target.value })} />
		);
	}
}

export default PasswordFieldTest;