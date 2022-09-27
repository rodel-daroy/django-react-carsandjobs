import PropTypes from 'prop-types';
import { JobFilter } from './jobs';

export const ProfilePropTypes = {
	firstName: PropTypes.string,
	lastName: PropTypes.string,
	email: PropTypes.string,
	password: PropTypes.string,
	phone: PropTypes.string,
	cellPhone: PropTypes.string,
	address: PropTypes.shape({
		street: PropTypes.string,
		city: PropTypes.string,
		postalCode: PropTypes.string,
		province: PropTypes.string
	}),
	choice1: PropTypes.any,
	choice2: PropTypes.any,
	choice3: PropTypes.any,
	newGraduate: PropTypes.bool,
	coopStudent: PropTypes.bool
};

export const Profile = PropTypes.shape(ProfilePropTypes);

export const CoverLetterPropTypes = {
	id: PropTypes.any,
	name: PropTypes.string,
	description: PropTypes.string,
	text: PropTypes.string,
	active: PropTypes.bool,
	modifiedDate: PropTypes.any
};

export const CoverLetter = PropTypes.shape(CoverLetterPropTypes);

export const ResumePropTypes = {
	id: PropTypes.any,
	name: PropTypes.string,
	description: PropTypes.string,
	fileId: PropTypes.any,
	text: PropTypes.string,
	active: PropTypes.bool,
	searchable: PropTypes.bool,
	processing: PropTypes.bool,
	modifiedDate: PropTypes.any
};

export const Resume = PropTypes.shape(ResumePropTypes);

export const SavedSearchPropTypes = {
	id: PropTypes.any,
	name: PropTypes.string,
	filter: JobFilter,
	createdDate: PropTypes.any
};

export const SavedSearch = PropTypes.shape(SavedSearchPropTypes);