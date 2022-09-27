import React, { useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { integer } from 'airbnb-prop-types';
import { JobDetail as JobDetailShape } from 'types/jobs';
import TabSet from 'components/Navigation/TabSet';
import JobVitals from './JobVitals';
import Waypoint from 'react-waypoint';
import JobDetailHeader from './JobDetailHeader';
import Localized from 'components/Localization/Localized';
import { connect } from 'react-redux';
import { language } from 'redux/selectors';
import { parseMarkdown } from 'utils/format';
import ContentMetaTags from 'components/Content/ContentMetaTags';
import { getLanguageValue } from 'utils';
import JobDetailStructuredData from './JobDetailStructuredData';
import Media from 'react-media';
import { mediaQuery } from 'utils/style';
import Sticky from 'react-sticky-el';
import { useDebouncedCallback } from 'use-debounce';
import './JobDetail.css';

const JobDetail = ({ job, tabIndex, onChangeTab, language, commands, template }) => {
	if(!job.company)
		job = {
			...job,
			company: {}
		};

	const [stickyHeaderVisible, setStickyHeaderVisible] = useState(false);

	const handleEnterPositionChange = useCallback(e => {
		if(e.currentPosition === Waypoint.above && e.previousPosition === Waypoint.inside)
			setStickyHeaderVisible(true);
		if(e.currentPosition === Waypoint.inside && e.previousPosition === Waypoint.above)
			setStickyHeaderVisible(false);
	}, [setStickyHeaderVisible]);

	const handleLeavePositionChange = useCallback(e => {
		if(e.currentPosition === Waypoint.inside && e.previousPosition === Waypoint.above)
			setStickyHeaderVisible(false);
		if(e.currentPosition === Waypoint.above && e.previousPosition === Waypoint.inside)
			setStickyHeaderVisible(true);
	}, [setStickyHeaderVisible]);

	const scrollRef = useRef();
	const [handleScroll] = useDebouncedCallback(() => {
		if(scrollRef.current.scrollTop < 5 && stickyHeaderVisible)
			setStickyHeaderVisible(false);
	}, 100);

	return (
		<Localized names={['Common', 'Jobs']}>
			{({ DescriptionLabel, HighlightsLabel, AtLabel }) => {
				let pageTitle = getLanguageValue(job.title, language);
				if(job.company.name)
					pageTitle += ` ${AtLabel} ${job.company.name}`;

				return (
					<Media query={mediaQuery('xs sm')}>
						{small => (
							<div className={`job-detail ${template ? 'template' : ''}`}>
								<ContentMetaTags title={pageTitle} />

								<JobDetailStructuredData job={job} />
								
								{!small && (
									<div className={`job-detail-header-sticky ${stickyHeaderVisible ? 'visible' : ''}`}>
										<JobDetailHeader job={job} commands={commands} compact />
									</div>
								)}

								<div ref={scrollRef} className="job-detail-outer" onScroll={handleScroll}>
									{small && (
										<Sticky scrollElement=".job-detail-outer" stickyClassName="job-detail-header-sticky-small">
											<JobDetailHeader job={job} commands={commands} compact />
										</Sticky>
									)}

									{!small && (
										<JobDetailHeader job={job} commands={commands} />
									)}

									<div className="job-detail-sticky-waypoint-enter">
										<Waypoint onPositionChange={handleEnterPositionChange} />
									</div>

									{!small && (
										<div className="job-detail-sticky-waypoint-leave">
											<Waypoint onPositionChange={handleLeavePositionChange} />
										</div>
									)}

									<div className="job-detail-body">
										<TabSet name="jobDetailTabs" index={tabIndex} onChange={onChangeTab}>
											<TabSet.Tab caption={DescriptionLabel}>
												{() => (
													<div 
														className="job-detail-description"
														dangerouslySetInnerHTML={{ 
															__html: parseMarkdown(getLanguageValue(job.description, language), { offsetHeadings: 3 }) 
														}}>
													</div>
												)}
											</TabSet.Tab>
											<TabSet.Tab caption={HighlightsLabel}>
												{() => <JobVitals job={job} />}
											</TabSet.Tab>
										</TabSet>
									</div>
								</div>
							</div>
						)}
					</Media>
				);
			}}
		</Localized>
	);
};

JobDetail.propTypes = {
	job: JobDetailShape.isRequired,
	tabIndex: integer(),
	onChangeTab: PropTypes.func,
	commands: PropTypes.elementType,
	template: PropTypes.bool,

	language: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
	language: language(state)
});

export default connect(mapStateToProps)(JobDetail);