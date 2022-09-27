import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ThemeContext from 'components/Common/ThemeContext';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';
import { MAX_WIDTH, SCREEN_MD_MAX, SCREEN_XS_MAX } from 'utils/style';
import { Image } from './types';
import ResponsiveImage from 'components/Common/ResponsiveImage';
import './ASpot.css';

const IMAGE_SIZES = [
	[MAX_WIDTH, 800],
	[SCREEN_MD_MAX, 800],
	[SCREEN_XS_MAX, 600]
];

class ASpot extends Component {
	state = {
		minHeight: null
	}

	componentDidMount() {
		this._resizeSensor = new ResizeSensor(this._container, this.handleResize);
		this.handleResize();
	}

	componentWillUnmount() {
		if(this._resizeSensor)
			this._resizeSensor.detach();
	}

	handleResize = () => {
		if(this._content.clientHeight > this._container.clientHeight) {
			if(this.state.minHeight !== this._content.clientHeight)
				this.setState({
					minHeight: this._content.clientHeight
				});
		}
	}

	render() {
		const { children, image, className } = this.props;
		const { minHeight } = this.state;

		return (
			<header 
				ref={ref => this._container = ref} 
				className={`a-spot ${!image ? 'no-image' : ''} ${className || ''}`}
				style={{ minHeight }}>

				<ThemeContext.Provider value={{ dark: !!image }}>
					{image && (
						<ResponsiveImage {...image} className="a-spot-background" sizes={IMAGE_SIZES} />
					)}

					<div ref={ref => this._content = ref} className="a-spot-content">
						{children}
					</div>
				</ThemeContext.Provider>
			</header>
		);
	}
}

ASpot.propTypes = {
	children: PropTypes.node,
	image: Image,
	className: PropTypes.string
};
 
export default ASpot;