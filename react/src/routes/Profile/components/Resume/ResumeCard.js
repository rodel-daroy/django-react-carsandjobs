import React from 'react';
import PropTypes from 'prop-types';
import { Resume } from 'types/profile';
import { humanizePastDate } from 'utils/format';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import CheckboxField from 'components/Forms/CheckboxField';
import Card from 'components/Layout/Card';
import Localized from 'components/Localization/Localized';
import { language } from 'redux/selectors';
import { useSelector } from 'react-redux';
import './ResumeCard.css';

const ResumeCard = ({ resume, onSetActive, onDelete, ...otherProps }) => {
	const currentLanguage = useSelector(language);

	return (
		<Localized names={['Common', 'Profile']}>
			{({ ModifiedLabel, SearchableLabel, ActiveLabel, InactiveLabel }) => (
				<Card
					{...otherProps}
					
					className="resume-card"
					active={resume.active}
					image={<span className="icon icon-doc-text-inv"></span>}
					age={`${ModifiedLabel} ${humanizePastDate(resume.modifiedDate, currentLanguage)}`}
					status={(
						<React.Fragment>
							<span className="icon icon-eye" style={{ visibility: 'hidden' }}></span>
							
							{resume.searchable && resume.active && (
								<React.Fragment>
									<span className="icon icon-eye"></span>
									{SearchableLabel}
								</React.Fragment>
							)}

							{!resume.searchable && resume.active && (
								<React.Fragment>
									<span className="icon icon-check"></span>
									{ActiveLabel}
								</React.Fragment>
							)}

							{!resume.active && InactiveLabel}
						</React.Fragment>
					)}
					leftActions={(
						<div className="resume-card-check">
							<CheckboxField offState checked={resume.active} onChange={() => onSetActive(resume, !resume.active)} />
						</div>
					)}
					rightActions={(
						<PrimaryLink as="button" className="resume-card-delete" type="button" onClick={() => onDelete(resume)}>
							<span className="icon icon-delete"></span>
						</PrimaryLink>
					)}>

					<Card.Name>{resume.name}</Card.Name>
					<Card.Description>{resume.description}</Card.Description>
				</Card>
			)}
		</Localized>
	);
};

ResumeCard.propTypes = {
	resume: Resume.isRequired,
	onDelete: PropTypes.func,
	onSetActive: PropTypes.func
};

export default ResumeCard;