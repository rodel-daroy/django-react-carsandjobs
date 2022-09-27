import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { integer } from 'airbnb-prop-types';
import { loadDealerCredits } from 'redux/actions/employer';
import { connect } from 'react-redux';
import { formatShortDate } from 'utils/format';
import PagedList from 'components/Layout/PagedList';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import LocaleLink from 'components/Localization/LocaleLink';
import { authDealers } from 'redux/selectors';
import EmptyState from 'components/Layout/EmptyState';
import Localized from 'components/Localization/Localized';
import castArray from 'lodash/castArray';
import { getNextLink } from 'utils/router';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import './CreditsList.css';

class CreditsList extends Component {
	state = {
		key: 0
	}

	componentDidUpdate(prevProps) {
		const { dealer, onPageChange } = this.props;

		if(dealer !== prevProps.dealer) {
			onPageChange(0);

			this.setState({
				key: this.state.key + 1
			});
		}
	}

	handleRangeChange = ({ startIndex, endIndex }) => {
		const { loadDealerCredits, dealer, dealers } = this.props;

		loadDealerCredits({
			startIndex,
			count: (endIndex - startIndex) + 1,
			dealer: dealer ? castArray(dealer) : dealers.map(d => d.id)
		});
	}

	render() {
		const { credits: { all, loading }, dealers, onPageChange, pageIndex, location } = this.props;
		const { key } = this.state;

		const totalCount = all ? all.length : 0;

		const dealerName = id => (dealers.find(d => d.id === id) || {}).name;

		return (
			<Localized names={['Common', 'Jobs', 'Employer']}>
				{({ 
					DateLabel, 
					InvoiceLabel, 
					DealerLabel, 
					DescriptionLabel, 
					JobLabel,
					DebitsLabel,
					CreditsLabel,
					NoTransactionsFoundLabel
				}) => (
					<PagedList
						key={`credits-list-${key}`}
						totalCount={totalCount}
						onChange={onPageChange}
						onRangeChange={this.handleRangeChange}
						loading={loading}
						pageIndex={pageIndex}>

						{({ startIndex, endIndex }) => {
							if(all) {
								const items = all.slice(startIndex, endIndex).filter(i => !!i);

								return (
									<table className="credits-list-table">
										<thead>
											<tr>
												<th>{DateLabel}</th>
												<th className="min-width align-center">{InvoiceLabel}</th>
												<th>{DealerLabel}</th>
												<th>{DescriptionLabel}</th>
												<th className="min-width align-center">{JobLabel}</th>
												<th className="min-width">{DebitsLabel}</th>
												<th className="min-width">{CreditsLabel}</th>
											</tr>
										</thead>
						
										<tbody>
											{items.map((item, i) => {
												const quantity = parseInt(item.quantity, 10);

												return (
													<tr key={i}>
														<td>{formatShortDate(item.transactionDate)}</td>
														<td className="min-width align-center">
															{item.invoiceId && (
																<PrimaryLink 
																	className="credits-list-link" 
																	as={LocaleLink}
																	to={getNextLink(`/employer/credits/invoice/${item.invoiceId}`, location)}
																	hasIcon
																	iconClassName="icon icon-doc-text-inv"
																	size="x-large">
																</PrimaryLink>
															)}
														</td>
														<td>{dealerName(item.dealerId)}</td>
														<td>{item.description}</td>
														<td className="min-width align-center">
															{item.jobId && (
																<PrimaryLink
																	className="credits-list-link"
																	as={LocaleLink}
																	to={`/jobs/detail?id=${item.jobId}`}
																	target="_blank"
																	hasIcon
																	iconClassName="icon icon-briefcase"
																	size="x-large">
																</PrimaryLink>
															)}
														</td>
														<td className="credits-list-debits min-width">{quantity < 0 && Math.abs(quantity)}</td>
														<td className="credits-list-credits min-width">{quantity >= 0 && quantity}</td>
													</tr>
												);
											})}

											{items.length === 0 && (
												<tr>
													<td colSpan={7}>
														<EmptyState inline>
															{NoTransactionsFoundLabel}
														</EmptyState>
													</td>
												</tr>
											)}
										</tbody>
									</table>
								);
							}
							else
								return null;
						}}
					</PagedList>
				)}
			</Localized>
		);
	}
}

CreditsList.propTypes = {
	dealer: PropTypes.string,
	pageIndex: integer().isRequired,
	onPageChange: PropTypes.func.isRequired,

	credits: PropTypes.object.isRequired,
	loadDealerCredits: PropTypes.func.isRequired,
	dealers: PropTypes.array.isRequired,
	location: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	credits: state.employer.dealerCredits,
	dealers: authDealers(state)
});
 
export default withLocaleRouter(connect(mapStateToProps, { loadDealerCredits })(CreditsList));