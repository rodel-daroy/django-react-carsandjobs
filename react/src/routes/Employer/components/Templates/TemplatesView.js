import React from 'react';
import PropTypes from 'prop-types';
import ViewPanel from 'components/Layout/ViewPanel';
import HeaderStrip from 'components/Layout/HeaderStrip';
import HeaderStripContentLarge from 'components/Layout/HeaderStripContentLarge';
import HeaderStripContent from 'components/Layout/HeaderStripContent';
import MasterDetail from 'components/Layout/MasterDetail';
import TemplatesList from './TemplatesList';
import TemplatePreview from './TemplatePreview';
import TemplatePreviewCommands from './TemplatePreviewCommands';
import Localized from 'components/Localization/Localized';
import ContentMetaTags from 'components/Content/ContentMetaTags';
import errorBoundary from 'components/Decorators/errorBoundary';
import requireRole from 'components/Decorators/requireRole';
import { DEALER_ROLES } from 'redux/selectors';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import './TemplatesView.css';

const TemplatesView = ({ location }) => {
	const showDetail = location.state && location.state.detail;

	return (
		<Localized names={['Common', 'Employer']}>
			{({ JobTemplatesTitle }) => (
				<ViewPanel className="templates-view" scrolling>
					<ContentMetaTags title={JobTemplatesTitle} />

					<HeaderStrip>
						<MasterDetail 
							showDetail={showDetail}>
							
							{({ masterVisible, detailVisible }) => {
								let backTo = '/employer/dashboard';
								if(detailVisible && !masterVisible)
									backTo = {
										...location,
										state: null
									};

								return (
									<HeaderStripContentLarge>
										<HeaderStripContent.Back to={backTo} />

										<h1>{JobTemplatesTitle}</h1>
									</HeaderStripContentLarge>
								);
							}}
						</MasterDetail>
					</HeaderStrip>

					<MasterDetail
						className="templates-view-md"
						showDetail={showDetail}
						master={() => <TemplatesList />}
						detail={() => <TemplatePreview />} />

					{showDetail && (
						<TemplatePreviewCommands layout="mobile" />
					)}
				</ViewPanel>
			)}
		</Localized>
	);
};

TemplatesView.propTypes = {
	location: PropTypes.object.isRequired
};

export default errorBoundary(requireRole(DEALER_ROLES)(withLocaleRouter(TemplatesView)));
