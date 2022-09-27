import PropTypes from 'prop-types';

export const LocalNamePropTypes = {
	en: PropTypes.string,
	fr: PropTypes.string
};

export const LocalName = PropTypes.shape(LocalNamePropTypes);

export const LookupPropTypes = {
	id: PropTypes.any,
	name: LocalName
};

export const Lookup = PropTypes.shape(LookupPropTypes);

export const LocationPropTypes = {
	city: PropTypes.string,
	province: PropTypes.string
};

export const Location = PropTypes.shape(LocationPropTypes);