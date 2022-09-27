import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImageCarousel from './ImageCarousel';
import { PageStepperSmall } from '../Navigation/PageStepper';
import { Image } from './types';
import './ImageCarouselView.css';

class ImageCarouselView extends Component {
	state = {
		index: 0
	}

	handleChange = index => {
		this.setState({ index });
	}

	render() { 
		const { images, className } = this.props;
		const { index } = this.state;

		return (
			<div className={`image-carousel-view ${className || ''}`}>
				<ImageCarousel 
					images={images}
					index={index}
					onChange={this.handleChange} />

				{images.length > 1 && (
					<PageStepperSmall
						onChange={this.handleChange}
						count={images.length}
						index={index} />
				)}
			</div>
		);
	}
}

ImageCarouselView.propTypes = {
	images: PropTypes.arrayOf(Image).isRequired,
	className: PropTypes.string
};
 
export default ImageCarouselView;