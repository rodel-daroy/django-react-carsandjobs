import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DropdownField from 'components/Forms/DropdownField';
import omit from 'lodash/omit';
import { getDealerOptions } from './DealerOptions';
import { connect } from 'react-redux';
import { authDealers, authRole, ADMIN_ROLE } from 'redux/selectors';
import { makeReduxField } from 'components/Forms/common';
import CreditBalance from './Credit/CreditBalance';
import LocaleLink from 'components/Localization/LocaleLink';
import { loadAllDealers, loadDealer } from 'redux/actions/admin';
import { apiPromise } from 'utils/redux';
import './DealerField.css';

let DealerField = 
	class DealerField extends Component {
		getDealer = async id => {
			const { loadDealer } = this.props;

			if(!id)
				return null;

			try {
				loadDealer({ id });
				const { name: label, id: value } = await apiPromise(() => this.props.dealerState);

				return {
					label,
					value
				};
			}
			catch(error) {
				return null;
			}
		}

		handleLoadOptions = async search => {
			const { loadAllDealers } = this.props;

			if(!search || search.length < 3)
				return {
					options: []
				};

			try {
				loadAllDealers({ search });
				const result = await apiPromise(() => this.props.allDealersState);

				return {
					options: getDealerOptions(result)
				};
			}
			catch(error) {
				return {
					options: []
				};
			}
		}

		getDealerOptions() {
			const { nullLabel, dealers } = this.props;
			
			let options = getDealerOptions(dealers);

			if(nullLabel)
				options.splice(0, 0, {
					label: nullLabel,
					value: null
				});

			return options;
		}

		render() {
			const { showBalance, value, linkToCredits, allDealers, role, ...otherProps } = this.props;

			const isAllDealers = allDealers && role === ADMIN_ROLE;

			return (
				<div className="dealer-field">
					<DropdownField 
						{...otherProps}
						value={value}
						options={isAllDealers ? this.handleLoadOptions : this.getDealerOptions()}
						loadOption={this.getDealer} />

					{showBalance && (
						<CreditBalance 
							key={value}
							className="dealer-field-balance" 
							dealer={value}
							clickable={linkToCredits}
							as={linkToCredits ? LocaleLink : 'div'}
							to={`/employer/credits/buy?dealer=${value}`} />
					)}
				</div>
			);
		}
	};

DealerField.propTypes = {
	// eslint-disable-next-line react/forbid-foreign-prop-types
	...omit(DropdownField.propTypes, ['options']),

	showBalance: PropTypes.bool,
	linkToCredits: PropTypes.bool,
	nullLabel: PropTypes.string,
	allDealers: PropTypes.bool,

	role: PropTypes.any.isRequired,
	dealers: PropTypes.array.isRequired,
	loadAllDealers: PropTypes.func.isRequired,
	loadDealer: PropTypes.func.isRequired,
	allDealersState: PropTypes.object.isRequired,
	dealerState: PropTypes.object.isRequired
};

DealerField.defaultProps = {
	...DropdownField.defaultProps,

	searchable: false,
	linkToCredits: true
};

const mapStateToProps = state => ({
	role: authRole(state),
	dealers: authDealers(state),
	allDealersState: state.admin.allDealers,
	dealerState: state.admin.dealer
});
 
DealerField = connect(mapStateToProps, { loadAllDealers, loadDealer })(DealerField);

export default DealerField;

const ReduxDealerField = makeReduxField(DealerField);

export { ReduxDealerField };