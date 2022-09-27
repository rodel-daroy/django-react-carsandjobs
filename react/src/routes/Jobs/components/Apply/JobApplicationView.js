import React, { Component } from 'react';
import PropTypes from 'prop-types';
import JobApplicationForm from './JobApplicationForm';
import ViewPanel from 'components/Layout/ViewPanel';
import { connect } from 'react-redux';
import { apply, loadJobDetail } from 'redux/actions/jobs';
import { loadProfile } from 'redux/actions/profile';
import { showModal } from 'redux/actions/modals';
import LoadingOverlay from 'components/Common/LoadingOverlay';
import JobCard from '../JobCard';
import EmptyState from 'components/Layout/EmptyState';
import Localized from 'components/Localization/Localized';
import LocalizedNode from 'components/Localization/LocalizedNode';
import errorBoundary from 'components/Decorators/errorBoundary';
import HeaderStrip from 'components/Layout/HeaderStrip';
import HeaderStripContent from 'components/Layout/HeaderStripContent';
import HeaderStripContentLarge from 'components/Layout/HeaderStripContentLarge';
import requireRole from 'components/Decorators/requireRole';
import { JOBSEEKER_ROLE, language } from 'redux/selectors';
import TabSet from 'components/Navigation/TabSet';
import VitalsGroup from 'components/Layout/VitalsGroup';
import { parseMarkdown } from 'utils/format';
import ContentMetaTags from 'components/Content/ContentMetaTags';
import { getLanguageValue } from 'utils';
import { passiveModal } from 'components/Modals/helpers';
import IndeedConversion from './IndeedConversion';
import { getPrevLink } from 'utils/router';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import './JobApplicationView.css';

const CONTACT_LABELS = {
	mailingAddress: 'MailLabel',
	fax: 'FaxLabel',
	email: 'EmailLabel',
	phone: 'PhoneLabel',
	website: 'WebsiteLabel'
};

class JobApplicationView extends Component {
	constructor(props) {
		super(props);

		props.loadProfile();
	}

	state = {}

	static getDerivedStateFromProps(props, state) {
		const { match: { params: { jobId } }, language } = props;

		if(jobId !== state.jobId || language !== state.language)
			props.loadJobDetail({ id: jobId, language });

		return {
			jobId,
			language
		};
	}

	componentDidUpdate(prevProps) {
		const { applications } = this.props;

		if(applications !== prevProps.applications) {
			if(applications.result && !applications.loading)
				this.showApplicationSubmitted();
		}
	}

	showApplicationSubmitted() {
		const { showModal, location, jobDetail: { result } } = this.props;

		showModal(passiveModal({
			title: <LocalizedNode names={['Common', 'Jobs']} groupKey="ApplicationSubmittedTitle" />,
			content: (
				<div className="job-application-modal">
					<JobCard as="div" clickable={false} job={result} />

					<IndeedConversion />
				</div>
			),
			redirectTo: getPrevLink(location)
		}));
	}

	handleSubmit = values => {
		const { coverLetters } = this.props;
		const { coverLetterText, coverLetterId, ...otherProps } = values;

		const application = {
			...otherProps,

			jobId: this.state.jobId,
			coverLetterText: coverLetterText || (coverLetters.find(cl => cl.id === coverLetterId) || {}).text
		};

		this.props.apply(application);
	}

	handleCancel = () => {
		const { location, history } = this.props;

		history.push(getPrevLink(location));
	}

	getContactMethods() {
		const { jobDetail: { result } } = this.props;

		if(result) {
			const { contact } = result;

			let res = {};
			for(const [key, value] of Object.entries(contact)) {
				if(value && value.trim().length > 0)
					res[key] = value;
			}

			return res;
		}
		else
			return {};
	}

	renderContactMethods = () => {
		const methods = this.getContactMethods();

		if(Object.keys(methods).length > 0) {
			return (
				<Localized names={['Common', 'Jobs']}>
					{localized => (
						<VitalsGroup>
							{Object.keys(methods).map(key => (
								<VitalsGroup.Vital key={key} caption={localized[CONTACT_LABELS[key]]}>
									<div dangerouslySetInnerHTML={{ __html: parseMarkdown(methods[key]) }}>
									</div>
								</VitalsGroup.Vital>
							))}
						</VitalsGroup>
					)}
				</Localized>
			);
		}
		else
			return null;
	}

	render() { 
		const { applications: { loading }, jobDetail, profile, location, language } = this.props;

		const initialValues = {
			firstName: profile.firstName,
			lastName: profile.lastName,
			email: profile.email,
			cellphone: profile.cellphone
		};

		const methodCount = Object.keys(this.getContactMethods()).length;

		if(!jobDetail.loading && !jobDetail.error && jobDetail.result)
			return (
				<Localized names={['Common', 'Jobs']}>
					{({ ApplyForTitle, ApplyOnlineLabel, ApplyOtherWaysLabel, AtLabel }) => {
						const { company, title } = jobDetail.result;
						const companyName = company ? company.name : null;

						let pageTitle = `${ApplyForTitle} ${getLanguageValue(title, language)}`;
						if(companyName)
							pageTitle += ` ${AtLabel} ${companyName}`;

						return (
							<ViewPanel className="job-application-view">
								<ContentMetaTags title={pageTitle} />

								<HeaderStrip>
									<HeaderStripContentLarge>
										<HeaderStripContent.Back to={getPrevLink(location)} />

										<h1>{ApplyForTitle}</h1>
									</HeaderStripContentLarge>
								</HeaderStrip>

								<div className="job-application-view-inner">
									<div className="job-application-view-card">
										<JobCard job={jobDetail.result} as="div" clickable={false} />
									</div>

									<TabSet className="job-application-view-tabs" name="jobApplicationTabs">
										<TabSet.Tab caption={ApplyOnlineLabel}>
											{() => (
												<div className="job-application-view-tab">
													<JobApplicationForm 
														form="jobApplication" 
														onSubmit={this.handleSubmit} 
														initialValues={initialValues}
														loading={loading}
														onCancel={this.handleCancel} />

													{loading && <LoadingOverlay />}
												</div>
											)}
										</TabSet.Tab>

										{methodCount > 0 && (
											<TabSet.Tab caption={ApplyOtherWaysLabel}>
												{() => (
													<div className="job-application-view-tab">
														{this.renderContactMethods()}
													</div>
												)}
											</TabSet.Tab>
										)}
									</TabSet>
								</div>
							</ViewPanel>
						);
					}}
				</Localized>
			);
		else {
			if(jobDetail.error)
				return <EmptyState>{jobDetail.error.message}</EmptyState>;
			else
				return <EmptyState.Loading />;
		}
	}
}

JobApplicationView.propTypes = {
	location: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	match: PropTypes.object.isRequired,
	apply: PropTypes.func.isRequired,
	applications: PropTypes.object.isRequired,
	showModal: PropTypes.func.isRequired,
	loadJobDetail: PropTypes.func.isRequired,
	jobDetail: PropTypes.object.isRequired,
	loadProfile: PropTypes.func.isRequired,
	profile: PropTypes.object,
	coverLetters: PropTypes.array,
	language: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
	applications: state.jobs.applications.apply,
	jobDetail: state.jobs.jobDetail,
	profile: state.profile.profile.result || {},
	coverLetters: state.profile.coverLetters.list.result || [],
	language: language(state)
});
 
export default errorBoundary(requireRole(JOBSEEKER_ROLE)(withLocaleRouter(connect(mapStateToProps, { apply, showModal, loadJobDetail, loadProfile })(JobApplicationView))));