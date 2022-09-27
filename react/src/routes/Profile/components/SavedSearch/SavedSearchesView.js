import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HeaderStrip from 'components/Layout/HeaderStrip';
import CardList from 'components/Layout/CardList';
import { connect } from 'react-redux';
import { loadSearches, deleteSearch } from 'redux/actions/profile';
import { showModal } from 'redux/actions/modals';
import SavedSearchCard from './SavedSearchCard';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import LocaleLink from 'components/Localization/LocaleLink';
import Sticky from 'react-sticky-el';
import HeaderStripContent from 'components/Layout/HeaderStripContent';
import HeaderStripContentLarge from 'components/Layout/HeaderStripContentLarge';
import CommandBar from 'components/Layout/CommandBar';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import { filterToUrlSearch } from 'routes/Jobs/filter';
import LocalizedNode from 'components/Localization/LocalizedNode';
import Localized from 'components/Localization/Localized';
import ContentMetaTags from 'components/Content/ContentMetaTags';
import errorBoundary from 'components/Decorators/errorBoundary';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import { urlSearchToObj, mergeUrlSearch } from 'utils/url';
import './SavedSearchesView.css';

class SavedSearchesView extends Component {
	constructor(props) {
		super(props);

		props.loadSearches();
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
		this.props.deleteSearch({ id });
		close();
	}

	handleDelete = search => {
		this.selectCard(search.id);

		this.props.showModal({
			title: <LocalizedNode names={['Common', 'Profile']} groupKey="ConfirmDeleteTitle" />,
			content: ({ close }) => (
				<Localized names={['Common', 'Profile']}>
					{({ CancelLabel, DeleteLabel }) => (
						<div>
							<SavedSearchCard as="div" search={search} clickable={false} />

							<CommandBar>
								<PrimaryButton onClick={close}>
									{CancelLabel}
								</PrimaryButton>
								<PrimaryLink as="button" onClick={this.doDelete(search.id, close)}>
									{DeleteLabel}
								</PrimaryLink>
							</CommandBar>
						</div>
					)}
				</Localized>
			)
		});
	}

	selectCard = id => {
		const { history, location } = this.props;

		history.replace({
			...location,
			search: mergeUrlSearch(location.search, { id })
		});
	}

	renderList = () => {
		const { list: { result, loading } } = this.props;
		const { selectedId } = this.state;

		const to = search => '/jobs/search' + filterToUrlSearch(search.filter);

		return (
			<Localized names={['Common', 'Profile']}>
				{({ NoSavedSearchesLabel }) => (
					<div className="saved-searches-view-list">
						<CardList emptyText={NoSavedSearchesLabel} loading={loading}>
							{(result || []).map((cl, i) => (
								<SavedSearchCard 
									key={i} 
									search={cl}
									selected={selectedId === cl.id}
									to={to(cl)}
									onDelete={this.handleDelete}
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
				{({ SavedSearchesTitle, BackToDashboardLabel }) => (
					<div className="saved-searches-view">
						<ContentMetaTags title={SavedSearchesTitle} />

						<HeaderStrip>
							<HeaderStripContentLarge>
								<HeaderStripContent.Back to="/profile" />

								<h1>{SavedSearchesTitle}</h1>
							</HeaderStripContentLarge>
						</HeaderStrip>

						{this.renderList()}

						<Sticky mode="bottom" positionRecheckInterval={200}>
							<CommandBar layout="mobile" mobileSize="xs sm">
								<PrimaryLink as={LocaleLink} to="/profile" iconClassName="icon icon-angle-left" hasIcon>
									{BackToDashboardLabel}
								</PrimaryLink>
							</CommandBar>
						</Sticky>
					</div>
				)}
			</Localized>
		);
	}
}

SavedSearchesView.propTypes = {
	loadSearches: PropTypes.func.isRequired,
	deleteSearch: PropTypes.func.isRequired,
	list: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired,
	showModal: PropTypes.func.isRequired,
	history: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	list: state.profile.searches
});

export default errorBoundary(withLocaleRouter(connect(mapStateToProps, { loadSearches, deleteSearch, showModal })(SavedSearchesView)));