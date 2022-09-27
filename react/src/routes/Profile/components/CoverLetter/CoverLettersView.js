import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HeaderStrip from 'components/Layout/HeaderStrip';
import CardList from 'components/Layout/CardList';
import { connect } from 'react-redux';
import { loadCoverLetters, setCoverLetterActive, deleteCoverLetter } from 'redux/actions/profile';
import { showModal } from 'redux/actions/modals';
import CoverLetterCard from './CoverLetterCard';
import MasterDetail from 'components/Layout/MasterDetail';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import LocaleLink from 'components/Localization/LocaleLink';
import Sticky from 'react-sticky-el';
import HeaderStripContent from 'components/Layout/HeaderStripContent';
import HeaderStripContentLarge from 'components/Layout/HeaderStripContentLarge';
import CommandBar from 'components/Layout/CommandBar';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import Localized from 'components/Localization/Localized';
import LocalizedNode from 'components/Localization/LocalizedNode';
import ContentMetaTags from 'components/Content/ContentMetaTags';
import errorBoundary from 'components/Decorators/errorBoundary';
import { getNextLink, getPrevLink } from 'utils/router';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import { urlSearchToObj, mergeUrlSearch } from 'utils/url';
import './CoverLettersView.css';

class CoverLettersView extends Component {
	constructor(props) {
		super(props);

		props.loadCoverLetters();
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
		this.props.deleteCoverLetter({ id });
		close();
	}

	selectCard = id => {
		const { history, location } = this.props;

		history.replace({
			...location,
			search: mergeUrlSearch(location.search, { id })
		});
	}

	handleDelete = coverLetter => {
		this.selectCard(coverLetter.id);

		this.props.showModal({
			title: <LocalizedNode names={['Common', 'Profile']} groupKey="ConfirmDeleteTitle" />,
			content: ({ close }) => (
				<Localized names={['Common', 'Profile']}>
					{({ CancelLabel, DeleteLabel }) => (
						<div>
							<CoverLetterCard as="div" coverLetter={coverLetter} clickable={false} />

							<CommandBar>
								<PrimaryButton onClick={close}>
									{CancelLabel}
								</PrimaryButton>
								<PrimaryLink as="button" onClick={this.doDelete(coverLetter.id, close)}>
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
		this.props.setCoverLetterActive({ id, active });
	}

	renderList = () => {
		const { list: { result, loading }, location } = this.props;
		const { selectedId } = this.state;

		return (
			<Localized names={['Common', 'Profile']}>
				{({ NoCoverLettersFoundLabel }) => (
					<div className="cover-letters-view-list">
						<CardList emptyText={NoCoverLettersFoundLabel} loading={loading}>
							{(result || []).map((cl, i) => (
								<CoverLetterCard 
									key={i} 
									coverLetter={cl}
									selected={selectedId === cl.id}
									to={getNextLink(`/profile/cover-letter/${cl.id}`, location)}
									onClick={() => this.selectCard(cl.id)}
									onDelete={this.handleDelete}
									onSetActive={this.handleSetActive} />
							))}
						</CardList>
					</div>
				)}
			</Localized>
		);
	}

	render() {
		const { location } = this.props;

		return (
			<Localized names={['Common', 'Profile']}>
				{({ CoverLettersTitle, AddCoverLetterLabel, BackToDashboardLabel }) => (
					<div className="cover-letters-view">
						<ContentMetaTags title={CoverLettersTitle} />

						<HeaderStrip>
							<HeaderStripContentLarge>
								<HeaderStripContent.Back to={getPrevLink(location, '/profile')} />

								<h1>{CoverLettersTitle}</h1>
							</HeaderStripContentLarge>
						</HeaderStrip>

						<MasterDetail 
							className="cover-letters-view-md"
							showDetail
							master={() => (
								<Sticky>
									<div className="cover-letters-view-commands">
										<PrimaryButton className="cover-letters-view-add" as={LocaleLink} to={getNextLink('/profile/cover-letter', location)}>
											+ {AddCoverLetterLabel}
										</PrimaryButton>
									</div>
								</Sticky>
							)}
							detail={this.renderList} />

						<Sticky mode="bottom" positionRecheckInterval={200}>
							<CommandBar layout="mobile" mobileSize="xs sm">
								<PrimaryLink as={LocaleLink} to={getPrevLink(location, '/profile')}>
									<span className="icon icon-angle-left"></span> {BackToDashboardLabel}
								</PrimaryLink>
								<PrimaryButton className="cover-letters-view-add" as={LocaleLink} to={getNextLink('/profile/cover-letter', location)}>
									+ {AddCoverLetterLabel}
								</PrimaryButton>
							</CommandBar>
						</Sticky>
					</div>
				)}
			</Localized>
		);
	}
}

CoverLettersView.propTypes = {
	loadCoverLetters: PropTypes.func.isRequired,
	setCoverLetterActive: PropTypes.func.isRequired,
	deleteCoverLetter: PropTypes.func.isRequired,
	list: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired,
	showModal: PropTypes.func.isRequired,
	history: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	list: state.profile.coverLetters.list
});

export default errorBoundary(withLocaleRouter(connect(mapStateToProps, { loadCoverLetters, setCoverLetterActive, deleteCoverLetter, showModal })(CoverLettersView)));