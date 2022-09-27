import React, { Component } from 'react';
import PropTypes from 'prop-types';
import JobFilterForm from './JobFilterForm';
import { JobFilter } from 'types/jobs';
import JobFilterFields from './JobFilterFields';
import Accordion from 'components/Layout/Accordion';
import Localized from 'components/Localization/Localized';
import './JobFilterSearch.css';

class JobFilterSearch extends Component {
	state = {
		expanded: false
	}

	render() {
		const { filter, onUpdate, ...otherProps } = this.props;
		const { expanded } = this.state;

		return (
			<Localized names={['Common', 'Jobs']}>
				{({ MoreSearchOptionsLabel }) => (
					<JobFilterForm 
						{...otherProps}

						form="jobFilterSearch" 
						initialValues={filter}
						onSubmit={onUpdate}>

						<JobFilterFields 
							keys={['keywords', 'location']}
							fieldType="input" 
							filter={filter} 
							showAllFields />

						<Accordion className="job-filter-search-accordion" open={expanded}>
							<Accordion.Header 
								open={expanded} 
								onOpen={() => this.setState({ expanded: true })} 
								onClose={() => this.setState({ expanded: false })}>

								{MoreSearchOptionsLabel}
							</Accordion.Header>

							<Accordion.Body open={expanded}>
								<div className="job-filter-search-fields">
									<JobFilterFields 
										excludeKeys={['keywords', 'location']}
										fieldType="input" 
										filter={filter} 
										showAllFields />
								</div>
							</Accordion.Body>
						</Accordion>
					</JobFilterForm>
				)}
			</Localized>
		);
	}
}

JobFilterSearch.propTypes = {
	filter: JobFilter,
	onUpdate: PropTypes.func.isRequired
};

export default JobFilterSearch;