import PropTypes from 'prop-types';

export const JobHeaderPropTypes = {
	id: PropTypes.any,
	title: PropTypes.any,
	company: PropTypes.shape({
		name: PropTypes.string,
		logo: PropTypes.string
	}),
	department: PropTypes.array,
	positionType: PropTypes.any,
	experience: PropTypes.any,
	education: PropTypes.any,
	salary: PropTypes.any,
	city: PropTypes.string,
	province: PropTypes.string,
	postDate: PropTypes.any,
	closingDate: PropTypes.any,
	saved: PropTypes.bool,
	appliedDate: PropTypes.any
};

export const JobHeader = PropTypes.shape(JobHeaderPropTypes);

export const JobDetailPropTypes = {
	...JobHeaderPropTypes,

	description: PropTypes.any,
	contact: PropTypes.object,
	location: PropTypes.object
};

export const JobDetail = PropTypes.shape(JobDetailPropTypes);

export const JobFilterPropTypes = {
	keywords: PropTypes.string,
	location: PropTypes.object,
	category: PropTypes.any,
	department: PropTypes.any,
	positionType: PropTypes.any,
	experience: PropTypes.any,
	education: PropTypes.any,
	age: PropTypes.number,
	language: PropTypes.string
};

export const JobFilter = PropTypes.shape(JobFilterPropTypes);