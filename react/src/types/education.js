import PropTypes from 'prop-types';

export const ProgrammePropTypes = {
	title: PropTypes.string,
	schoolName: PropTypes.string,
	city: PropTypes.string,
	province: PropTypes.string,
	url: PropTypes.string,
	scholarship: PropTypes.bool,
	coop: PropTypes.bool,
	apprenticeship: PropTypes.bool,
	department: PropTypes.any
};

export const Programme = PropTypes.shape(ProgrammePropTypes);

export const ProgrammeFilterPropTypes = {
	city: PropTypes.string,
	province: PropTypes.string,
	department: PropTypes.any
};

export const ProgrammeFilter = PropTypes.shape(ProgrammeFilterPropTypes);