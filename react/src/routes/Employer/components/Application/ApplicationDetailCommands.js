import React from 'react';
import PropTypes from 'prop-types';
import { Application } from 'types/employer';
import CommandBar from 'components/Layout/CommandBar';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import './ApplicationDetailCommands.css';

const ApplicationDetailCommands = ({ application, className, ...otherProps }) => (
	<CommandBar 
		{...otherProps}
		className={`application-detail-commands ${className || ''}`}>

		<PrimaryButton size="medium" as="a" href={application.resumeUrl} target="_blank" disabled={!application.resumeUrl}>
			View&nbsp;resume
		</PrimaryButton>

		{application.videoUrl && (
			<PrimaryLink as="a" href={application.videoUrl} target="_blank" iconClassName="icon icon-video" hasIcon>
				Video link
			</PrimaryLink>
		)}

		{!application.videoUrl && (
			<div className="application-detail-commands-no-video">
				<span className="icon icon-video"></span> No video link included
			</div>
		)}
	</CommandBar>
);

ApplicationDetailCommands.propTypes = {
	application: Application.isRequired,
	className: PropTypes.string
};
 
export default ApplicationDetailCommands;