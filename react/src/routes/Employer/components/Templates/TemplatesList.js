import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import CardList from 'components/Layout/CardList';
import { connect } from 'react-redux';
import { loadTemplates } from 'redux/actions/employer';
import JobCard from 'routes/Jobs/components/JobCard';
import { mergeUrlSearch, urlSearchToObj } from 'utils/url';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import { jobPreviewFromTemplate } from './helpers';
import { authDealers, language } from 'redux/selectors';
import Localized from 'components/Localization/Localized';

const TemplatesList = ({ templates: { loading, result: templates }, loadTemplates, location, dealers, language, history }) => {
	useEffect(() => {
		loadTemplates({ language });
	}, [language, loadTemplates]);

	const selectedId = useMemo(() => urlSearchToObj(location.search).id, [location]);

	const to = ({ id }) => ({
		...location,
		search: mergeUrlSearch(location.search, { id }),
		state: {
			detail: true
		}
	});

	const handleClick = id => () => {
		history.replace({
			...location,
			search: mergeUrlSearch(location.search, { id }),
			state: {
				detail: false
			}
		});
	};

	return (
		<Localized names={['Common', 'Employer']}>
			{({ EmployerPlaceholderName }) => (
				<CardList
					totalCount={templates ? templates.length : 0}
					loading={loading}>

					{(templates || []).map((template, i) => (
						<JobCard 
							key={i}
							job={jobPreviewFromTemplate(dealers, EmployerPlaceholderName)(template)}
							jobAge={() => null}
							language={template.language}
							to={to(template)}
							onClick={handleClick(template.id)}
							selected={template.id === selectedId} />
					))}
				</CardList>
			)}
		</Localized>
	);
};

TemplatesList.propTypes = {
	templates: PropTypes.object.isRequired,
	loadTemplates: PropTypes.func.isRequired,
	location: PropTypes.object.isRequired,
	dealers: PropTypes.array.isRequired,
	language: PropTypes.string.isRequired,
	history: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	templates: state.employer.templates,
	dealers: authDealers(state),
	language: language(state)
});
 
export default withLocaleRouter(connect(mapStateToProps, { loadTemplates })(TemplatesList));