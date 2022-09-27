import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { mediaQuery } from 'utils/style';
import JobPostingCard from './JobPostingCard';
import CardList from 'components/Layout/CardList';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import CheckboxField from 'components/Forms/CheckboxField';
import { isJobPostingOpen, isJobPostingEnded, canEditJobPosting, isJobPostingClosed } from 'redux/helpers';
import { formatShortDate, parseMarkdown } from 'utils/format';
import { getLanguageValue } from 'utils/index';
import Tag from 'components/Content/Tag';
import Localized from 'components/Localization/Localized';
import LocalizedNode from 'components/Localization/LocalizedNode';
import { confirmModal } from 'components/Modals/helpers';
import { POSTING_EDIT_DAYS } from 'config/constants';
import EmptyState from 'components/Layout/EmptyState';
import Media from 'react-media';
import LocaleLink from 'components/Localization/LocaleLink';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import { connect } from 'react-redux';
import { publishJobPosting, republishJobPosting, deleteJobPosting } from 'redux/actions/employer';
import { loadLookups } from 'redux/actions/jobs';
import { showModal } from 'redux/actions/modals';
import { localized, language } from 'redux/selectors';
import { getNextLink } from 'utils/router';
import './JobPostingsTable.css';

class JobPostingsTable extends Component {
	constructor(props) {
		super(props);

		props.loadLookups();
	}

	unpublish = ({ id }) => () => {
		const { publishJobPosting } = this.props;

		publishJobPosting({ 
			id,
			isPublished: false
		});
	}

	postToIndeed = ({ id, postOnIndeed }) => () => {
		const { publishJobPosting } = this.props;
		
		publishJobPosting({ 
			id,
			postOnIndeed: !postOnIndeed
		});
	}

	republish = ({ id, postOnIndeed }) => () => {
		this.props.republishJobPosting({ id, postOnIndeed });
	}

	handlePublishedChange = posting => () => {
		const { showModal } = this.props;

		const open = isJobPostingOpen(posting);

		const titleKey = open ? 'ConfirmUnpublishTitle' : 'ConfirmPublishTitle';
		const onOk = open ? this.unpublish(posting) : this.republish({ ...posting, postOnIndeed: false });

		showModal(confirmModal({
			title: <LocalizedNode names="Employer" groupKey={titleKey} as="h3" />,
			onOk
		}));
	}

	requireEditable(posting, title) {
		const { showModal } = this.props;

		if(!canEditJobPosting(posting, true)) {
			showModal({
				title: <h2>{title}</h2>,
				content: () => (
					<Localized names="Employer">
						{({ JobNotEditableMessage }) => (
							<div dangerouslySetInnerHTML={{
								__html: parseMarkdown((JobNotEditableMessage || '').replace('[days]', POSTING_EDIT_DAYS))
							}}>
							</div>
						)}
					</Localized>
				)
			});

			return false;
		}

		return true;
	}

	handleIndeedChange = posting => () => {
		const { localized } = this.props;

		const postedOnIndeed = posting.postOnIndeed && isJobPostingOpen(posting);
		const titleKey = postedOnIndeed ? 'ConfirmRemovePostOnIndeedTitle' : 'ConfirmPostOnIndeedTitle';

		if(this.requireEditable(posting, localized[titleKey])) {
			const { showModal } = this.props;

			let content;
			if(!postedOnIndeed && (!posting.isPublishedEver || isJobPostingClosed(posting)))
				content = () => (
					<Localized names="Employer">
						{({ PublishPostOnIndeedMessage }) => (
							<div dangerouslySetInnerHTML={{ __html: parseMarkdown(PublishPostOnIndeedMessage) }}>
							</div>
						)}
					</Localized>
				);

			const postOnIndeed = !postedOnIndeed;

			const onOk = () => {
				if(isJobPostingClosed(posting) && postOnIndeed) {
					this.republish({
						id: posting.id,
						postOnIndeed
					})();
				}
				else {
					this.props.publishJobPosting({ 
						id: posting.id,

						isPublished: posting.isPublished || !postedOnIndeed,
						postOnIndeed
					});
				}
			};

			showModal(confirmModal({
				title: <LocalizedNode names="Employer" groupKey={titleKey} as="h3" />,
				content,
				onOk
			}));
		}
	}

	handleRepublish = posting => () => {
		const { showModal } = this.props;

		const titleKey = isJobPostingOpen(posting) ? 'ConfirmRepublishTitle' : 'ConfirmPublishTitle';

		showModal(confirmModal({
			title: <LocalizedNode names="Employer" groupKey={titleKey} as="h3" />,
			onOk: this.republish(posting)
		}));
	}

	handleDelete = posting => () => {
		const { showModal, deleteJobPosting } = this.props;

		showModal(confirmModal({
			title: <LocalizedNode names="Employer" groupKey="ConfirmDeletePostingTitle" as="h3" />,
			onOk: () => deleteJobPosting({ id: posting.id })
		}));
	}

	renderPublish(posting) {
		const { isPublishedEver } = posting;

		const republish = isPublishedEver;

		return (
			<Localized names={['Common', 'Jobs', 'Employer']}>
				{({
					PublishLabel,
					RepublishLabel
				}) => (
					<Media query={mediaQuery('xs sm md')}>
						{small => (
							<PrimaryLink 
								className="job-postings-table-republish"
								aria-label={republish ? RepublishLabel : PublishLabel}
								title={republish ? RepublishLabel : PublishLabel}
								as="button" 
								type="button" 
								onClick={this.handleRepublish(posting)} 
								hasIcon 
								iconClassName={republish ? 'icon icon-refresh' : 'icon icon-megaphone'}
								size={small ? 'x-large' : 'small'}>

								<span className="hidden-md hidden-sm hidden-xs">{republish ? RepublishLabel : PublishLabel}</span>
							</PrimaryLink>
						)}
					</Media>
				)}
			</Localized>
		);
	}

	renderTable(items) {
		const { language, lookups: { positionTypes, departments }, location } = this.props;

		const findLookup = (id, lookup) => {
			const item = (lookup || []).find(l => l.id === id);
			if(item)
				return item.name[language];
			else
				return null;
		};

		return (
			<Localized names={['Common', 'Jobs', 'Employer']}>
				{({ 
					PostedDateLabel, 
					JobTitleLabel, 
					PositionTypeLabel, 
					DepartmentsLabel, 
					ClosesLabel, 
					PublishedLabel,
					IndeedLabel,
					ViewsLabel,
					ResponsesLabel,
					NoPostingsFoundLabel,
					LockedLabel,
					TBDPlaceholder,
					DraftLabel,
					EditLabel,
					DeleteLabel
				}) => (
					<table>
						<thead>
							<tr>
								<th></th>
								<th></th>
								<th></th>
								<th>{PostedDateLabel}</th>
								<th className="job-postings-table-title">{JobTitleLabel}</th>
								<th>{PositionTypeLabel}</th>
								<th>{DepartmentsLabel}</th>
								<th>{ClosesLabel}</th>
								<th className="min-width align-center">
									<span 
										aria-label={PublishedLabel} 
										title={PublishedLabel} 
										className="icon icon-megaphone">
									</span>
								</th>
								<th className="min-width align-center">{IndeedLabel}</th>
								<th className="min-width align-center">{ViewsLabel}</th>
								<th className="min-width align-center">{ResponsesLabel}</th>
							</tr>
						</thead>
						<tbody>
							{items.map((item, i) => (
								<tr 
									key={i} 
									className={`job-postings-table-row 
										${!item.isPublishedEver ? 'draft' : ''} 
										${isJobPostingOpen(item) ? 'open' : ''}
										${isJobPostingClosed(item) ? 'closed' : ''}`}>

									<td className="min-width align-center">
										<PrimaryLink 
											aria-label={EditLabel} 
											title={EditLabel}
											as={LocaleLink}
											to={getNextLink({
												pathname: `/employer/job-posting/${item.id}`,
												state: {
													clearForm: true
												}
											}, location)}
											hasIcon
											iconClassName="icon icon-edit"
											size="x-large">
										</PrimaryLink>
									</td>
									<td className="min-width align-center">
										{this.renderPublish(item)}
									</td>
									<td className="min-width align-center">
										{!item.isPublishedEver && (
											<PrimaryLink 
												aria-label={DeleteLabel}
												title={DeleteLabel}
												as="button"
												type="button"
												hasIcon
												iconClassName="icon icon-delete"
												size="x-large"
												onClick={this.handleDelete(item)}>
											</PrimaryLink>
										)}
									</td>
									<td>
										{item.isPublishedEver && (
											<span>{formatShortDate(item.postDate)}</span>
										)}
										{!item.isPublishedEver && (
											<span className="job-postings-table-tbd">{TBDPlaceholder}</span>
										)}
									</td>
									<td className="job-postings-table-title-cell">
										{!item.isPublishedEver && (
											<Tag>{DraftLabel}</Tag>
										)}

										{!canEditJobPosting(item, true) && (
											<span className="icon icon-lock" aria-label={LockedLabel} title={LockedLabel}></span>
										)}

										<PrimaryLink 
											className="job-postings-table-title"
											as={LocaleLink} 
											to={`/jobs/detail?id=${item.id}`}
											target="_blank">

											{getLanguageValue(item.title, language)}
										</PrimaryLink>
									</td>
									<td>
										<span>{findLookup(item.positionType, positionTypes)}</span>
									</td>
									<td>
										<ul className="job-postings-table-departments">
											{item.department.map((d, i) => (
												<li key={i}>
													{findLookup(d, departments)}
												</li>
											))}
										</ul>
									</td>
									<td>
										{item.isPublishedEver && (
											<span className={`job-postings-table-closing-date ${isJobPostingEnded(item) ? 'ended' : ''}`}>{formatShortDate(item.closingDate)}</span>
										)}
										{!item.isPublishedEver && (
											<span className="job-postings-table-tbd">{TBDPlaceholder}</span>
										)}
									</td>
									<td className="min-width align-center">
										<CheckboxField 
											checked={isJobPostingOpen(item)} 
											onChange={this.handlePublishedChange(item)}
											offState />
									</td>
									<td className="min-width align-center">
										<CheckboxField 
											checked={item.postOnIndeed && isJobPostingOpen(item)} 
											onChange={this.handleIndeedChange(item)}
											offState />
									</td>
									<td className="min-width align-center">
										<span>{item.views}</span>
									</td>
									<td className="min-width align-center">
										<PrimaryLink 
											className="job-postings-table-responses" 
											as={LocaleLink} 
											to={getNextLink(`/employer/job-posting/${item.id}/applications`, location)}
											size="large">

											{item.jobApplications}
										</PrimaryLink>
									</td>
								</tr>
							))}

							{items.length === 0 && (
								<tr>
									<td colSpan={12}>
										<EmptyState inline>
											{NoPostingsFoundLabel}
										</EmptyState>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				)}
			</Localized>
		);
	}

	renderCards(items) {
		return (
			<CardList
				totalCount={items.length}>

				{items.map((posting, i) => (
					<JobPostingCard 
						key={i} 
						item={posting} 
						onPublish={this.handleRepublish(posting)} />
				))}
			</CardList>
		);
	}

	render() {
		const { items } = this.props;

		return (
			<div className="job-postings-table">
				<Media query={mediaQuery('xs sm')}>
					{small => small ? this.renderCards(items) : this.renderTable(items)}
				</Media>
			</div>
		);
	}
}

JobPostingsTable.propTypes = {
	items: PropTypes.array.isRequired,

	language: PropTypes.string.isRequired,
	loadLookups: PropTypes.func.isRequired,
	lookups: PropTypes.object.isRequired,
	showModal: PropTypes.func.isRequired,
	publishJobPosting: PropTypes.func.isRequired,
	republishJobPosting: PropTypes.func.isRequired,
	localized: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired,
	deleteJobPosting: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	postings: state.employer.postings,
	language: language(state),
	lookups: state.jobs.lookups,
	localized: localized('Employer')(state)
});
 
export default withLocaleRouter(connect(mapStateToProps, { loadLookups, showModal, publishJobPosting, republishJobPosting, deleteJobPosting })(JobPostingsTable));