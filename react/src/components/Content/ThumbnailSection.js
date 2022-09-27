/* eslint-disable react/no-find-dom-node */
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import { childrenOfType, integer } from 'airbnb-prop-types';
import ArticleThumbnail from 'components/Content/ArticleThumbnail';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import { TimelineLite } from 'gsap';
import './ThumbnailSection.css';

const MIN_THUMBNAIL_WIDTH = 280;
const THUMBNAIL_PADDING = 20;

class ThumbnailSectionCell extends Component {
	reveal(cb) {
		const { index = 0, delay = 0 } = this.props;

		if(this._timeline)
			this._timeline.kill();

		const timeline = this._timeline = new TimelineLite();

		timeline.set(this._cell, { opacity: 0, scale: .75 });
		timeline.to(this._cell, .2, { opacity: 1, scale: 1, clearProps: 'opacity,transform' });

		timeline.delay(index * .1 + delay);

		timeline.eventCallback('onComplete', cb);
	}

	componentWillAppear(cb) {
		this.reveal(cb);
	}

	componentWillEnter(cb) {
		this.reveal(cb);
	}

	componentWillUnmount() {
		if(this._timeline)
			this._timeline.kill();
	}

	render() {
		const { columns, children } = this.props;

		return (
			<li ref={ref => this._cell = ref} className={`thumbnail-section-cell col-${columns}`}>
				{children}
			</li>
		);
	}
}

ThumbnailSectionCell.propTypes = {
	index: integer(),
	delay: PropTypes.number,
	columns: integer(),
	children: PropTypes.node
};

class ThumbnailSection extends Component {
	constructor(props) {
		super(props);

		this.state = {
			columns: 1,
			previousLoad: 0,
			delay: props.delay
		};
	}

	componentDidMount() {
		this._resizeSensor = new ResizeSensor(this._container, this.handleResize);
		this.handleResize();
	}

	componentWillUnmount() {
		this._resizeSensor.detach();
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		const { delay } = this.props;
		const childCount = React.Children.count(this.props.children);

		if(nextProps.delay !== delay)
			this.setState({
				delay: nextProps.delay
			});

		if(React.Children.count(nextProps.children) !== childCount) {
			this.setState({
				previousLoad: childCount
			});
		}
	}

	handleRef = ref => {
		if(ref)
			this._container = findDOMNode(ref);
		else
			this._container = null;
	}

	handleResize = () => {
		const width = this._container.clientWidth;

		const columns = Math.max(1, Math.floor(width / (MIN_THUMBNAIL_WIDTH + THUMBNAIL_PADDING * 2)));

		if(this.state.columns !== columns)
			this.setState({
				columns
			});
	}

	render() {
		const { orientation } = this.props;
		const children = React.Children.toArray(this.props.children);
		const { columns, previousLoad, delay } = this.state;
	
		return (
			<TransitionGroup ref={this.handleRef} className={`thumbnail-section ${orientation}`} component="ul">
				{children.map((child, i) => (
					<ThumbnailSectionCell 
						key={`${i}-${child.slug}`}
						columns={columns} 
						index={Math.max(0, i - previousLoad)}
						delay={delay}>

						{child}
					</ThumbnailSectionCell>
				))}
			</TransitionGroup>
		);
	}
}

ThumbnailSection.propTypes = {
	children: childrenOfType(ArticleThumbnail),
	delay: PropTypes.number,
	orientation: PropTypes.oneOf(['horizontal', 'vertical']).isRequired
};

ThumbnailSection.defaultProps = {
	orientation: 'horizontal'
};

export default ThumbnailSection;

