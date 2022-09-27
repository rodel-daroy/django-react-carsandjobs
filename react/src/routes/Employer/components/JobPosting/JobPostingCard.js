import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from 'components/Layout/Card';
import { connect } from 'react-redux';
import { loadLookups } from 'redux/actions/jobs';
import { language } from 'redux/selectors';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import LocaleLink from 'components/Localization/LocaleLink';
import moment from 'moment';
import { formatDate } from 'utils/format';
import { JobPosting } from 'types/employer';
import Localized from 'components/Localization/Localized';
import { getLanguageValue } from 'utils';
import { isJobPostingOpen, isJobPostingClosed } from 'redux/helpers';
import { getNextLink } from 'utils/router';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import './JobPostingCard.css';

class JobPostingCard extends Component {
	constructor(props) {
		super(props);

		props.loadLookups();
	}

	render() {
		/* eslint-disable no-unused-vars */
		const { item, lookups: { positionTypes, departments }, language, loadLookups, onPublish, location, ...otherProps } = this.props;
		/* eslint-enable */

		const positionType = (positionTypes || []).find(p => p.id === item.positionType);
		const department = (departments || []).find(d => d.id === item.department);

		const active = moment(item.closingDate).isAfter(moment());

		const title = getLanguageValue(item.title, language);

		const republish = item.isPublishedEver;

		return (
			<Localized names={['Common', 'Jobs', 'Employer']}>
				{({ ResponsesLabel, ClosingLabel, ClosedLabel, ViewsLabel }) => (
					<Card 
						{...otherProps} 
						
						className={`job-posting-card ${isJobPostingOpen(item) ? 'open' : ''} ${isJobPostingClosed(item) ? 'closed' : ''}`}
						to={`/jobs/detail?id=${item.id}`}
						active={active}
						age={`${active ? ClosingLabel : ClosedLabel} ${formatDate(item.closingDate, language)}`}
						status={`${item.views} ${(ViewsLabel || '').toLowerCase()}`}
						leftActions={(
							<div className="job-posting-card-commands">
								<PrimaryLink 
									as={LocaleLink} 
									className="job-posting-card-edit" 
									to={getNextLink(`/employer/job-posting/${item.id}`, location)}>

									<span className="icon icon-edit"></span>
								</PrimaryLink>

								<PrimaryLink 
									as="button"
									type="button" 
									className="job-posting-card-publish" 
									onClick={onPublish}>

									<span className={`icon icon-${republish ? 'refresh' : 'megaphone'}`}></span>
								</PrimaryLink>
							</div>
						)}
						rightActions={(
							<React.Fragment>
								<div className="job-posting-card-responses">
									<div className="job-posting-card-title">{ResponsesLabel}</div>
									<PrimaryLink 
										className="job-posting-card-count" 
										as={LocaleLink}
										to={getNextLink(`/employer/job-posting/${item.id}/applications`, location)}
										size="large">

										<span>{item.jobApplications}</span>
									</PrimaryLink>
								</div>
							</React.Fragment>
						)}>

						<Card.Name>{title}</Card.Name>
						<Card.Description>{positionType ? positionType.name[language] : null}</Card.Description>
						<Card.Description>{department ? department.name[language] : null}</Card.Description>
					</Card>
				)}
			</Localized>
		);
	}
}

JobPostingCard.propTypes = {
	item: JobPosting.isRequired,
	onPublish: PropTypes.func,

	lookups: PropTypes.object.isRequired,
	loadLookups: PropTypes.func.isRequired,
	language: PropTypes.string.isRequired,
	location: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	lookups: state.jobs.lookups,
	language: language(state)
});
 
export default withLocaleRouter(connect(mapStateToProps, { loadLookups })(JobPostingCard));