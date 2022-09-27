import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { JobDetail } from 'types/jobs';
import { parseMarkdown } from 'utils/format';
import { getLanguageValue } from 'utils/index';
import { connect } from 'react-redux';
import { language } from 'redux/selectors';
import { loadLookups } from 'redux/actions/jobs';
import { lookupValue } from 'redux/helpers';
import moment from 'moment';
import get from 'lodash/get';

class JobDetailStructuredData extends Component {
	constructor(props) {
		super(props);

		props.loadLookups();
	}

	render() {
		const { job, language, lookups } = this.props;

		const baseSalary = getLanguageValue(job.salary, language);
		const employmentType = lookupValue(job.positionType, lookups.positionTypes, language);
		const educationRequirements = lookupValue(job.education, lookups.education, language);
		const datePosted = moment(job.postDate).toISOString();
		const validThrough = moment(job.closingDate).toISOString();

		let hiringOrganization;
		if(job.company.name)
			hiringOrganization = {
				'@type': 'Organization',
				name: job.company.name,
				logo: job.company.logo
			};

		const structuredData = {
			'@context': 'http://schema.org',
			'@type': 'JobPosting',
			title: getLanguageValue(job.title, language),
			description: parseMarkdown(getLanguageValue(job.description, language), 3),
			baseSalary,
			employmentType,
			educationRequirements,
			datePosted,
			validThrough,
			hiringOrganization,
			jobLocation: {
				'@type': 'Place',
				address: {
					'@type': 'PostalAddress',
					addressCountry: 'ca',
					addressLocality: job.city || undefined,
					addressRegion: job.province || undefined,
					postalCode: get(job, 'location.postalCode'),
					streetAddress: get(job, 'location.address')
				}
			}
		};

		return (
			<script type="application/ld+json">
				{JSON.stringify(structuredData)}
			</script>
		);
	}
}

JobDetailStructuredData.propTypes = {
	job: JobDetail.isRequired,

	language: PropTypes.string.isRequired,
	lookups: PropTypes.object,
	loadLookups: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	language: language(state),
	lookups: state.jobs.lookups
});
 
export default connect(mapStateToProps, { loadLookups })(JobDetailStructuredData);