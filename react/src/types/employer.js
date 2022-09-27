import PropTypes from 'prop-types';
import { integer } from 'airbnb-prop-types';
import { JobDetailPropTypes } from './jobs';

export const ResumePropTypes = {
	firstName: PropTypes.string,
	lastName: PropTypes.string,
	email: PropTypes.string,
	city: PropTypes.string,
	province: PropTypes.string,
	url: PropTypes.string,
	modifiedDate: PropTypes.any
};

export const Resume = PropTypes.shape(ResumePropTypes);

export const ResumeFilterPropTypes = {
	keywords: PropTypes.string,
	location: PropTypes.object,
	department: PropTypes.any,
	coopStudents: PropTypes.bool,
	newGraduates: PropTypes.bool,
	order: PropTypes.oneOf(['modifiedDate-asc', 'modifiedDate-desc', 'lastName-asc', 'lastName-desc'])
};

export const ResumeFilter = PropTypes.shape(ResumeFilterPropTypes);

export const ApplicationPropTypes = {
	id: PropTypes.any,
	firstName: PropTypes.string,
	lastName: PropTypes.string,
	email: PropTypes.string,
	coverLetterText: PropTypes.string,
	resumeUrl: PropTypes.string,
	videoUrl: PropTypes.string
};

export const Application = PropTypes.shape(ApplicationPropTypes);

export const JobPostingPropTypes = {
	...JobDetailPropTypes,

	emailDaily: PropTypes.bool,
	doNotEmail: PropTypes.bool,
	views: integer(),
	jobApplications: integer()
};

export const JobPosting = PropTypes.shape(JobPostingPropTypes);

export const InvoicePropTypes = {
	id: PropTypes.any,
	date: PropTypes.any,
	name: PropTypes.string,
	address: PropTypes.string,
	lines: PropTypes.array,
	subtotal: PropTypes.string,
	tax: PropTypes.string,
	total: PropTypes.string
};

export const Invoice = PropTypes.shape(InvoicePropTypes);