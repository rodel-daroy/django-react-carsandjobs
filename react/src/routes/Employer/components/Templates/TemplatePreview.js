import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import EmptyState from 'components/Layout/EmptyState';
import JobDetail from 'routes/Jobs/components/JobDetail';
import { connect } from 'react-redux';
import { jobPreviewFromTemplate } from './helpers';
import TemplatePreviewCommands from './TemplatePreviewCommands';
import { authDealers } from 'redux/selectors';
import Localized from 'components/Localization/Localized';
import { loadTemplate } from 'redux/actions/employer';
import { urlSearchToObj } from 'utils/url';
import { parseMarkdown } from 'utils/format';
import './TemplatePreview.css';

const TemplatePreview = ({ location, loadTemplate, template: { loading, result: template }, dealers }) => {
	const id = useMemo(() => urlSearchToObj(location.search).id, [location]);
	const detail = location.state && location.state.detail;

	useEffect(() => {
		if(id && detail)
			loadTemplate({ id });
	}, [id, detail, loadTemplate]);

	if(loading)
		return <EmptyState.Loading />;

	if(!id || !template || !detail)
		return (
			<Localized names={['Common', 'Employer']}>
				{({ SelectATemplateMessage }) => (
					<EmptyState>
						<div dangerouslySetInnerHTML={{ __html: parseMarkdown(SelectATemplateMessage) }}></div>
					</EmptyState>
				)}
			</Localized>
		);

	return (
		<Localized names={['Common', 'Employer']}>
			{({ EmployerPlaceholderName }) => (
				<div className="template-preview">
					<JobDetail 
						job={jobPreviewFromTemplate(dealers, EmployerPlaceholderName)(template)} 
						commands={props => (
							<TemplatePreviewCommands {...props} template={template} />
						)}
						template />
				</div>
			)}
		</Localized>
	);
};

TemplatePreview.propTypes = {
	loadTemplate: PropTypes.func.isRequired,
	template: PropTypes.object.isRequired,
	dealers: PropTypes.array.isRequired,
	location: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
	template: state.employer.template,
	dealers: authDealers(state)
});
 
export default withLocaleRouter(connect(mapStateToProps, { loadTemplate })(TemplatePreview));