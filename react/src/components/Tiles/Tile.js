import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TimelineLite, TweenLite } from 'gsap';
import Waypoint from 'react-waypoint';
import debounce from 'lodash/debounce';
import pick from 'lodash/pick';
import TileAction, { TileActionPropTypes, VideoPropTypes, AllTileActionPropTypes } from './TileAction';
import { resizeImageUrl } from 'utils';
import ObjectFit from 'components/Common/ObjectFit';
import { SCREEN_XS_MAX } from 'utils/style';
import ThemeContext from 'components/Common/ThemeContext';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';
import './Tile.css';

const DEFAULT_BACKGROUND_WIDTH = 960;
const TILE_HEIGHT = 350;

const START_DELAY = 0;
const DELAY = 1;

let started = false;

class Tile extends Component {
	constructor(props) {
		super(props);

		this.state = {
			hover: false,
			entered: false,
			active: false,
			animate: props.animate || !props.initialPageLoaded,
			resizedImageUrl: this.getResizedImageUrl(props.imageUrl)
		};

		this.debounceHandleResize = debounce(this.handleResize, 200);
	}

	componentDidMount() {
		window.addEventListener('mousemove', this.handleMouseMove);

		this._resizeSensor = new ResizeSensor(this._container, this.debounceHandleResize);

		this.handleMedia();
	}

	componentWillUnmount() {
		window.removeEventListener('mousemove', this.handleMouseMove);

		if(this._resizeSensor)
			this._resizeSensor.detach();

		TweenLite.killTweensOf(this._background);
		if (this._timeline) {
			this._timeline.kill();
			delete this._timeline;
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if(nextProps.imageUrl !== this.props.imageUrl)
			this.handleMedia(nextProps);
	}

	componentDidUpdate(prevProps) {
		if(prevProps.imageUrl !== this.props.imageUrl || prevProps.videoWallpaper !== this.props.videoWallpaper)
			this.handleResize();
	}

	get isMobile() {
		if(!this._container)
			return true;

		const width = this._container.clientWidth;
		return width <= SCREEN_XS_MAX;
	}

	getResizedImageUrl(imageUrl) {
		if(this.isMobile)
			return resizeImageUrl(imageUrl, SCREEN_XS_MAX, TILE_HEIGHT);
		else
			return resizeImageUrl(imageUrl, DEFAULT_BACKGROUND_WIDTH, TILE_HEIGHT);
	}

	handleMedia = (props = this.props) => {
		const { imageUrl } = props;

		const resizedImageUrl = this.getResizedImageUrl(imageUrl);
		if(resizedImageUrl !== this.state.resizedImageUrl)
			this.setState({ resizedImageUrl });
	}

	handleResize = () => {
		if (this._background) {
			TweenLite.killTweensOf(this._background);
			TweenLite.set(this._background, { clearProps: 'transform' });
		}
	}

	handleMouseMove = e => {
		const { hover, active } = this.state;

		if (!this.isMobile && hover && active && this._background) {
			const factor = -0.05;

			const width = window.innerWidth;
			const height = window.innerHeight;
			const posX = e.clientX;
			const posY = e.clientY;

			const offsetX = (posX / width - 0.5) * factor * 100;
			const offsetY = (posY / height - 0.5) * factor * 100;

			TweenLite.killTweensOf(this._background);
			TweenLite.to(this._background, 0.2, {
				xPercent: offsetX,
				yPercent: offsetY
			});
		}
	}

	handleMouseEnter = () => {
		this.setState({
			hover: true
		});
	}

	handleMouseLeave = () => {
		this.setState({
			hover: false
		});
	}

	reveal() {
		if (this._timeline) {
			this._timeline.kill();
		}

		const timeline = new TimelineLite();
		this._timeline = timeline;

		timeline.eventCallback('onComplete', () => {
			this.setState({
				active: true
			});
		});

		timeline.set(this._maskBackground, { height: '100%' }, 0);
		timeline.to(
			this._maskBackground,
			1,
			{ height: '0%', display: 'none' },
			DELAY
		);

		timeline.timeScale(2);

		if (!started) {
			timeline.delay(START_DELAY);
			timeline.call(
				() => (started = true),
				null,
				null,
				START_DELAY
			);
		}

		this.setState({
			entered: true
		});
	}

	handleWaypointEnter = () => {
		const { entered, animate } = this.state;

		if (!entered && animate && this._tile) {
			this.reveal();
		}
		else
			this.setState({
				active: true
			});
	}

	render() {
		const { hover, active, animate, resizedImageUrl } = this.state;
		const { videoWallpaper } = this.props;
		const children = React.Children.toArray(this.props.children);

		return (
			<Waypoint onEnter={this.handleWaypointEnter} scrollableAncestor={window}>
				<article
					ref={ref => this._container = ref}
					className={`tile ${active ? 'active' : ''}`}
					onMouseEnter={this.handleMouseEnter}
					onMouseLeave={this.handleMouseLeave}
					onFocus={this.handleMouseEnter}
					onBlur={this.handleMouseLeave}>

					<TileAction {...pick(this.props, Object.keys(AllTileActionPropTypes))}>
						<div ref={ref => (this._tile = ref)} className="tile-outer">
							<div
								ref={ref => (this._background = ref)}
								className="tile-background"
							>
								{!videoWallpaper &&
									<div
										className="tile-background-image"
										style={{ backgroundImage: `url(${resizedImageUrl})` }}
									/>}

								{videoWallpaper && (
									<ObjectFit>
										<video
											ref={ref => (this._video = ref)}
											preload="auto"
											poster={null}
											loop
											muted
											autoPlay
											playsInline>
											<source src={videoWallpaper.src} type={videoWallpaper.type} />
										</video>
									</ObjectFit>
								)}
							</div>

							<ThemeContext.Provider value={{ dark: true }}>
								<div className="tile-inner">
									{children.map((child, i) => {
										const ChildType = child.type;

										return (
											<ChildType
												key={i}
												ref={child.ref}
												{...child.props}
												hover={hover}
											/>
										);
									})}
								</div>
							</ThemeContext.Provider>
						</div>
					</TileAction>

					{animate && (
						<div
							ref={ref => (this._maskBackground = ref)}
							className="tile-mask-background"
						/>
					)}
				</article>
			</Waypoint>
		);
	}
}

Tile.propTypes = {
	imageUrl: PropTypes.string,
	videoWallpaper: PropTypes.shape(VideoPropTypes),
	animate: PropTypes.bool,
	rowIndex: PropTypes.number,

	...TileActionPropTypes
};

export default Tile;
