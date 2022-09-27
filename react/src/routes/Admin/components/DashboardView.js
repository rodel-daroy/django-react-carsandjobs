import React from 'react';
import PropTypes from 'prop-types';
import CategoryTiles from 'components/Navigation/CategoryTiles';
import CategoryTile from 'components/Navigation/CategoryTile';
import jobStats from './img/job-stats.svg';
import applicationStats from './img/application-stats.svg';
import invoices from './img/invoices.svg';
import transactions from './img/transactions.svg'; 
import credits from './img/credits.svg';
import tiles from './img/tiles.svg';
import { connect } from 'react-redux';
import { authRole, ADMIN_ROLE } from 'redux/selectors';
import Localized from 'components/Localization/Localized';

const DashboardView = ({ role }) => (
	<Localized names={['Common', 'Employer', 'Admin']}>
		{({
			ReportsTitle,
			JobStatsTitle,
			ApplicationStatsTitle,
			InvoicesTitle,
			TransactionsTitle,
			CreditsTitle,
			ContentTitle,
			TilesTitle
		}) => (
			<React.Fragment>
				<CategoryTiles caption={ReportsTitle}>
					{role === ADMIN_ROLE && <CategoryTile caption={JobStatsTitle} to="/admin/job-stats" image={jobStats} />}
					{role === ADMIN_ROLE && <CategoryTile caption={ApplicationStatsTitle} to="/admin/application-stats" image={applicationStats} />}
					
					<CategoryTile caption={InvoicesTitle} to="/admin/invoices" image={invoices} />
					<CategoryTile caption={TransactionsTitle} to="/admin/transactions" image={transactions} /> 
					<CategoryTile caption={CreditsTitle} to="/admin/credits" image={credits} />
				</CategoryTiles>

				{role === ADMIN_ROLE && (
					<CategoryTiles caption={ContentTitle}>
						<CategoryTile caption={TilesTitle} to="/admin/content/tiles" image={tiles} />
					</CategoryTiles>
				)}
			</React.Fragment>
		)}
	</Localized>
);

DashboardView.propTypes = {
	role: PropTypes.any
};

const mapStateToProps = state => ({
	role: authRole(state)
});
 
export default connect(mapStateToProps)(DashboardView);