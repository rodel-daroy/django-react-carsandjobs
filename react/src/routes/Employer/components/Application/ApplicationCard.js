import React from 'react';
import Card from 'components/Layout/Card';
import { Application } from 'types/employer';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import './ApplicationCard.css';

const ApplicationCard = ({ application, ...otherProps }) => (
	<Card 
		{...otherProps}
		
		className="application-card"
		image={<span className="icon icon-user"></span>}
		rightActions={(
			<div className="application-card-commands">
				<PrimaryLink 
					as="a" 
					href={application.resumeUrl} 
					target="_blank"
					hasIcon
					iconClassName="icon icon-doc-text-inv"
					className="application-card-resume"
					title="View resume"
					disabled={!application.resumeUrl} />
					
				<PrimaryLink
					as="a"
					href={`mailto:${application.email}`}
					target="_blank"
					hasIcon
					iconClassName="icon icon-mail"
					className="application-card-email"
					title="Email" />
			</div>
		)}>

		<Card.Name>{application.firstName} {application.lastName}</Card.Name>
		<Card.Description>{application.email}</Card.Description>
	</Card>
);

ApplicationCard.propTypes = {
	application: Application.isRequired
};
 
export default ApplicationCard;