import React, { Component } from 'react';
import PropTypes from 'prop-types';
//import { integer } from 'airbnb-prop-types';
import { connect } from 'react-redux';
import { loadCreditBalance } from 'redux/actions/employer';
import VitalsGroup from 'components/Layout/VitalsGroup';
import get from 'lodash/get';
import RadialButton from 'components/Buttons/RadialButton';
import LocaleLink from 'components/Localization/LocaleLink';
import Localized from 'components/Localization/Localized';
import './CreditBalance.css';

class CreditBalance extends Component {
	constructor(props) {
		super(props);

		const { dealer, loadCreditBalance } = props;
		if(dealer)
			loadCreditBalance({ dealer });
	}

	state = {
		hover: false
	}

	componentDidUpdate(prevProps) {
		const { dealer, loadCreditBalance } = this.props;

		if(dealer && dealer !== prevProps.dealer)
			loadCreditBalance({ dealer });
	}

	handleMouseEnter = () => {
		this.setState({ hover: true });
	}

	handleMouseLeave = () => {
		this.setState({ hover: false });
	}

	render() {
		/* eslint-disable-next-line */
		const { loading, balance, className, clickable, as: Component, loadCreditBalance, ...otherProps } = this.props;
		const { hover } = this.state;

		const loaded = !loading && balance != null;

		const positive = (parseInt(balance, 10) || 0) > 0;

		return (
			<Localized names="Employer">
				{({ CurrentBalanceLabel, CreditsCountLabel }) => (
					<Component 
						{...otherProps}

						className={`credit-balance ${!loaded ? 'loading' : ''} ${positive ? 'positive' : ''} ${clickable ? 'clickable' : ''} ${className || ''}`}
						onMouseEnter={this.handleMouseEnter}
						onMouseLeave={this.handleMouseLeave}>

						<VitalsGroup className="credit-balance-vitals">
							<VitalsGroup.Vital caption={CurrentBalanceLabel}>
								<span className="credit-balance-value">
									{(CreditsCountLabel || '').replace('[credits]', balance)}

									{clickable && (
										<RadialButton className="credit-balance-arrow" size="tiny" last hover={hover} as="div">
											<span className="icon icon-angle-right"></span>
										</RadialButton>
									)}
								</span>
							</VitalsGroup.Vital>
						</VitalsGroup>
					</Component>
				)}
			</Localized>
		);
	}
}

CreditBalance.propTypes = {
	className: PropTypes.string,
	dealer: PropTypes.any,
	clickable: PropTypes.bool,
	as: PropTypes.any,

	balance: PropTypes.any,
	loading: PropTypes.bool,
	loadCreditBalance: PropTypes.func.isRequired
};

CreditBalance.defaultProps = {
	as: LocaleLink,
	to: '/employer/credits/buy',
	target: '_blank',
	clickable: true
};

const mapStateToProps = (state, { dealer }) => ({
	balance: dealer ? get(state, `employer.creditBalance.dealer['${dealer}']`) : null,
	loading: state.employer.creditBalance.loading
});
 
export default connect(mapStateToProps, { loadCreditBalance })(CreditBalance);