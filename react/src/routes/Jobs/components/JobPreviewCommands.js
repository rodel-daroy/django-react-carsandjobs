import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CommandBar from 'components/Layout/CommandBar';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import { connect } from 'react-redux';
import { JobDetail } from 'types/jobs';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import Localized from 'components/Localization/Localized';
import { createJobPosting, updateJobPosting } from 'redux/actions/employer';
import { showModal } from 'redux/actions/modals';
import { passiveModal } from 'components/Modals/helpers';

class JobPreviewCommands extends Component {
	componentDidUpdate(prevProps) {
		const { 
			createPostingState: { 
				loading: createLoading,
				result: created,
				error: createError
			}, 
			updatePostingState: { 
				loading: updateLoading,
				result: updated,
				error: updateError
			},
			showModal
		} = this.props;

		const finishedCreating = !createLoading && prevProps.createPostingState.loading && !createError;
		const finishedUpdating = !updateLoading && prevProps.updatePostingState.loading && !updateError;

		if(finishedCreating || finishedUpdating) {
			const result = finishedCreating ? created : updated;

			const titleKey = result.isPublished ? 'JobPublishedTitle' : 'JobSavedAsDraftTitle';

			showModal(passiveModal({
				title: (
					<Localized names={['Common', 'Jobs']}>
						{({ [titleKey]: title }) => <span>{title}</span>}
					</Localized>
				),
				content: () => null,
				redirectTo: '/employer/job-postings'
			}));
		}
	}

	render() {
		/* eslint-disable no-unused-vars */
		const { 
			job, 
			location, 
			match, 
			history, 
			className, 
			createJobPosting, 
			updateJobPosting,
			createPostingState: { loading: createLoading }, 
			updatePostingState: { loading: updateLoading },
			showModal,

			...otherProps 
		} = this.props;
		/* eslint-enable */

		const posting = location.state.posting;
		const isUpdate = location.state.update;

		const canSaveAsDraft = !isUpdate || !posting.isPublished;

		const savePosting = isUpdate ? updateJobPosting : createJobPosting;

		const handlePublish = () => {
			savePosting({
				...posting,
				isPublished: true
			});
		};

		const handleSaveAsDraft = () => {
			/* eslint-disable no-unused-vars */
			const { postDate, closingDate, ...otherPosting } = posting;
			/* eslint-enable no-unused-cars */

			savePosting({
				...otherPosting,

				isPublished: false
			});
		};

		if(job) {
			const loading = createLoading || updateLoading;
			
			return (
				<Localized names={['Common', 'Jobs']}>
					{({ SaveAsDraftLabel, PublishLabel, PublishChangesLabel }) => {
						let publishButton;
						if(isUpdate && posting.isPublished)
							publishButton = (
								<PrimaryButton 
									as="button" 
									type="button" 
									onClick={handlePublish}
									disabled={loading}>

									{PublishChangesLabel}
								</PrimaryButton>
							);
						else
							publishButton = (
								<PrimaryLink 
									as="button" 
									type="button" 
									hasIcon 
									iconClassName="icon icon-check" 
									onClick={handlePublish}
									disabled={loading}>

									{PublishLabel}
								</PrimaryLink>
							);

						return (
							<CommandBar {...otherProps} className={`job-preview-commands ${className || ''}`}>
								{canSaveAsDraft && (
									<PrimaryButton onClick={handleSaveAsDraft} disabled={loading}>
										{SaveAsDraftLabel}
									</PrimaryButton>
								)}
								{publishButton}
							</CommandBar>
						);
					}}
				</Localized>
			);
		}
		else
			return null;
	}
}

JobPreviewCommands.propTypes = {
	job: JobDetail,
	className: PropTypes.string,

	location: PropTypes.object.isRequired,
	match: PropTypes.object,
	history: PropTypes.object,
	createJobPosting: PropTypes.func.isRequired,
	updateJobPosting: PropTypes.func.isRequired,
	createPostingState: PropTypes.object.isRequired,
	updatePostingState: PropTypes.object.isRequired,
	showModal: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	createPostingState: state.employer.createPosting,
	updatePostingState: state.employer.updatePosting
});
 
export default withLocaleRouter(connect(mapStateToProps, { createJobPosting, updateJobPosting, showModal })(JobPreviewCommands));