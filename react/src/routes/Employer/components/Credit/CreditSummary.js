import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadCreditBalances } from 'redux/actions/employer';
import EmptyState from 'components/Layout/EmptyState';
import { authDealers } from 'redux/selectors';
import isEqual from 'lodash/isEqual';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import LocaleLink from 'components/Localization/LocaleLink';
import Localized from 'components/Localization/Localized';
import ApplyPromoCode from './ApplyPromoCode';
import CommandBar from 'components/Layout/CommandBar';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import { getNextLink } from 'utils/router';
import './CreditSummary.css';

class CreditSummary extends Component {
	constructor(props) {
		super(props);

		props.loadCreditBalances();
	}

	componentDidUpdate(prevProps) {
		const { dealers, loadCreditBalances } = this.props;

		if(!isEqual(dealers, prevProps.dealers))
			loadCreditBalances();
	}

	render() { 
		const { balances: { loading, result }, onSelect, onCreditsApplied, location } = this.props;

		if(loading)
			return <EmptyState.Loading />;

		if(result)
			return (
				<Localized names={['Common', 'Jobs', 'Employer']}>
					{({ DealerLabel, CurrentBalanceLabel, BuyCreditsTitle, CreditsCountLabel, ApplyPromoCodeTitle }) => (
						<table className="credit-summary">
							<thead>
								<tr>
									{onSelect && (
										<th></th>
									)}
									<th>{DealerLabel}</th>
									<th>{CurrentBalanceLabel}</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{result.map(({ id, name, balance }) => {
									const buyLink = getNextLink({
										pathname: '/employer/credits/buy',
										search: `?dealer=${id}`
									}, location);

									return (
										<tr key={id}>
											{onSelect && (
												<td>
													<PrimaryLink 
														size="x-large" 
														hasIcon 
														iconClassName="icon icon-search" 
														onClick={() => onSelect(id)} />
												</td>
											)}
											<td>{name}</td>
											<td className={`credit-summary-balance ${((parseInt(balance, 10) || 0) > 0) ? 'positive' : ''}`}>
												{(CreditsCountLabel || '').replace('[credits]', balance)}
											</td>
											<td>
												<CommandBar>
													<PrimaryLink as={LocaleLink} to={buyLink} size="large">
														+ {BuyCreditsTitle}
													</PrimaryLink>

													<ApplyPromoCode dealer={id} onCreditsApplied={onCreditsApplied}>
														{({ onClick }) => (
															<PrimaryLink as="button" type="button" size="large" onClick={onClick}>
																+ {ApplyPromoCodeTitle}
															</PrimaryLink>
														)}
													</ApplyPromoCode>
												</CommandBar>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					)}
				</Localized>
			);

		return null;
	}
}

CreditSummary.propTypes = {
	onSelect: PropTypes.func,
	onCreditsApplied: PropTypes.func,

	balances: PropTypes.object.isRequired,
	loadCreditBalances: PropTypes.func.isRequired,
	dealers: PropTypes.array.isRequired,
	location: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	balances: state.employer.creditBalances,
	dealers: authDealers(state)
});
 
export default withLocaleRouter(connect(mapStateToProps, { loadCreditBalances })(CreditSummary));