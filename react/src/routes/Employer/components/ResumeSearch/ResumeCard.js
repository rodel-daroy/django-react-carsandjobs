import React from 'react';
import Card from 'components/Layout/Card';
import { Resume } from 'types/employer';
import { humanizePastDate, formatLocation } from 'utils/format';
import { useSelector } from 'react-redux';
import { language } from 'redux/selectors';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import './ResumeCard.css';

const ResumeCard = ({ resume, ...otherProps }) => {
	const currentLanguage = useSelector(language);

	const handleEmailClick = e => {
		e.preventDefault();
		e.stopPropagation();

		window.open(`mailto:${resume.email}`);
	};

	return (
		<Card 
			{...otherProps}
			
			className="resume-card"
			image={<span className="icon icon-user"></span>}
			age={`Updated ${humanizePastDate(resume.modifiedDate, currentLanguage)}`}
			status={(
				<PrimaryLink as="button" type="button" className="resume-card-email" onClick={handleEmailClick}>
					{resume.email}
				</PrimaryLink>
			)}
			as="a"
			href={resume.url}
			target="_blank"
			rel="noopener noreferrer">

			<div>{resume.firstName} {resume.lastName}</div>
			<div>{formatLocation(resume)}</div>
		</Card>
	);
};

ResumeCard.propTypes = {
	resume: Resume.isRequired
};
 
export default ResumeCard;