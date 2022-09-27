import PropTypes from 'prop-types';

export const ImagePropTypes = {
	src: PropTypes.string.isRequired,
	alt: PropTypes.string
};

export const Image = PropTypes.shape(ImagePropTypes);