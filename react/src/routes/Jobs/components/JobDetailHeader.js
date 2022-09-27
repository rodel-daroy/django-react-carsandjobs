import React from 'react';
import PropTypes from 'prop-types';
import { JobDetail as JobDetailShape } from 'types/jobs';
import { getLanguageValue } from 'utils';
import defaultCompany from './img/default-company.svg';
import Localized from 'components/Localization/Localized';
import { formatLocation } from 'utils/format';
import { useSelector } from 'react-redux';
import { language } from 'redux/selectors';
import './JobDetailHeader.css';

const JobDetailHeader = ({ job, commands: Commands, compact }) => {
	const lang = useSelector(language);

	return (
		<Localized names={['Common', 'Jobs']}>
			{({ AtLabel }) => (
				<header className={`job-detail-header ${compact ? 'compact' : ''}`}>
					<div className="job-detail-header-summary">
						{!compact && (
							<div className="job-detail-header-logo">
								<img src={job.company.logo || defaultCompany} alt={job.company.name} />
							</div>
						)}
						<div className="job-detail-header-summary-body">
							<h2>
								<span>
									{getLanguageValue(job.title, lang)}
								</span>
								{job.company.name && ` ${AtLabel} ${job.company.name}`}
								<br />
								<span className="job-detail-header-location">
									{formatLocation(job)}
								</span>
							</h2>
						</div>
					</div>

					<div className={`job-detail-header-icon ${(job.saved || job.appliedDate) ? 'visible' : ''}`}>
						{job.saved && !job.appliedDate && <span className="icon icon-star"></span>}
						{job.appliedDate && <span className="icon icon-check"></span>}
					</div>

					{Commands && (
						<Commands 
							layout="desktop" 
							job={job} 
							className="job-detail-header-commands" 
							orientation={compact ? 'horizontal' : 'vertical'} />
					)}
				</header>
			)}
		</Localized>
	);
};

JobDetailHeader.propTypes = {
	job: JobDetailShape.isRequired,
	commands: PropTypes.elementType,
	compact: PropTypes.bool
};
 
export default JobDetailHeader;