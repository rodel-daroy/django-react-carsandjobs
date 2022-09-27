import React from 'react';
import Sticky from 'react-sticky-el';
import { Application } from 'types/employer';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import { parseMarkdown } from 'utils/format';
import EmptyState from 'components/Layout/EmptyState';
import ApplicationDetailCommands from './ApplicationDetailCommands';
import './ApplicationDetail.css';

const ApplicationDetail = ({ application }) => (
	<div className="application-detail">
		<div className="application-detail-header-outer">
			<Sticky scrollElement=".application-detail">
				<header className="application-detail-header">
					<div className="application-detail-summary">
						<div className="application-detail-logo">
							<span className="icon icon-user"></span>
						</div>
						<div className="application-detail-summary-body">
							<h2>
								{application.firstName} {application.lastName}
							</h2>
							<h3>
								<PrimaryLink 
									as="a" 
									href={`mailto:${application.email}`} 
									target="_blank" 
									rel="noopener noreferrer">

									{application.email}
								</PrimaryLink>
							</h3>
						</div>
					</div>

					<ApplicationDetailCommands application={application} layout="desktop" orientation="vertical" />
				</header>
			</Sticky>
		</div>

		<div className="application-detail-body">
			{application.coverLetterText && (
				<div 
					className="application-detail-body-inner" 
					dangerouslySetInnerHTML={{ 
						__html: parseMarkdown(application.coverLetterText) 
					}}>
				</div>
			)}

			{!application.coverLetterText && (
				<EmptyState className="application-detail-empty">
					No cover letter included
				</EmptyState>
			)}
		</div>
	</div>
);

ApplicationDetail.propTypes = {
	application: Application.isRequired
};

export default ApplicationDetail;