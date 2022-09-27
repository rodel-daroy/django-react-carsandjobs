import React, { Component } from 'react';
import PropTypes from 'prop-types';
import JobFilterForm from './JobFilterForm';
import { JobFilter } from 'types/jobs';
import JobFilterFields from './JobFilterFields';

class JobFilterBrowse extends Component {
	handleChangeField = () => {
		setTimeout(() => this._form.submit());
	}

	render() {
		const { filter, onUpdate, ...otherProps } = this.props;

		return (
			<JobFilterForm 
				ref={ref => this._form = ref}
				{...otherProps}
	
				form="jobFilterBrowse" 
				initialValues={filter}
				enableReinitialize 
				onSubmit={onUpdate}
				hideSubmit>
	
				<JobFilterFields 
					fieldType="select" 
					filter={filter} 
					onChange={this.handleChangeField} />
			</JobFilterForm>
		);
	}
}

JobFilterBrowse.propTypes = {
	filter: JobFilter,
	onUpdate: PropTypes.func.isRequired
};

export default JobFilterBrowse;