import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Flickity from 'flickity';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';
import ObjectFit from 'components/Common/ObjectFit';
import { Image } from './types';
import './ImageCarousel.css';

class ImageCarousel extends Component {
	constructor(props) {
		super(props);

		this._carouselItem = [];
		this._image = [];
	}

	createCarousel(wrapAround = true) {
		const { index, cycleInterval } = this.props;
		const options = {
			cellSelector: '.image-carousel-image',
			wrapAround,
			autoPlay: cycleInterval,
			prevNextButtons: false,
			pageDots: false,
			initialIndex: index,
			setGallerySize: false,
			resize: false/*,
			watchCSS: true,*/
		};

		this._carousel = new Flickity(this._container, options);
		this._carousel.on('select', this.handleSelect);

		this._wrapAround = wrapAround;
	}

	componentDidMount() {
		this.createCarousel();

		this._resizeSensor = new ResizeSensor(this._container, this.handleResize);
	}

	componentWillUnmount() {
		this._resizeSensor.detach();
		this._carousel.destroy();
	}

	handleResize = () => {
		this.updateLayout();
		this._carousel.resize();
	}

	handleSelect = () => {		
		const { onChange } = this.props;
		if(onChange) onChange(this._carousel.selectedIndex);
	}

	componentDidUpdate(prevProps) {
		const { index } = this.props;

		if(index !== prevProps.index) {
			if(index !== this._carousel.selectedIndex) {
				this._carousel.select(index);
				this._carousel.stopPlayer();
			}
		}
	}

	handleImageLoad = () => {
		const incompleteCount = this._image.filter(img => !img.complete).length;
		if(incompleteCount === 0) {
			this.updateLayout();
		}
	}

	updateLayout() {
		const { fill } = this.props;

		if(!fill) {
			const containerWidth = this._container.clientWidth;
			const containerHeight = this._container.clientHeight;

			const maxHeight = this._image.reduce((max, value) => Math.max(max, value.naturalHeight), 0);

			const scale = containerHeight / maxHeight;

			let widths = [];

			for(let i = 0; i < this._image.length; ++i) {
				const image = this._image[i];
				const item = this._carouselItem[i];

				const aspectRatio = image.naturalWidth / image.naturalHeight;

				const height = maxHeight * scale;
				const width = maxHeight * aspectRatio * scale;

				item.style.height = `${height}px`;
				item.style.width = `${width}px`;

				widths.push(width);
			}

			let wrapAround = true;
			for(let i = 0; i < widths.length; ++i) {
				let prevWidth;
				if(i === 0)
					prevWidth = widths[widths.length - 1];
				else
					prevWidth = widths[i - 1];

				if(prevWidth + widths[i] < containerWidth) {
					wrapAround = false;
					break;
				}
			}

			if(wrapAround !== this._wrapAround) {
				this._carousel.destroy();
				this.createCarousel(wrapAround);
			}

			this._carousel.resize();
		}
	}

	render() {
		const { images, className } = this.props;

		return (
			<div className={`image-carousel ${className || ''}`}>
				<div ref={ref => this._container = ref} className="image-carousel-inner">
					{images.map((image, i) => (
						<div ref={ref => this._carouselItem[i] = ref} key={i} className="image-carousel-image">
							<ObjectFit>
								<img ref={ref => this._image[i] = ref} src={image.src} alt={image.alt || ''} onLoad={this.handleImageLoad} />
							</ObjectFit>
						</div>
					))}
				</div>
			</div>
		);
	}
}

ImageCarousel.propTypes = {
	images: PropTypes.arrayOf(Image).isRequired,
	index: PropTypes.number,
	onChange: PropTypes.func,
	fill: PropTypes.bool,
	cycleInterval: PropTypes.number,
	className: PropTypes.string
};

ImageCarousel.defaultProps = {
	cycleInterval: 5000
};

export default ImageCarousel;