import PropTypes from 'prop-types';
import { Image } from 'components/Content/types';

export const ContentPropTypes = {
	title: PropTypes.string,
	subTitle: PropTypes.string,
	image: Image,
	content: PropTypes.string,
	author: PropTypes.string,
	authorUrl: PropTypes.string,
	date: PropTypes.any,
	carouselImages: PropTypes.arrayOf(Image),
	relatedArticles: PropTypes.array
};