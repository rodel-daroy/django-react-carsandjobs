import React from 'react';
import PropTypes from 'prop-types';
import WithLocalization from 'components/Localization/WithLocalization';
import { Route, Switch } from 'react-router';
import DashboardView from './components/DashboardView';
import ContentMetaTags from 'components/Content/ContentMetaTags';
import JobStatsView from './components/Reports/JobStatsView';
import ApplicationStatsView from './components/Reports/ApplicationStatsView';
import CreditsView from './components/Reports/CreditsView';
import { REPORTING_ROLES } from 'redux/selectors';
import requireRole from 'components/Decorators/requireRole';
import TransactionsView from './components/Reports/TransactionsView';
import InvoiceView from 'routes/Employer/components/Credit/InvoiceView';
import InvoicesView from './components/Reports/InvoicesView';
import ContentTilesView from './components/Content/ContentTilesView';

const Admin = ({ match: { url } }) => (
	<WithLocalization names={['Common', 'Jobs', 'Employer', 'Admin']}>
		{() => (
			<React.Fragment>
				<ContentMetaTags title="Admin" />

				<Switch>
					<Route path={`${url}/job-stats`} component={JobStatsView} />
					<Route path={`${url}/application-stats`} component={ApplicationStatsView} />
					<Route exact path={`${url}/credits`} component={CreditsView} />
					<Route path={`${url}/credits/invoice/:id`} component={InvoiceView} />
					<Route path={`${url}/transactions`} component={TransactionsView} />
					<Route path={`${url}/invoices`} component={InvoicesView} />
					<Route path={`${url}/content/tiles/:language?/:categoryId?`} component={ContentTilesView} />
					
					<Route exact path={url} component={DashboardView} />
				</Switch>
			</React.Fragment>
		)}
	</WithLocalization>
);

Admin.propTypes = {
	match: PropTypes.object.isRequired
};
 
export default requireRole(REPORTING_ROLES)(Admin);