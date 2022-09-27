import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { JobDetail } from 'types/jobs';
import VitalsGroup from 'components/Layout/VitalsGroup';
import { connect } from 'react-redux';
import { loadLookups } from 'redux/actions/jobs';
import { humanizePastDate, formatDate, formatLocation } from 'utils/format';
import Localized from 'components/Localization/Localized';
import moment from 'moment';
import { language } from 'redux/selectors';
import { getLanguageValue } from 'utils';
import './JobVitals.css';

const formatAddress = ({ location = {} }) => {
	let result = '';
	for(const key of ['address', 'city', 'province', 'postalCode'])
		if(location[key]) {
			if(result.length > 0)
				result += (key === 'postalCode') ? ' ' : ', ';

			result += location[key];
		}

	return result;
};

class JobVitals extends Component {
	constructor(props) {
		super(props);

		props.loadLookups();
	}

	render() {
		const { job, lookups, language } = this.props;

		const lookupValue = (value, lookup) => {
			if(value && lookup) {
				const item = lookup.find(l => l.id === value);
				if(item)
					return item.name[language];
				else
					return null;
			}
			else
				return null;
		};

		if(lookups) {
			let department;
			if(job.department)
				department = (
					<ul>
						{job.department.map((d, i) => (
							<li key={i}>
								{lookupValue(d, lookups.departments)}
							</li>
						))}
					</ul>
				);

			return (
				<Localized names={['Common', 'Jobs']}>
					{({ 
						CompanyLabel, 
						LocationLabel, 
						SalaryLabel, 
						PositionTypeLabel, 
						DepartmentsLabel,
						ExperienceLabel,
						EducationLabel,
						PostedLabel,
						ClosesLabel,
						AddressLabel
					}) => (
						<div className="job-vitals">
							<VitalsGroup className="job-vitals-group">
								<VitalsGroup.Vital caption={CompanyLabel}>
									{job.company.name}
								</VitalsGroup.Vital>
								<VitalsGroup.Vital caption={LocationLabel}>
									{formatLocation(job)}
								</VitalsGroup.Vital>
								<VitalsGroup.Vital caption={AddressLabel}>
									{formatAddress(job)}
								</VitalsGroup.Vital>
							</VitalsGroup>

							<VitalsGroup className="job-vitals-group">
								<VitalsGroup.Vital caption={SalaryLabel}>
									{getLanguageValue(job.salary, language)}
								</VitalsGroup.Vital>
								<VitalsGroup.Vital caption={PositionTypeLabel}>
									{lookupValue(job.positionType, lookups.positionTypes)}
								</VitalsGroup.Vital>
							</VitalsGroup>

							<VitalsGroup className="job-vitals-group">
								<VitalsGroup.Vital caption={DepartmentsLabel}>
									{department}
								</VitalsGroup.Vital>
							</VitalsGroup>

							<VitalsGroup className="job-vitals-group">
								<VitalsGroup.Vital caption={ExperienceLabel}>
									{lookupValue(job.experience, lookups.experiences)}
								</VitalsGroup.Vital>
								<VitalsGroup.Vital caption={EducationLabel}>
									{lookupValue(job.education, lookups.educations)}
								</VitalsGroup.Vital>
							</VitalsGroup>

							<VitalsGroup className="job-vitals-group">
								<VitalsGroup.Vital caption={PostedLabel}>
									<time dateTime={moment(job.postDate).toISOString()}>
										{humanizePastDate(job.postDate, language)}
									</time>
								</VitalsGroup.Vital>
								<VitalsGroup.Vital caption={ClosesLabel}>
									<time dateTime={moment(job.closingDate).toISOString()}>
										{formatDate(job.closingDate, language)}
									</time>
								</VitalsGroup.Vital>
							</VitalsGroup>
						</div>
					)}
				</Localized>
			);
		}
		else
			return null;
	}
}

JobVitals.propTypes = {
	job: JobDetail.isRequired,

	loadLookups: PropTypes.func.isRequired,
	lookups: PropTypes.object,
	language: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
	lookups: state.jobs.lookups,
	language: language(state)
});

export default connect(mapStateToProps, { loadLookups })(JobVitals);