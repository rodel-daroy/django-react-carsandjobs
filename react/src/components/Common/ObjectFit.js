import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';
import Modernizr from 'generated/modernizr';
import { combineFuncs } from 'utils';
import './ObjectFit.css';

class ObjectFitInner extends Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	componentDidMount() {
		if(this._container) {
			this._resizeSensor = new ResizeSensor(this._container, this.handleResize);

			this.handleResize();
		}
	}

	componentWillUnmount() {
		if(this._resizeSensor)
			this._resizeSensor.detach();
	}

	handleResize = debounce(() => {
		if(this._container) {
			const containerAspectRatio = this._container.clientHeight / this._container.clientWidth;

			this.setState({
				containerAspectRatio
			});
		}
	}, 100)

	handleImageLoad = e => {
		const { naturalWidth, naturalHeight } = this.props;
		const objectAspectRatio = (e.target.naturalHeight || naturalHeight) / (e.target.naturalWidth || naturalWidth);

		this.setState({
			objectAspectRatio
		});
	}

	handleVideoLoad = e => {
		const { naturalWidth, naturalHeight } = this.props;
		const objectAspectRatio = (e.target.videoHeight || naturalHeight) / (e.target.videoWidth || naturalWidth);

		this.setState({
			objectAspectRatio
		});
	}

	render() {
		// eslint-disable-next-line no-unused-vars
		const { className, fit, position, tag, children, naturalWidth, naturalHeight, ...otherProps } = this.props;
		const { objectAspectRatio, containerAspectRatio } = this.state;

		let child = this.props.children;

		if(tag === 'img' || child.type === 'img') {
			child = React.cloneElement(child, {
				onLoad: combineFuncs(this.handleImageLoad, child.props.onLoad)
			});
		}
		else {
			if(tag === 'video' || child.type === 'video') {
				child = React.cloneElement(child, {
					onLoadedMetadata: combineFuncs(this.handleVideoLoad, child.props.onLoadedMetadata)
				});
			}
		}

		let innerWidth = '100%';
		if(containerAspectRatio && objectAspectRatio) {
			const ratio = containerAspectRatio / objectAspectRatio;

			if(fit === 'cover')
				innerWidth = `${Math.max(1, ratio) * 100}%`;
			else
				innerWidth = `${Math.min(1, ratio) * 100}%`;
		}

		return (
			<div 
				{...otherProps}

				ref={ref => this._container = ref}
				className={`object-fit ${position} ${className || ''}`}>

				<div className="object-fit-outer" style={{ width: innerWidth }}>
					<div className="object-fit-inner" style={{ paddingTop: `${objectAspectRatio * 100}%` }}>
						<div className="object-fit-content">
							{child}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

ObjectFitInner.propTypes = {
	children: PropTypes.element,
	className: PropTypes.string,
	fit: PropTypes.oneOf(['cover', 'contain']),
	position: PropTypes.oneOf(['center', 'left', 'top', 'bottom', 'right']),
	tag: PropTypes.oneOf(['img', 'video']),
	naturalWidth: PropTypes.number,
	naturalHeight: PropTypes.number
};

const ObjectFit = props => {
	const { tag, children, fit, position } = props;
	const child = React.Children.only(children);

	if((tag === 'img' || child.type === 'img') && Modernizr.objectfit)
		return (
			<div className={`object-fit-content css ${fit} ${position}`}>
				{child}
			</div>
		);
	else
		return (
			<ObjectFitInner {...props}>
				{child}
			</ObjectFitInner>
		);
};

ObjectFit.propTypes = {
	...ObjectFitInner.propTypes
};

ObjectFit.defaultProps = {
	fit: 'cover',
	position: 'center'
};

export default ObjectFit;