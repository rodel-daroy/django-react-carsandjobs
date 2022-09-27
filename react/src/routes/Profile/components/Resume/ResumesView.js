import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HeaderStrip from 'components/Layout/HeaderStrip';
import CardList from 'components/Layout/CardList';
import { connect } from 'react-redux';
import { loadResumes, setResumeActive, deleteResume } from 'redux/actions/profile';
import { showModal } from 'redux/actions/modals';
import ResumeCard from './ResumeCard';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import LocaleLink from 'components/Localization/LocaleLink';
import MasterDetail from 'components/Layout/MasterDetail';
import Sticky from 'react-sticky-el';
import HeaderStripContent from 'components/Layout/HeaderStripContent';
import HeaderStripContentLarge from 'components/Layout/HeaderStripContentLarge';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import CommandBar from 'components/Layout/CommandBar';
import LocalizedNode from 'components/Localization/LocalizedNode';
import Localized from 'components/Localization/Localized';
import ContentMetaTags from 'components/Content/ContentMetaTags';
import errorBoundary from 'components/Decorators/errorBoundary';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import { urlSearchToObj, mergeUrlSearch } from 'utils/url';
import './ResumesView.css';

class ResumesView extends Component {
	constructor(props) {
		super(props);

		props.loadResumes();
	}

	state = {
		selectedId: null
	}

	static getDerivedStateFromProps(props) {
		const { location: { search } } = props;
		const { id: selectedId } = urlSearchToObj(search);

		return { selectedId };
	}

	doDelete = (id, close) => () => {
		this.props.deleteResume({ id });
		close();
	}

	selectCard = id => {
		const { history, location } = this.props;

		history.replace({
			...location,
			search: mergeUrlSearch(location.search, { id })
		});
	}

	handleDelete = resume => {
		this.selectCard(resume.id);

		this.props.showModal({
			title: <LocalizedNode names={['Common', 'Profile']} groupKey="ConfirmDeleteTitle" />,
			content: ({ close }) => (
				<Localized names={['Common', 'Profile']}>
					{({ CancelLabel, DeleteLabel }) => (
						<div>
							<ResumeCard as="div" resume={resume} clickable={false} />

							<CommandBar>
								<PrimaryButton onClick={close}>
									{CancelLabel}
								</PrimaryButton>
								<PrimaryLink as="button" onClick={this.doDelete(resume.id, close)}>
									{DeleteLabel}
								</PrimaryLink>
							</CommandBar>
						</div>
					)}
				</Localized>
			)
		});
	}

	handleSetActive = ({ id }, active) => {
		this.props.setResumeActive({ id, active });
	}

	renderList = () => {
		const { list: { result, loading } } = this.props;
		const { selectedId } = this.state;

		return (
			<Localized names={['Common', 'Profile']}>
				{({ NoResumesFoundLabel }) => (
					<div className="resumes-view-list">
						<CardList emptyText={NoResumesFoundLabel} loading={loading}>
							{(result || []).map((cl, i) => (
								<ResumeCard 
									key={i} 
									resume={cl} 
									selected={cl.id === selectedId}
									to={`/profile/resume/${cl.id}`}
									onDelete={this.handleDelete}
									onSetActive={this.handleSetActive}
									onClick={() => this.selectCard(cl.id)} />
							))}
						</CardList>
					</div>
				)}
			</Localized>
		);
	}

	render() {
		return (
			<Localized names={['Common', 'Profile']}>
				{({ ResumesTitle, AddResumeLabel, BackToDashboardLabel }) => (
					<div className="resumes-view">
						<ContentMetaTags title={ResumesTitle} />

						<HeaderStrip className="resumes-view-header-strip">
							<HeaderStripContentLarge>
								<HeaderStripContent.Back to="/profile" />

								<h1>{ResumesTitle}</h1>
							</HeaderStripContentLarge>
						</HeaderStrip>

						<MasterDetail
							className="resumes-view-md"
							showDetail
							master={() => (
								<Sticky>
									<div className="resumes-view-commands">
										<PrimaryButton className="resumes-view-add" as={LocaleLink} to="/profile/resume">
											+ {AddResumeLabel}
										</PrimaryButton>
									</div>
								</Sticky>
							)}
							detail={this.renderList} />

						<Sticky mode="bottom" positionRecheckInterval={200}>
							<CommandBar layout="mobile" mobileSize="xs sm">
								<PrimaryLink as={LocaleLink} to="/profile">
									<span className="icon icon-angle-left"></span> {BackToDashboardLabel}
								</PrimaryLink>
								<PrimaryButton className="resumes-view-add" as={LocaleLink} to="/profile/resume">
									+ {AddResumeLabel}
								</PrimaryButton>
							</CommandBar>
						</Sticky>
					</div>
				)}
			</Localized>
		);
	}
}

ResumesView.propTypes = {
	loadResumes: PropTypes.func.isRequired,
	setResumeActive: PropTypes.func.isRequired,
	deleteResume: PropTypes.func.isRequired,
	showModal: PropTypes.func.isRequired,
	list: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	list: state.profile.resumes.list
});

export default errorBoundary(withLocaleRouter(connect(mapStateToProps, { loadResumes, setResumeActive, deleteResume, showModal })(ResumesView)));