import React from 'react';
import PropTypes from 'prop-types';
import CommandBar from 'components/Layout/CommandBar';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import { jobPostingFromTemplate } from './helpers';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import { getNextLink } from 'utils/router';
import { connect } from 'react-redux';
import { authDealers } from 'redux/selectors';
import Localized from 'components/Localization/Localized';

// eslint-disable-next-line no-unused-vars, react/prop-types
const TemplatePreviewCommands = ({ className, template, location, history, dealers, locale, setLocale, match, ...otherProps }) => {
	if(!template)
		return null;

	const handleCreatePosting = () => {
		history.push(getNextLink({
			pathname: '/employer/job-posting',
			state: {
				template: jobPostingFromTemplate(dealers)(template)
			}
		}, location));
	};

	return (
		<Localized names={['Common', 'Employer']}>
			{({ CreateJobPostingFromTemplateLabel }) => (
				<CommandBar {...otherProps} className={`template-preview-commands ${className || ''}`}>
					<PrimaryButton as="button" onClick={handleCreatePosting}>
						{CreateJobPostingFromTemplateLabel}
					</PrimaryButton>
				</CommandBar>
			)}
		</Localized>
	);
};

TemplatePreviewCommands.propTypes = {
	className: PropTypes.string,

	location: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	dealers: PropTypes.array,
	template: PropTypes.object
};

const mapStateToProps = state => ({
	dealers: authDealers(state),
	template: state.employer.template.result
});
 
export default withLocaleRouter(connect(mapStateToProps)(TemplatePreviewCommands));
