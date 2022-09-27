import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UpdateForm from 'components/Forms/UpdateForm';
import Forms from './Forms';
import { connect } from 'react-redux';
import { loadJobPosting } from 'redux/actions/employer';
import validate, { getPreview } from './validation';
import Localized from 'components/Localization/Localized';
import ContentMetaTags from 'components/Content/ContentMetaTags';
import errorBoundary from 'components/Decorators/errorBoundary';
import requireRole from 'components/Decorators/requireRole';
import { authDealers, DEALER_ROLES } from 'redux/selectors';
import { normalizeJobPosting, denormalizeJobPosting, canEditJobPosting } from 'redux/helpers';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import { showModal } from 'redux/actions/modals';
import { confirmModal } from 'components/Modals/helpers';
import { publishJobPosting } from 'redux/actions/employer';
import LocalizedNode from 'components/Localization/LocalizedNode';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import { getPrevLink } from 'utils/router';
import { destroy } from 'redux-form';

class JobPostingUpdateView extends Component {
	constructor(props) {
		super(props);

		const { match: { params: { id } }, loadJobPosting, location, destroyForm, form, history } = props;
		
		loadJobPosting({ id });

		if(location.state && location.state.clearForm) {
			destroyForm(form);

			history.replace(location.pathname, {
				...location.state,
				clearForm: false
			});
		}
	}

	state = {}

	componentDidUpdate(prevProps) {
		const { 
			publishState,
			jobPosting,
			loadJobPosting, 
			match: { 
				params: { 
					id 
				}
			},
			destroyForm,
			form
		} = this.props;

		if(prevProps.publishState.loading && !publishState.loading && publishState.result) {
			loadJobPosting({ id });
			destroyForm(form);
		}

		if(prevProps.jobPosting.loading && !jobPosting.loading && jobPosting.result) {
			const initialValues = denormalizeJobPosting(jobPosting.result);

			this.setState({
				initialValues,
				canEdit: canEditJobPosting(initialValues)
			});
		}
	}

	componentWillUnmount() {
		const { destroyForm, form } = this.props;

		if(!this._suppressDestroyForm)
			destroyForm(form);
	}

	handleSubmit = async values => {
		const { history, dealers, location } = this.props;

		const normalized = await normalizeJobPosting(values);
		const preview = getPreview(normalized, dealers);

		const prev = {
			...location,
			state: {
				preview
			}
		};

		this._suppressDestroyForm = true;

		history.push({
			pathname: '/jobs/preview',
			state: {
				preview,
				posting: normalized,
				prev,
				update: true
			}
		});
	}

	handleCancel = () => {
		this._form.reset();
	}

	publish = publish => () => {
		const { publishJobPosting, jobPosting: { result } } = this.props;

		publishJobPosting({ 
			id: result.id,
			isPublished: publish
		});
	}

	handleUnpublish = () => {
		const { showModal } = this.props;

		showModal(confirmModal({
			title: <LocalizedNode names="Employer" groupKey="ConfirmUnpublishTitle" as="h3" />,
			onOk: this.publish(false)
		}));
	}

	handlePublish = () => {
		const { showModal } = this.props;

		showModal(confirmModal({
			title: <LocalizedNode names="Employer" groupKey="ConfirmPublishTitle" as="h3" />,
			onOk: this.publish(true)
		}));
	}

	render() {
		const { jobPosting: { loading }, publishState: { loading: publishLoading }, location, form } = this.props;
		const { initialValues, canEdit } = this.state;

		return (
			<Localized names={['Common', 'Jobs', 'Employer']}>
				{localized => {
					const { UpdateJobPostingTitle, PreviewLabel, UnpublishLabel, MustUnpublishMessage, PublishLabel } = localized;

					let commands;
					if(initialValues) {
						if(!canEdit)
							commands = () => ([
								<PrimaryButton key={0} type="button" onClick={this.handleUnpublish}>
									{UnpublishLabel}
								</PrimaryButton>,
								<p key={1}>{MustUnpublishMessage}</p>
							]);
						else {
							const { isPublished } = initialValues;

							commands = ({ dirty }) => !dirty && (
								<PrimaryButton key={0} type="button" onClick={isPublished ? this.handleUnpublish : this.handlePublish}>
									{isPublished ? UnpublishLabel : PublishLabel}
								</PrimaryButton>
							);
						}
					}

					return (
						<React.Fragment>
							<ContentMetaTags title={UpdateJobPostingTitle} />

							<UpdateForm
								ref={ref => this._form = ref}
								title={<h1>{UpdateJobPostingTitle}</h1>}
								backTo={getPrevLink(location, '/employer/job-postings')}
								forms={Forms}
								initialValues={initialValues}
								form={form}
								destroyOnUnmount={false}
								keepDirtyOnReinitialize
								loading={loading || publishLoading}
								onSubmit={this.handleSubmit}
								onCancel={this.handleCancel}
								validate={validate}
								localized={localized}
								submitText={PreviewLabel}
								readOnly={!canEdit}
								commands={commands} />
						</React.Fragment>
					);
				}}
			</Localized>
		);
	}
}

JobPostingUpdateView.propTypes = {
	form: PropTypes.string,

	match: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired,
	loadJobPosting: PropTypes.func.isRequired,
	jobPosting: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	dealers: PropTypes.array.isRequired,
	showModal: PropTypes.func.isRequired,
	publishJobPosting: PropTypes.func.isRequired,
	publishState: PropTypes.object.isRequired,
	destroyForm: PropTypes.func.isRequired
};

JobPostingUpdateView.defaultProps = {
	form: 'jobPostingUpdate'
};

const mapStateToProps = state => ({
	jobPosting: state.employer.singlePosting,
	dealers: authDealers(state),
	publishState: state.employer.publishPosting
});
 
export default errorBoundary(
	withLocaleRouter(
		connect(mapStateToProps, { 
			loadJobPosting, 
			showModal, 
			publishJobPosting, 
			destroyForm: destroy
		})(requireRole(DEALER_ROLES)(JobPostingUpdateView))));