import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { childrenOfType, integer } from 'airbnb-prop-types';
import { TimelineLite } from 'gsap';
import './TabSet.css';

let tabId = 0;

class TabSet extends Component {
	constructor(props) {
		super(props);

		this.state = {
			id: ++tabId,
			selected: props.index || 0
		};

		this._tabs = [];
	}

	componentDidUpdate(prevProps, prevState) {
		const { index } = this.props;
		const { selected } = this.state;

		if(index != null && prevProps.index !== index)
			this.setState({
				selected: index
			});

		if(selected !== prevState.selected)
			this.animateIndicator(prevState.selected, selected);
	}

	animateIndicator(from = 0, to) {
		const fromTab = this._tabs[from];
		const toTab = this._tabs[to];

		if(this._timeline)
			this._timeline.kill();

		const timeline = new TimelineLite();
		timeline.call(() => this._container.classList.add('animating'));
		timeline.fromTo(this._indicator, .3, { 
			left: fromTab.offsetLeft,
			width: fromTab.offsetWidth
		}, {
			left: toTab.offsetLeft,
			width: toTab.offsetWidth
		});
		timeline.call(() => this._container.classList.remove('animating'));

		this._timeline = timeline;
	}

	componentWillUnmount() {
		if(this._timeline)
			this._timeline.kill();
	}

	handleChange = i => {
		this.setState({
			selected: i
		});

		const { onChange } = this.props;
		if(onChange)
			onChange(i);
	}

	renderContent() {
		const { children, renderHidden } = this.props;
		const { selected } = this.state;

		const tabs = React.Children.toArray(children);

		if(!renderHidden)
			return tabs[selected].props.children();
		else
			return tabs.map((tab, i) => {
				const visible = i === selected;

				return (
					<div key={i} className={`tab-set-content-tab ${visible ? 'visible' : ''}`}>
						{tab.props.children()}
					</div>
				);
			});
	}

	render() {
		const { name, children, className } = this.props;
		const { id, selected } = this.state;

		const tabs = React.Children.toArray(children);

		let tabId = id;

		return (
			<div ref={ref => this._container = ref} className={`tab-set ${className || ''}`}>
				<div className="tab-set-tabs">
					{tabs.map((tab, i) => (
						<div key={i} className="tab-set-tab" ref={ref => this._tabs[i] = ref}>
							<input 
								id={`tab${tabId}-${i}`} 
								type="radio" 
								name={name} 
								checked={selected === i}
								onChange={() => this.handleChange(i)} />

							<label htmlFor={`tab${tabId}-${i}`}>{tab.props.caption}</label>
						</div>
					))}

					<div ref={ref => this._indicator = ref} className="tab-set-indicator"></div>
				</div>

				<div className="tab-set-content">
					{this.renderContent()}
				</div>
			</div>
		);
	}
}

TabSet.Tab = () => null;

TabSet.Tab.propTypes = {
	caption: PropTypes.node,
	children: PropTypes.func
};

TabSet.Tab.defaultProps = {
	children: () => null
};

TabSet.Tab.displayName = 'TabSet.Tab';

TabSet.propTypes = {
	name: PropTypes.string.isRequired,
	children: childrenOfType(TabSet.Tab).isRequired,
	className: PropTypes.string,
	index: integer(),
	onChange: PropTypes.func,
	renderHidden: PropTypes.bool
};

export default TabSet;