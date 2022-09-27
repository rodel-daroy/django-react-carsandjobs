import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadLookups } from 'redux/actions/jobs';
import { apiResultSelector } from 'utils/redux';
import { JobFilter as JobFilterShape } from 'types/jobs';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import Localized from 'components/Localization/Localized';

class JobFilter extends Component {
	constructor(props) {
		super(props);

		this.state = {
			displayFilter: {}
		};

		props.loadLookups();
	}

	static getDerivedStateFromProps(props) {
		const { filter, lookups } = props;

		const lookupName = (id, lookup) => ((lookup || []).find(l => l.id === id) || {}).name;

		if(filter && lookups) {
			const { departments } = lookups;

			return {
				displayFilter: {
					...filter,

					department: lookupName(filter.department, departments)
				}
			};
		}
		else
			return null;
	}

	render() {
		const { jobs } = this.props;
		const { totalCount } = jobs || {};

		const { displayFilter } = this.state;

		const renderTitle = ({ JobsFoundLabel, JobsCountLabel }) => {
			if(Object.values(displayFilter).filter(v => !!v).length > 0)
				return (
					<React.Fragment>
						<strong>{totalCount} {JobsFoundLabel}&nbsp;</strong>
					</React.Fragment>
				);
			else
				return (
					<strong>{totalCount} {JobsCountLabel}</strong>
				);
		};

		return (
			<div className="job-filter">
				{totalCount != null && (
					<Localized names={['Common', 'Jobs']}>
						{renderTitle}
					</Localized>
				)}
			</div>
		);
	}
}

JobFilter.propTypes = {
	filter: JobFilterShape,
	
	jobs: PropTypes.object,
	loadLookups: PropTypes.func.isRequired,
	lookups: PropTypes.object,
	location: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	jobs: apiResultSelector('jobs.jobs')(state),
	lookups: state.jobs.lookups
});

export default withLocaleRouter(connect(mapStateToProps, { loadLookups })(JobFilter));