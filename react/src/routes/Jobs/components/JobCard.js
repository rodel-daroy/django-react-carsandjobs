import React from 'react';
import PropTypes from 'prop-types';
import { JobHeader } from 'types/jobs';
import { humanizePastDate, formatLocation } from 'utils/format';
import defaultCompany from './img/default-company.svg';
import Card from 'components/Layout/Card';
import Localized from 'components/Localization/Localized';
import { connect } from 'react-redux';
import { language } from 'redux/selectors';
import { getLanguageValue } from 'utils';
import { placeholder } from 'components/Layout/Placeholder';
import './JobCard.css';

// eslint-disable-next-line no-unused-vars
const JobCard = ({ job, jobAge, language, dispatch, ...otherProps }) => {
	if(!job.company)
		job = {
			...job, 
			company: {}
		};

	return (
		<Localized names={['Common', 'Jobs']}>
			{({ SavedLabel, AppliedLabel }) => (
				<Card
					{...otherProps}
					
					className="job-card"
					active
					image={(
						<img src={job.company.logo || defaultCompany} alt={job.company.name} />
					)}
					age={jobAge({ job, language })}
					status={(
						<React.Fragment>
							{job.saved && !job.appliedDate && (
								<span className="icon icon-star" title={SavedLabel}></span>
							)}

							{job.appliedDate && (
								<span className="icon icon-check" title={AppliedLabel}></span>
							)}
						</React.Fragment>
					)}>

					<Card.Name>{getLanguageValue(job.title, language)}</Card.Name>
					{job.company.name && (
						<Card.Description>{job.company.name}</Card.Description>
					)}
					<span className="job-card-location">
						<Card.Description>{formatLocation(job)}</Card.Description>
					</span>
				</Card>
			)}
		</Localized>
	);
};

JobCard.propTypes = {
	job: JobHeader.isRequired,
	jobAge: PropTypes.func,

	language: PropTypes.string.isRequired,
	dispatch: PropTypes.func
};

JobCard.defaultProps = {
	jobAge: ({ job, language }) => humanizePastDate(job.postDate, language)
};

const mapStateToProps = state => ({
	language: language(state)
});

export default placeholder('job-card-placeholder')(connect(mapStateToProps)(JobCard));