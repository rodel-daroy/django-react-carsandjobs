import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withShape } from 'airbnb-prop-types';
import { MAX_WIDTH, SCREEN_MD_MAX, SCREEN_XS_MAX } from 'utils/style';
import ObjectFit from './ObjectFit';
import { resizeImageUrl } from 'utils';
import takeWhile from 'lodash/takeWhile';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';

class ResponsiveImage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			imageSize: props.sizes[props.sizes.length - 1]
		};
	}

	componentDidMount() {
		this._resizeSensor = new ResizeSensor(this._container, this.handleResize);
		this.handleResize();
	}

	componentWillUnmount() {
		if(this._resizeSensor)
			this._resizeSensor.detach();
	}

	componentDidUpdate(prevProps) {
		const { sizes } = this.props;

		if(sizes !== prevProps.sizes)
			this.handleResize();
	}

	getImageSize() {
		const { sizes } = this.props;

		return takeWhile(sizes, ([width]) => width > this._container.clientWidth).pop() || sizes[0];
	}

	handleResize = () => {
		const imageSize = this.getImageSize();
		if(imageSize[0] !== this.state.imageSize[0])
			this.setState({ 
				imageSize
			});
	}

	render() { 
		const { src, alt, fitProps, className } = this.props;
		const { imageSize: [imageWidth, imageHeight] } = this.state;

		return (
			<div ref={ref => this._container = ref} className={`responsive-image ${className || ''}`}>
				<ObjectFit {...fitProps}>
					<img src={resizeImageUrl(src, imageWidth, imageHeight)} alt={alt} />
				</ObjectFit>
			</div>
		);
	}
}

ResponsiveImage.propTypes = {
	sizes: PropTypes.arrayOf(withShape(PropTypes.array, { length: PropTypes.oneOf([2]) })),
	src: PropTypes.string.isRequired,
	alt: PropTypes.string,
	fitProps: PropTypes.object,
	className: PropTypes.string
};

ResponsiveImage.defaultProps = {
	sizes: [
		[MAX_WIDTH, 800],
		[SCREEN_MD_MAX, 800],
		[SCREEN_XS_MAX, 600]
	]
};
 
export default ResponsiveImage;