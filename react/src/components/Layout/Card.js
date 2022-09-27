import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';
import LocaleLink from 'components/Localization/LocaleLink';
import './Card.css';

class Card extends Component {
	state = {}

	componentDidMount() {
		this._resizeSensor = new ResizeSensor(this._container, this.handleResize);
		this.handleResize();
	}

	componentWillUnmount() {
		this._resizeSensor.detach();
	}

	handleResize = () => {
		const width = this._container.clientWidth;
		const collapse = width < 350;

		if(this.state.collapse !== collapse)
			this.setState({ collapse });
	}

	render() {
		const { 
			children,
			image,
			selected, 
			as: Component, 
			clickable, 
			className,
			active, 
			age,
			status,
			leftActions,
			rightActions,

			...otherProps 
		} = this.props;
		const { collapse } = this.state;

		return (
			<div className={`card ${!active ? 'inactive' : ''} ${className || ''}`}>
				{clickable && leftActions}

				<Component 
				/* eslint-disable react/no-find-dom-node */
					ref={ref => this._container = findDOMNode(ref)}
					/* eslint-enable */
					className={`card-outer ${collapse ? 'collapse' : ''} ${selected ? 'selected' : ''} ${clickable ? 'clickable' : ''}`} 
					{...otherProps}>

					<div className="card-inner">
						{image && (
							<div className="card-image">
								{image}
							</div>
						)}
						<div className="card-body">
							{children}
						</div>
						{(age || status) && (
							<div className="card-right">
								<div className="card-age">{age}</div>

								<div className="card-status">
									{status}
								</div>
							</div>
						)}
					</div>
				</Component>

				{clickable && rightActions}
			</div>
		);
	}
}

Card.propTypes = {
	selected: PropTypes.bool,
	clickable: PropTypes.bool,
	as: PropTypes.any,
	className: PropTypes.string,
	active: PropTypes.bool,
	children: PropTypes.node,
	age: PropTypes.node,
	status: PropTypes.node,
	image: PropTypes.node,
	leftActions: PropTypes.node,
	rightActions: PropTypes.node
};

Card.defaultProps = {
	as: LocaleLink,
	clickable: true,
	active: true
};

Card.Name = props => (
	<div {...props} className="card-name"></div>
);

Card.Name.displayName = 'Card.Name';

Card.Description = props => (
	<div {...props} className="card-description"></div>
);

Card.Description.displayName = 'Card.Description';

export default Card;