import React from 'react';
import Card from 'components/Layout/Card';
import { Programme } from 'types/education';
import Localized from 'components/Localization/Localized';
import { formatLocation } from 'utils/format';
import './ProgrammeCard.css';

const ProgrammeCard = ({ programme, ...otherProps }) => (
	<Localized names="Students">
		{({ ScholarshipAvailableLabel, CoopLabel, ApprenticeshipLabel }) => (
			<Card 
				{...otherProps}
				
				className="programme-card"
				image={<span className="icon icon-education"></span>}
				age={(
					<React.Fragment>
						{programme.scholarship && <div><span className="icon icon-check"></span> {ScholarshipAvailableLabel}</div>}
					</React.Fragment>
				)}
				status={(
					<React.Fragment>
						<ul className="programme-card-require">
							{programme.coop && <li>{CoopLabel}</li>}
							{programme.apprenticeship && <li>{ApprenticeshipLabel}</li>}
						</ul>
					</React.Fragment>
				)}
				as="a"
				href={programme.url}
				target="_blank"
				rel="noopener noreferrer">

				<Card.Name>{programme.schoolName}</Card.Name>
				<Card.Description>{formatLocation(programme)}</Card.Description>
			</Card>
		)}
	</Localized>
);

ProgrammeCard.propTypes = {
	programme: Programme.isRequired
};
 
export default ProgrammeCard;