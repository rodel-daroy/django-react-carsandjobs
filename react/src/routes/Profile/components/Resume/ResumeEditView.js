import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ResumeForm from './ResumeForm';
import { connect } from 'react-redux';
import { addResume, updateResume, pollResume, pollResumeStop } from 'redux/actions/profile';
import { showModal } from 'redux/actions/modals';
import HeaderStrip from 'components/Layout/HeaderStrip';
import CommandBar from 'components/Layout/CommandBar';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import LocaleLink from 'components/Localization/LocaleLink';
import HeaderStripContent from 'components/Layout/HeaderStripContent';
import HeaderStripContentLarge from 'components/Layout/HeaderStripContentLarge';
import Localized from 'components/Localization/Localized';
import LocalizedNode from 'components/Localization/LocalizedNode';
import ContentMetaTags from 'components/Content/ContentMetaTags';
import errorBoundary from 'components/Decorators/errorBoundary';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import './ResumeEditView.css';

class ResumeEditView extends Component {
	constructor(props) {
		super(props);

		const { match: { params }, pollResume } = props;

		if(params.id)
			pollResume({ id: params.id });
	}

	state = {}

	componentDidUpdate(prevProps) {
		const { add, update, match: { params }, pollResume, showModal, poll } = this.props;

		if(params.id !== prevProps.match.params.id)
			pollResume({ id: params.id });

		if(poll !== prevProps.poll)
			this.setState({
				resume: poll.result
			});

		const wasLoading = prevProps.add.loading || prevProps.update.loading;
		const finishedLoading = (!add.loading && add.result) || (!update.loading && update.result);

		if(wasLoading && finishedLoading) {
			const result = poll.result || add.result;
			const { id, processing } = result;

			pollResume({ id });

			showModal({
				title: <LocalizedNode as="h3" names={['Common', 'Profile']} groupKey="ResumeSavedTitle" />,
				content: ({ close }) => (
					<Localized names={['Common', 'Profile']}>
						{({ PDFProcessingLabel, ReturnToResumesLabel, ContinueEditingLabel }) => (
							<div>
								{processing && <p>{PDFProcessingLabel}</p>}

								<CommandBar>
									<PrimaryButton as={LocaleLink} to="/profile/resumes" onClick={close} iconClassName="icon icon-angle-left" hasIcon>
										{ReturnToResumesLabel}
									</PrimaryButton>

									<PrimaryLink as={LocaleLink} to={`/profile/resume/${id}`} onClick={() => close(false)}>
										{ContinueEditingLabel}
									</PrimaryLink>
								</CommandBar>
							</div>
						)}
					</Localized>
				),
				redirectTo: '/profile/resumes'
			});
		}
	}

	componentWillUnmount() {
		this.props.pollResumeStop();
	}

	handleSubmit = values => {
		const { resume } = this.state;
		const { addResume, updateResume } = this.props;

		if(values.file instanceof Array)
			values.file = values.file[0];

		if(resume) {
			const newValues = {
				...resume,
				...values
			};

			updateResume(newValues);
		}
		else {
			addResume(values);
		}
	}

	render() {
		let { resume } = this.state;
		const loading = this.props.add.loading || this.props.update.loading || this.props.poll.loading;

		const editMode = !!resume;

		const defaultValues = {
			active: true,
			searchable: true
		};

		return (
			<Localized names={['Common', 'Profile']}>
				{({ UpdateResumeTitle, AddResumeTitle }) => (
					<div className="resume-edit-view">
						<ContentMetaTags title={editMode ? UpdateResumeTitle : AddResumeTitle} />

						<HeaderStrip className="resume-edit-view-hs">
							<HeaderStripContentLarge>
								<HeaderStripContent.Back to="/profile/resumes" />

								<h1>{editMode ? UpdateResumeTitle : AddResumeTitle}</h1>
							</HeaderStripContentLarge>
						</HeaderStrip>

						<div className="resume-edit-view-form">
							<ResumeForm 
								initialValues={resume ? resume : defaultValues} 
								onSubmit={this.handleSubmit} 
								loading={loading} 
								fileUrl={resume ? resume.url : null}
								processing={(resume || {}).processing} />
						</div>
					</div>
				)}
			</Localized>
		);
	}
}

ResumeEditView.propTypes = {
	addResume: PropTypes.func.isRequired,
	updateResume: PropTypes.func.isRequired,
	pollResume: PropTypes.func.isRequired,
	pollResumeStop: PropTypes.func.isRequired,
	list: PropTypes.object,
	add: PropTypes.object,
	update: PropTypes.object,
	poll: PropTypes.object,
	showModal: PropTypes.func.isRequired,
	location: PropTypes.object.isRequired,
	match: PropTypes.object.isRequired
};
 
const mapStateToProps = state => ({
	list: state.profile.resumes.list,
	add: state.profile.resumes.add,
	update: state.profile.resumes.update,
	poll: state.profile.resumes.poll
});

export default errorBoundary(withLocaleRouter(connect(mapStateToProps, { addResume, updateResume, showModal, pollResume, pollResumeStop })(ResumeEditView)));