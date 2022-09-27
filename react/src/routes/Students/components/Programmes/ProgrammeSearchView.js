import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import LocaleLink from 'components/Localization/LocaleLink';
import ViewPanel from 'components/Layout/ViewPanel';
import HeaderStrip from 'components/Layout/HeaderStrip';
import HeaderStripContent from 'components/Layout/HeaderStripContent';
import { parseFilter, updateFilter } from './filter';
import { mergeUrlSearch, urlSearchToObj } from 'utils/url';
import MasterDetail from 'components/Layout/MasterDetail';
import isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import { loadProgrammes, loadMoreProgrammes, loadPlaceholders } from 'redux/actions/education';
import ProgrammeFilterForm, { ANY_KEY } from './ProgrammeFilterForm';
import ProgrammeCard from './ProgrammeCard';
import CardList from 'components/Layout/CardList';
import CardListGroup from 'components/Layout/CardListGroup';
import uniq from 'lodash/uniq';
import Localized from 'components/Localization/Localized';
import ContentMetaTags from 'components/Content/ContentMetaTags';
import errorBoundary from 'components/Decorators/errorBoundary';
import { language } from 'redux/selectors';
import sortBy from 'lodash/sortBy';
import EmptyState from 'components/Layout/EmptyState';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import './ProgrammeSearchView.css';

class ProgrammeSearchView extends Component {
	state = {
		detail: false,
		filter: null
	}

	static getDerivedStateFromProps(props, state) {
		const { location } = props;

		const searchObj = urlSearchToObj(location.search);

		const detail = !!parseInt(searchObj.detail, 10);

		const filter = parseFilter(searchObj);

		return {
			detail,
			filter,
			prev: state.prev || (location.state && location.state.prev)
		};
	}

	loadSearch(filter) {
		const { loadProgrammes, loadPlaceholders, language } = this.props;

		if(filter.department === ANY_KEY)
			delete filter.department;

		loadProgrammes({ filter, language });
		loadPlaceholders({ language });
	}

	componentDidMount() {
		const { location: { search } } = this.props;

		const filter = parseFilter(search);
		this.loadSearch(filter);

		this.setState({
			newSearch: true
		});
	}

	componentDidUpdate(prevProps) {
		const currentFilter = parseFilter(this.props.location.search);
		const prevFilter = parseFilter(prevProps.location.search);

		const { language } = this.props;

		if(!isEqual(currentFilter, prevFilter) || language !== prevProps.language) {
			this.loadSearch(currentFilter);

			this.setState({
				newSearch: true
			});
		}

		if(!this.props.programmes.loading && this.state.newSearch)
			this.setState({
				newSearch: false
			});
	}

	handleUpdateFilter = filter => {
		const { location, history } = this.props;

		let detail = {};
		if(filter.detail || !isEqual(parseFilter(location.search), filter))
			detail = { detail: 1 };

		updateFilter(filter, { location, history }, detail);
	};

	renderMaster = () => {
		let { filter } = this.state;

		filter = { ...filter };

		if(filter.city) {
			filter.location = {
				city: filter.city,
				province: filter.province
			};

			delete filter.city;
			delete filter.province;
		}

		filter.department = filter.department || ANY_KEY;

		return (
			<ProgrammeFilterForm initialValues={filter} onUpdateFilter={this.handleUpdateFilter} />
		);
	}

	renderDetail = () => {
		const { loadMoreProgrammes, programmes: { loading, result }, placeholders } = this.props;

		if(result && placeholders.result) {
			const { newSearch } = this.state;

			const items = (result && !newSearch) ? result.programmes : [];
			const totalCount = (result && !newSearch) ? result.totalCount : null;

			const groupElements = (!loading || items.length) ? this.getGroups(items, totalCount) : [];

			return (
				<Localized names="Students">
					{({ NoProgrammesFound }) => (
						<CardList 
							className="programme-search-view-cards" 
							onLoadMore={() => loadMoreProgrammes()} 
							totalCount={totalCount}
							loading={loading}
							emptyText={NoProgrammesFound}
							groups={groupElements}>

							{items.map((r, i) => (
								<ProgrammeCard key={i} programme={r} />
							))}
						</CardList>
					)}
				</Localized>
			);
		}
		else
			return <EmptyState.Loading />;
	}

	getGroups(items, totalCount) {
		if(totalCount == null)
			return null;

		const { filter } = this.state;
		const { placeholders: { result } } = this.props;
		let placeholders = result || [];

		if(filter.department && filter.department !== ANY_KEY)
			placeholders = placeholders.filter(ph => ph.department === filter.department);

		const itemTitles = uniq(items.map(i => i.title));
		const otherTitles = uniq((placeholders || []).map(t => t.title));

		let titles = sortBy([
			...itemTitles,
			...otherTitles
		], [title => title.toLowerCase()]);

		if(items.length < totalCount)
			titles = titles.slice(0, titles.indexOf(itemTitles[itemTitles.length - 1]) + 1);

		const getHeader = group => {
			const title = (placeholders || []).find(t => t.title === group);

			return (
				<React.Fragment>
					<h3>{group}</h3>
					
					{title && <p>{title.description}</p>}
				</React.Fragment>
			);
		};

		const uniqueTitles = [...new Set(titles)];
		const groupElements = uniqueTitles.map(group => (
			<CardListGroup 
				key={group} 
				header={getHeader(group)} 
				filter={children => children.filter(child => child.props.programme.title === group)} />
		));

		return groupElements;
	}

	render() {
		const { detail, prev } = this.state;
		const { location } = this.props;

		const search = mergeUrlSearch(location.search, { detail: null });

		const backPath = location.pathname + search;

		return (
			<Localized names={['Common', 'Students']}>
				{({ EducationProgrammesTitle }) => (
					<ViewPanel className="programme-search-view" scrolling>
						<ContentMetaTags title={EducationProgrammesTitle} />

						<HeaderStrip>
							<MasterDetail showDetail={detail}>
								{({ masterVisible }) => (
									<HeaderStripContent className="programme-search-view-header">
										<HeaderStripContent.Back to={masterVisible ? (prev || '/students') : backPath} />

										<h1 className="programme-search-view-header-title">{EducationProgrammesTitle}</h1>

										{!masterVisible && (
											<PrimaryLink 
												as={LocaleLink}
												size="large" 
												hasIcon 
												iconClassName="icon icon-search"
												to={backPath}>
											</PrimaryLink>
										)}
									</HeaderStripContent>
								)}
							</MasterDetail>
						</HeaderStrip>

						<MasterDetail
							className="programme-search-view-md"
							showDetail={detail}
							master={this.renderMaster}
							detail={this.renderDetail} />
					</ViewPanel>
				)}
			</Localized>
		);
	}
}

ProgrammeSearchView.propTypes = {
	match: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	loadProgrammes: PropTypes.func.isRequired,
	loadMoreProgrammes: PropTypes.func.isRequired,
	loadPlaceholders: PropTypes.func.isRequired,
	programmes: PropTypes.object.isRequired,
	placeholders: PropTypes.object.isRequired,
	language: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
	programmes: state.education.programmes,
	placeholders: state.education.placeholders,
	language: language(state)
});

export default errorBoundary(withLocaleRouter(connect(mapStateToProps, { loadProgrammes, loadMoreProgrammes, loadPlaceholders })(ProgrammeSearchView)));