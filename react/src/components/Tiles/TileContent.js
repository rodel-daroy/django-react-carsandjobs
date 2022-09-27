import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TimelineLite } from 'gsap';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import RadialButton from 'components/Buttons/RadialButton';
import Media from 'react-media';
import { mediaQuery } from 'utils/style';
/* import take from 'lodash/take';
import takeRight from 'lodash/takeRight'; */
import ThemeContext from 'components/Common/ThemeContext';
import './TileContent.css';

const fixWidowsOrphans = text => text;

/* function fixWidowsOrphans(text) {
	let words = (text || '').split(' ');

	if(words.length > 3) {
		const firstWords = take(words, 1);
		const lastWords = takeRight(words, 1);
		words.splice(0, 1);
		words.splice(-1, 1);

		const formattedText = [
			firstWords[0],
			<span key="whitespace-1">&nbsp;</span>,

			words.join(' '),

			<span key="whitespace-2">&nbsp;</span>,
			lastWords[0]
		];

		return formattedText;
	}
	else
		return [text];
} */

class TileBody extends Component {
	show(cb) {
		if(this._timeline)
			this._timeline.kill();

		const timeline = new TimelineLite();

		timeline.set([this._body, this._a], { opacity: 0 });
		timeline.set(this._body, { maxHeight: 0 });

		timeline.to(this._body, 1, { maxHeight: 350 });
		timeline.to(this._body, .5, { opacity: 1 }, .5);

		if(this._a) {
			timeline.fromTo(this._a, .5, { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, .5);
		}

		timeline.timeScale(2);

		timeline.eventCallback('onComplete', cb);

		this._timeline = timeline;
	}

	hide(cb) {
		if(this._timeline)
			this._timeline.kill();

		const timeline = new TimelineLite();

		timeline.to(this._body, .5, { maxHeight: 0, opacity: 0 });

		timeline.eventCallback('onComplete', cb);

		this._timeline = timeline;
	}

	updateLayout() {
		const { hover } = this.props;

		if(hover)
			this.show();
		else
			this.hide();
	}

	componentDidMount() {
		this.updateLayout();
	}

	componentWillUnmount() {
		if(this._timeline)
			this._timeline.kill();
	}

	componentDidUpdate(prevProps) {
		if(prevProps.hover !== this.props.hover) {
			this.updateLayout();
		}
	}

	renderButton() {
		const { buttonText, text } = this.props;

		const render = large => {
			if(large)
				return (
					<PrimaryButton as="div" tabIndex={-1} first={!text} last>
						{buttonText} <span className="icon icon-angle-right"></span>
					</PrimaryButton>
				);
			else
				return (
					<RadialButton size="large" as="div">
						<span className="icon icon-angle-right"></span>
					</RadialButton>
				);
		};

		return (
			<div ref={ref => this._a = ref} className="tile-button">
				<Media query={mediaQuery('sm md lg')}>
					{matches => matches ? render(true) : render(false)}
				</Media>
			</div>
		);
	}

	render() {
		const { text } = this.props;

		const formattedText = fixWidowsOrphans(text);

		return (
			<ThemeContext.Provider value={{ dark: true }}>
				<div ref={ref => this._body = ref} className={`tile-body ${text ? '' : 'no-text'}`}>
					{text && (
						<p className="tile-body-text">
							{formattedText}
						</p>
					)}

					{this.renderButton()}
				</div>
			</ThemeContext.Provider>
		);
	}
}

TileBody.propTypes = {
	hover: PropTypes.bool,
	buttonText: PropTypes.string,
	text: PropTypes.string
};

const TileContent = props => {
	const { hover, kind, title, logo } = props;

	const className = `tile-content kind-${kind} ${hover ? 'hover' : ''}`;

	const logoTag = logo ? <img className="tile-logo" src={logo} alt="Logo" /> : null;

	const header = (
		<div className="tile-header">
			<h2>
				{logoTag}
				{fixWidowsOrphans(title)}

				<span className="tile-header-button">
					&nbsp;
					<RadialButton as="div" size="tiny">
						<span className="icon icon-angle-right"></span>
					</RadialButton>
				</span>
			</h2>
		</div>
	);

	return (
		<div className={className}>            
			{header}

			<Media query={mediaQuery('sm md lg')}>
				{matches => <TileBody {...props} hover={!matches || hover} />}
			</Media>
		</div>
	);
};

TileContent.propTypes = {
	title: PropTypes.string,
	text: PropTypes.string,
	buttonText: PropTypes.string,
	hover: PropTypes.bool,
	kind: PropTypes.oneOf([1, 2]).isRequired,
	logo: PropTypes.string
};

TileContent.defaultProps = {	
	title: 'Why sign up for Autolife?',
	text: 'Get Great advice and information you can actually use. No sales the it',
	buttonText: 'Read more',
	kind: 1
};

export default TileContent;