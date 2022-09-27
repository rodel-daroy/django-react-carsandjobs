import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RadialButton from 'components/Buttons/RadialButton';
import Modal from 'components/Modals/Modal';
import ThemeContext from 'components/Common/ThemeContext';
import './VideoFrame.css';

const MAX_PERCENT_WIDTH = 90;

const DEFAULT_WIDTH = 560;
const DEFAULT_HEIGHT = 315;

class VideoFrame extends Component {
	constructor(props) {
		super(props);

		this.state = {
			videoWidth: 0,
			videoHeight: 0,
			widthPercent: MAX_PERCENT_WIDTH,
			heightPercent: null
		};
	}

	updateSize({ videoWidth, videoHeight } = this.state) {
		if(videoWidth && videoHeight) {
			const aspectRatio = videoHeight / videoWidth;
			const windowAspectRatio = window.innerHeight / window.innerWidth;

			let { widthPercent, heightPercent } = this.state;

			if(windowAspectRatio < aspectRatio) {
				heightPercent = MAX_PERCENT_WIDTH;
				widthPercent = ((heightPercent / 100) * window.innerHeight / aspectRatio) / window.innerWidth * 100;
			}
			else {
				widthPercent = MAX_PERCENT_WIDTH;
				heightPercent = null;
			}

			this.setState({
				widthPercent,
				heightPercent
			});
		}
	}

	handleResize = () => {
		this.updateSize();
	}

	componentDidMount () {
		window.addEventListener('resize', this.handleResize);
	}

	componentWillUnmount () {
		window.removeEventListener('resize', this.handleResize);
	}

	handleLoaded = () => {
		let state;
		if(this._video && this._video.videoWidth) {
			state = {
				videoWidth: this._video.videoWidth,
				videoHeight: this._video.videoHeight
			};
		}

		if(this._iframe) {
			state = {
				videoWidth: DEFAULT_WIDTH,
				videoHeight: DEFAULT_HEIGHT
			};
		}

		this.setState(state);
		this.updateSize(state);
	}

	renderVideo() {
		const { src, type, embedUrl } = this.props;

		if(src)
			return (
				<video
					ref={ref => this._video = ref} 
					className="video-frame-video" 
					autoPlay 
					controls 
					preload="auto" 
					onLoadedMetadata={this.handleLoaded}>

					<source src={src} type={type} />
				</video>
			);

		return (
			<iframe 
				ref={ref => this._iframe = ref}
				className="video-frame-video" 
				title="Video" 
				src={embedUrl}
				allow="autoplay; fullscreen"
				onLoad={this.handleLoaded}>
			</iframe>
		);
	}

	handleClose = e => {
		const { onClose } = this.props;
		
		e.stopPropagation();

		if(onClose)
			onClose();
	}

	render() {
		const { isOpen } = this.props;
		const { videoWidth, videoHeight, widthPercent, heightPercent } = this.state;

		const paddingTop = `${videoHeight / videoWidth * 100}%`;
		const width = widthPercent ? `${widthPercent}vw` : null;
		const height = heightPercent ? `${heightPercent}vh` : null;

		return (
			<ThemeContext.Provider value={{ dark: true }}>
				<Modal className={`${videoHeight ? 'resized' : ''} video-frame`} isOpen={isOpen} onRequestClose={this.handleClose}>
					<div className="video-frame-content">
						<div className="video-frame-inner" style={{ paddingTop, width, height }}>
							{this.renderVideo()}
						</div>

						<div className="video-frame-close">
							<RadialButton size="large" onClick={this.handleClose}>
								<span className="icon icon-cancel"></span>
							</RadialButton>
						</div>
					</div>
				</Modal>
			</ThemeContext.Provider>
		);
	}
}

VideoFrame.propTypes = {
	src: PropTypes.string,
	type: PropTypes.string,
	onClose: PropTypes.func,
	embedUrl: PropTypes.string,
	isOpen: PropTypes.bool
};

export default VideoFrame;