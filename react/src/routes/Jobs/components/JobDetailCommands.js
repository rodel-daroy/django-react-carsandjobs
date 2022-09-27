import React from 'react';
import PropTypes from 'prop-types';
import CommandBar from 'components/Layout/CommandBar';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import { connect } from 'react-redux';
import { saveJob, unsaveJob } from 'redux/actions/jobs';
import { JobDetail } from 'types/jobs';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import LocaleLink from 'components/Localization/LocaleLink';
import { humanizePastDate } from 'utils/format';
import Localized from 'components/Localization/Localized';
import { getNextLink } from 'utils/router';
import { language } from 'redux/selectors';
import { useSelector } from 'react-redux';
import './JobDetailCommands.css';

// eslint-disable-next-line no-unused-vars, react/prop-types
const JobDetailCommands = ({ job, saveJob, unsaveJob, location, match, history, className, preview, setLocale, locale, ...otherProps }) => {
	const handleSaveJob = () => saveJob({ id: job.id });
	const handleUnsaveJob = () => unsaveJob({ id: job.id });

	const currentLanguage = useSelector(language);

	if(job) {
		const applyTo = getNextLink(`/jobs/apply/${job.id}`, location);

		return (
			<Localized names={['Common', 'Jobs']}>
				{({ ApplyLabel, AppliedLabel, SaveLabel, UnsaveLabel }) => (
					<CommandBar {...otherProps} className={`job-detail-commands ${className || ''}`}>
						{!job.appliedDate && <PrimaryButton as={preview ? 'div' : LocaleLink} to={applyTo} disabled={preview}>{ApplyLabel}</PrimaryButton>}
						{job.appliedDate && (
							<div className="job-detail-commands-applied">
								<span className="icon icon-check"></span> {AppliedLabel} {humanizePastDate(job.appliedDate, currentLanguage)}
							</div>
						)}

						{!job.appliedDate && (
							<PrimaryLink 
								as="button"
								hasIcon
								iconClassName={`icon icon-star${job.saved ? '' : '-empty'}`}
								onClick={job.saved ? handleUnsaveJob : handleSaveJob}
								disabled={preview}>

								{job.saved ? UnsaveLabel : SaveLabel}
							</PrimaryLink>
						)}
					</CommandBar>
				)}
			</Localized>
		);
	}
	else
		return null;
};

JobDetailCommands.propTypes = {
	job: JobDetail,
	className: PropTypes.string,
	preview: PropTypes.bool,

	saveJob: PropTypes.func.isRequired,
	unsaveJob: PropTypes.func.isRequired,
	location: PropTypes.object.isRequired,
	match: PropTypes.object,
	history: PropTypes.object
};
 
export default withLocaleRouter(connect(null, { saveJob, unsaveJob })(JobDetailCommands));