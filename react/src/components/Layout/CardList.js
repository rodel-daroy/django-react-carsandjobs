import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { integer, childrenOfType } from 'airbnb-prop-types';
import Spinner from 'components/Common/Spinner';
import EmptyState from 'components/Layout/EmptyState';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import CardListGroup from './CardListGroup';
import Localized from 'components/Localization/Localized';
import './CardList.css';

class CardList extends Component {
	constructor(props) {
		super(props);

		this._items = [];
	}

	componentDidMount() {
		const children = React.Children.toArray(this.props.children);

		const selectedIndex = children.findIndex(child => !!child.props.selected);
		if(selectedIndex !== -1) {
			const item = this._items[selectedIndex];
			item.scrollIntoView();
		}
	}

	renderChildren() {
		let { groups, children } = this.props;

		groups = React.Children.toArray(groups);
		children = React.Children.toArray(children);

		if(groups.length > 0) {
			let offset = 0;
			
			return groups.map((group, i) => {
				const matching = group.props.filter(children);

				const groupChildren = matching.map((child, i) => (
					<li key={i} ref={ref => this._items[i + offset] = ref}>
						{child}
					</li>
				));

				offset += groupChildren.length;

				return (
					<React.Fragment key={i}>
						{React.cloneElement(group, null, ...groupChildren)}
					</React.Fragment>
				);
			});
		}
		else
			return (
				<ol>
					{children.map((child, i) => (
						<li key={i} ref={ref => this._items[i] = ref}>
							{child}
						</li>
					))}
				</ol>
			);
	}

	render() {
		/* eslint-disable no-unused-vars */
		const { children, loading, className, emptyText, onLoadMore, totalCount, groups, footer, ...otherProps } = this.props;
		/* eslint-enable */
		
		const childArray = React.Children.toArray(children);

		const hasMore = childArray.length < totalCount;

		return (
			<Localized names="Common">
				{({ LoadMoreLabel, NoItemsFoundLabel }) => (
					<div {...otherProps} className={`card-list ${className || ''}`}>
						{this.renderChildren()}

						{loading && (
							<Spinner />
						)}

						{!loading && !hasMore && childArray.length === 0 && React.Children.count(groups) === 0 && (
							<EmptyState className="card-list-empty-state">
								{emptyText || NoItemsFoundLabel} 
							</EmptyState>
						)}

						{!loading && onLoadMore && hasMore && (
							<div className="card-list-load-more">
								<PrimaryButton className="load-more" onClick={onLoadMore} size="medium">
									{LoadMoreLabel}
								</PrimaryButton>
							</div>
						)}

						{!loading && footer && !hasMore && (
							<div className="card-list-footer">
								{footer()}
							</div>
						)}
					</div>
				)}
			</Localized>
		);
	}
}

CardList.propTypes = {
	children: PropTypes.node,
	totalCount: integer(),
	onLoadMore: PropTypes.func,
	loading: PropTypes.bool,
	className: PropTypes.string,
	emptyText: PropTypes.node,
	groups: childrenOfType(CardListGroup),
	footer: PropTypes.func
};

export default CardList;