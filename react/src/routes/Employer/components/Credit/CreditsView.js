import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HeaderStrip from 'components/Layout/HeaderStrip';
import HeaderStripContent from 'components/Layout/HeaderStripContent';
import HeaderStripContentLarge from 'components/Layout/HeaderStripContentLarge';
import CreditsList from './CreditsList';
import errorBoundary from 'components/Decorators/errorBoundary';
import ContentMetaTags from 'components/Content/ContentMetaTags';
import CreditSummary from './CreditSummary';
import Localized from 'components/Localization/Localized';
import requireRole from 'components/Decorators/requireRole';
import { DEALER_ROLES } from 'redux/selectors';
import DealerField from '../DealerField';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import { urlSearchToObj, mergeUrlSearch } from 'utils/url';
import './CreditsView.css';

class CreditsView extends Component {
	state = {
		key: 0
	}

	static getDerivedStateFromProps(props) {
		const { location: { search } } = props;
		const { dealer, p } = urlSearchToObj(search);

		return {
			dealer,
			pageIndex: parseInt(p, 10) || 0
		};
	}

	handleDealerChange = dealer => {
		const { location, history } = this.props;

		if(dealer !== this.state.dealer) {
			history.replace({
				...location,
				search: mergeUrlSearch(location.search, { dealer })
			});

			this._creditsList.scrollIntoView();
		}
	}

	handlePageChange = pageIndex => {
		const { location, history } = this.props;

		if(pageIndex !== this.state.pageIndex)
			history.replace({
				...location,
				search: mergeUrlSearch(location.search, { p: pageIndex })
			});
	}

	handleCreditsApplied = () => {
		this.setState({
			key: this.state.key + 1
		});
	}

	render() {
		const { dealer, key, pageIndex } = this.state;

		return (
			<Localized names={['Common', 'Employer']}>
				{({ CreditsTitle, SummaryTitle, TransactionHistoryTitle, ForDealerLabel, AllDealersPlaceholder }) => (
					<div className="credits-view">
						<ContentMetaTags title={CreditsTitle} />
		
						<HeaderStrip>
							<HeaderStripContentLarge>
								<HeaderStripContent.Back to="/employer/dashboard" />
		
								<h1>{CreditsTitle}</h1>
							</HeaderStripContentLarge>
						</HeaderStrip>
		
						<div className="credits-view-content">
							<div className="credits-view-panel">
								<h2>{SummaryTitle}</h2>

								<CreditSummary onSelect={this.handleDealerChange} onCreditsApplied={this.handleCreditsApplied} />
							</div>
						</div>
							
						<div className="credits-view-content">
							<div ref={ref => this._creditsList = ref} className="credits-view-panel">
								<h2>{TransactionHistoryTitle}</h2>

								<DealerField 
									label={ForDealerLabel} 
									value={dealer} 
									onChange={this.handleDealerChange}
									placeholder={AllDealersPlaceholder}
									nullLabel={AllDealersPlaceholder} />

								<CreditsList 
									key={`credits-list-${key}`} 
									dealer={dealer} 
									pageIndex={pageIndex} 
									onPageChange={this.handlePageChange} />
							</div>
						</div>
					</div>
				)}
			</Localized>
		);
	}
}

CreditsView.propTypes = {
	location: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired
};
 
export default errorBoundary(requireRole(DEALER_ROLES)(withLocaleRouter(CreditsView)));