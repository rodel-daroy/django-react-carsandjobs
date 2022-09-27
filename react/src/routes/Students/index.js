import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router';
import ProgrammeSearchView from './components/Programmes/ProgrammeSearchView';
import DashboardView from './components/DashboardView';
import WithLocalization from 'components/Localization/WithLocalization';

const Students = ({ match: { url } }) => (
	<WithLocalization names={['Jobs', 'Students']}>
		{() => (
			<Switch>
				<Route exact path={url} component={DashboardView} />

				<Route path={`${url}/programs`} component={ProgrammeSearchView} />
			</Switch>
		)}
	</WithLocalization>
);

Students.propTypes = {
	match: PropTypes.object.isRequired
};
 
export default Students;