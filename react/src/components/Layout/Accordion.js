import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TimelineLite } from 'gsap';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';
import ExpandButton from 'components/Buttons/ExpandButton';
import './Accordion.css';

const Accordion = props => {
	const { open, className, children, ...otherProps } = props;

	return (
		<section {...otherProps} className={`accordion ${open ? 'open' : ''} ${className || ''}`}>
			{children}
		</section>
	);
};

Accordion.propTypes = {
	open: PropTypes.bool,
	children: PropTypes.node,
	className: PropTypes.string
};

Accordion.Header = class extends Component {
	constructor(props) {
		super(props);

		this.state = {
			hover: false
		};
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

	render() {
		const {
			children,
			open,
			onOpen,
			onClose,
			canToggle,
			className,
			icon
		} = this.props;
		const { hover } = this.state;

		const handleClick = () => {
			if (open) {
				if (onClose) onClose();
			} else {
				if (onOpen) onOpen();
			}
		};

		return (
			<header className={`accordion-header ${className || ''}`}>
				<button
					type="button"
					className="accordion-button"
					onClick={canToggle ? handleClick : null}
					onMouseEnter={this.handleMouseEnter}
					onMouseLeave={this.handleMouseLeave}
					aria-expanded={open}>

					<div className="accordion-header-inner">
						{children}
					</div>

					{canToggle &&
						icon &&
						icon({ open, hover })}
				</button>
			</header>
		);
	}
};

Accordion.Header.displayName = 'Accordion.Header';

Accordion.Header.propTypes = {
	children: PropTypes.node,
	open: PropTypes.bool,
	onOpen: PropTypes.func,
	onClose: PropTypes.func,
	canToggle: PropTypes.bool,
	className: PropTypes.string,
	icon: PropTypes.func
};

Accordion.Header.defaultProps = {
	canToggle: true,
	/* eslint-disable react/display-name, react/prop-types */
	icon: ({ open, hover }) => <ExpandButton expanded={open} as="div" hover={hover} />
	/* eslint-enable */
};

Accordion.Body = class extends Component {
	componentDidMount() {
		const handleResize = () => {
			this._height = this._inner.clientHeight;
		};

		this._resizeSensor = new ResizeSensor(this._inner, handleResize);
		handleResize();

		this.updateLayout(true);
	}

	componentWillUnmount() {
		this._resizeSensor.detach();

		if (this._timeline) this._timeline.kill();
	}

	componentDidUpdate(prevProps) {
		if (prevProps.open !== this.props.open) this.updateLayout();
	}

	updateLayout(immediate) {
		if (this.props.open) this.show(immediate);
		else this.hide(immediate);
	}

	show(immediate, cb) {
		const { duration } = this.props;

		if (this._timeline) this._timeline.kill();

		const timeline = new TimelineLite();

		timeline.fromTo(
			this._container,
			duration,
			{ height: 0 },
			{ height: this._height, visibility: 'visible' },
			0
		);
		timeline.set(this._container, { clearProps: 'height' });
		timeline.fromTo(
			this._container,
			duration,
			{ opacity: 0 },
			{ opacity: 1, clearProps: 'opacity' },
			duration / 2
		);
		timeline.eventCallback('onComplete', cb);

		if (immediate) timeline.seek('+=0', false);

		this._timeline = timeline;
	}

	hide(immediate, cb) {
		const { duration } = this.props;

		if (this._timeline) this._timeline.kill();

		const timeline = new TimelineLite();

		timeline.to(this._container, duration, { opacity: 0 });
		timeline.fromTo(
			this._container,
			duration,
			{ height: this._height },
			{ height: 0, visibility: 'hidden' },
			duration / 2
		);
		timeline.eventCallback('onComplete', cb);

		if (immediate) timeline.seek('+=0', false);

		this._timeline = timeline;
	}

	render() {
		const { children, className } = this.props;

		return (
			<div
				ref={ref => (this._container = ref)}
				className={`accordion-body ${className || ''}`}
			>
				<div ref={ref => (this._inner = ref)} className="accordion-body-inner">
					{children}
				</div>
			</div>
		);
	}
};

Accordion.Body.displayName = 'Accordion.Body';

Accordion.Body.propTypes = {
	children: PropTypes.node,
	duration: PropTypes.number,
	className: PropTypes.string,
	open: PropTypes.bool
};

Accordion.Body.defaultProps = {
	duration: 0.75
};

export default Accordion;
