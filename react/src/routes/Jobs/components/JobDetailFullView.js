import React from 'react';
import PropTypes from 'prop-types';
import { urlSearchToObj } from 'utils/url';
import JobDetailView from './JobDetailView';
import ViewPanel from 'components/Layout/ViewPanel';
import HeaderStrip from 'components/Layout/HeaderStrip';
import HeaderStripContent from 'components/Layout/HeaderStripContent';
import JobFilterBreadcrumbs from './Filter/JobFilterBreadcrumbs';
import LocaleLink from 'components/Localization/LocaleLink';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import { connect } from 'react-redux';
import JobDetailCommands from './JobDetailCommands';
import JobPreviewCommands from './JobPreviewCommands';
import Localized from 'components/Localization/Localized';
import errorBoundary from 'components/Decorators/errorBoundary';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import './JobDetailFullView.css';

const JobDetailFullView = ({ location, jobDetail, preview }) => {
	let { id: jobId } = urlSearchToObj(location.search);
	let { prev, browse } = location.state || {};

	if(preview)
		jobDetail = location.state && location.state.preview;

	let basePath;
	if(prev)
		basePath = (typeof prev === 'object') ? prev.pathname : prev.split('?')[0];

	const Commands = preview ? JobPreviewCommands : JobDetailCommands;
					
	return (
		<Localized names={['Common', 'Jobs']}>
			{({ BrowseLabel, PreviewLabel }) => (
				<ViewPanel className="job-detail-full-view" scrolling>
					<HeaderStrip>
						{prev && (
							<HeaderStripContent className="job-detail-full-view-header">
								<HeaderStripContent.Back to={prev} />

								{!preview && (
									<React.Fragment>
										<JobFilterBreadcrumbs basePath={basePath} />

										{browse && (
											<PrimaryLink size="large" className="job-detail-full-view-browse" as={LocaleLink} to={browse} hasIcon iconClassName="icon icon-filter">
												{BrowseLabel}
											</PrimaryLink>
										)}
									</React.Fragment>
								)}

								{preview && <h1>{PreviewLabel}</h1>}
							</HeaderStripContent>
						)}
					</HeaderStrip>

					<div className="job-detail-full-view-inner">
						<JobDetailView jobId={jobId} preview={preview && jobDetail} commands={Commands} />
					</div>

					{Commands && <Commands layout="mobile" job={jobDetail} />}
				</ViewPanel>
			)}
		</Localized>
	);
};

JobDetailFullView.propTypes = {
	preview: PropTypes.bool,

	location: PropTypes.object.isRequired,
	jobDetail: PropTypes.object
};

const mapStateToProps = state => ({
	jobDetail: state.jobs.jobDetail.result
});

export default errorBoundary(withLocaleRouter(connect(mapStateToProps)(JobDetailFullView)));