import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadCreditPrices } from 'redux/actions/employer';
import sortBy from 'lodash/sortBy';
import DropdownField from 'components/Forms/DropdownField';
import Big from 'big.js';
import { localized } from 'redux/selectors';

class CreditSelector extends Component {
	constructor(props) {
		super(props);

		props.loadCreditPrices();
	}

	state = {}

	static getDerivedStateFromProps(props) {
		const { creditPrices: { result }, localized: { CreditPriceLabel } } = props;

		let options = [];
		if(result)
			options = sortBy(result, p => parseInt(p.quantity, 10)).map(price => ({
				label: (CreditPriceLabel || '').replace('[credits]', price.quantity).replace('[price]', Big(price.price).toFixed(2)),
				value: price.id,
				price
			}));

		return {
			options
		};
	}

	handleChange = value => {
		const { onChange } = this.props;
		const { options } = this.state;

		this.setState({ value });

		const price = options.find(o => o.value === value);
		onChange(price.price);
	}

	render() {
		const { creditPrices: { loading }, localized: { CreditsToBuyLabel }, disabled } = this.props;
		const { value, options } = this.state;
		
		return (
			<DropdownField
				label={CreditsToBuyLabel}
				options={options}
				onChange={this.handleChange}
				value={value}
				searchable={false}
				disabled={disabled || loading} />
		);
	}
}

CreditSelector.propTypes = {
	onChange: PropTypes.func.isRequired, 
	disabled: PropTypes.bool,

	loadCreditPrices: PropTypes.func.isRequired,
	creditPrices: PropTypes.object.isRequired,
	localized: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	creditPrices: state.employer.creditPrices,
	localized: localized('Employer')(state)
});
 
export default connect(mapStateToProps, { loadCreditPrices })(CreditSelector);