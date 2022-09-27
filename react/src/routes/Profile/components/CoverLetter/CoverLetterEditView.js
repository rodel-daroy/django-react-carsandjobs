import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CoverLetterForm from './CoverLetterForm';
import { connect } from 'react-redux';
import { loadCoverLetters, addCoverLetter, updateCoverLetter } from 'redux/actions/profile';
import { showModal } from 'redux/actions/modals';
import HeaderStrip from 'components/Layout/HeaderStrip';
import HeaderStripContent from 'components/Layout/HeaderStripContent';
import HeaderStripContentLarge from 'components/Layout/HeaderStripContentLarge';
import { localized } from 'redux/selectors';
import ContentMetaTags from 'components/Content/ContentMetaTags';
import errorBoundary from 'components/Decorators/errorBoundary';
import { passiveModal } from 'components/Modals/helpers';
import { getPrevLink } from 'utils/router';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import './CoverLetterEditView.css';

class CoverLetterEditView extends Component {
	constructor(props) {
		super(props);

		props.loadCoverLetters();
	}

	state = {}

	static getDerivedStateFromProps(props) {
		const { match: { params }, list: { result } } = props;

		if(params.id != null) {
			const coverLetter = (result || []).find(cl => cl.id === params.id);

			return {
				coverLetter
			};
		}
		
		return null;
	}

	componentDidUpdate(prevProps) {
		const { add, update, location, localized } = this.props;

		const wasLoading = prevProps.add.loading || prevProps.update.loading;
		const finishedLoading = (!add.loading && add.result) || (!update.loading && update.result);

		if(wasLoading && finishedLoading) {
			this.props.showModal(passiveModal({
				title: <span>{localized.CoverLetterSavedTitle}</span>,
				redirectTo: getPrevLink(location, '/profile/cover-letters')
			}));
		}
	}

	handleSubmit = values => {
		const { coverLetter } = this.state;
		const { addCoverLetter, updateCoverLetter } = this.props;

		if(coverLetter) {
			const newValues = {
				...coverLetter,
				...values
			};

			updateCoverLetter(newValues);
		}
		else {
			addCoverLetter(values);
		}
	}

	render() {
		const { coverLetter } = this.state;
		const { localized, location } = this.props;
		const loading = this.props.add.loading || this.props.update.loading;

		const editMode = !!coverLetter;

		return (
			<div className="cover-letter-edit-view">
				<ContentMetaTags title={editMode ? localized.UpdateCoverLetterLabel : localized.AddCoverLetterLabel} />

				<HeaderStrip>
					<HeaderStripContentLarge>
						<HeaderStripContent.Back to={getPrevLink(location, '/profile/cover-letters')} />

						<h1>{editMode ? localized.UpdateCoverLetterLabel : localized.AddCoverLetterLabel}</h1>
					</HeaderStripContentLarge>
				</HeaderStrip>

				<div className="cover-letter-edit-view-form">
					<CoverLetterForm 
						initialValues={coverLetter ? coverLetter : { active: true }} 
						onSubmit={this.handleSubmit} 
						loading={loading} />
				</div>
			</div>
		);
	}
}

CoverLetterEditView.propTypes = {
	loadCoverLetters: PropTypes.func.isRequired,
	addCoverLetter: PropTypes.func.isRequired,
	updateCoverLetter: PropTypes.func.isRequired,
	list: PropTypes.object,
	add: PropTypes.object,
	update: PropTypes.object,
	showModal: PropTypes.func.isRequired,
	location: PropTypes.object.isRequired,
	match: PropTypes.object.isRequired,
	localized: PropTypes.object.isRequired
};
 
const mapStateToProps = state => ({
	list: state.profile.coverLetters.list,
	add: state.profile.coverLetters.add,
	update: state.profile.coverLetters.update,
	localized: localized('Profile')(state)
});

export default errorBoundary(withLocaleRouter(connect(mapStateToProps, { loadCoverLetters, addCoverLetter, updateCoverLetter, showModal })(CoverLetterEditView)));