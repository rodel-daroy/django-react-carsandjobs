import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { integer } from 'airbnb-prop-types';
import HeaderStrip from 'components/Layout/HeaderStrip';
import CardList from './CardList';
import { connect } from 'react-redux';
import { showModal } from 'redux/actions/modals';
import MasterDetail from 'components/Layout/MasterDetail';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import Sticky from 'react-sticky-el';
import HeaderStripContent from 'components/Layout/HeaderStripContent';
import HeaderStripContentLarge from 'components/Layout/HeaderStripContentLarge';
import CommandBar from 'components/Layout/CommandBar';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import Localized from 'components/Localization/Localized';
import LocalizedNode from 'components/Localization/LocalizedNode';
import './ListView.css';

class ListView extends Component {
	state = {
		selectedId: null
	}

	static getDerivedStateFromProps(props, state) {
		const { items } = props;
		const { selectedId } = state;

		if(!(items || []).find(cl => cl.id === selectedId))
			return {
				selectedId: null
			};
		
		return null;
	}

	doDelete = (id, close) => () => {
		this.props.onDelete(id);

		close();
	}

	handleDelete = item => {
		const { card: Card } = this.props;

		this.setState({
			selectedId: item.id
		});

		this.props.showModal({
			title: <LocalizedNode names="Common" groupKey="ConfirmDeleteTitle" />,
			content: ({ close }) => (
				<Localized names="Common">
					{({ CancelLabel, DeleteLabel }) => (
						<div>
							<Card as="div" item={item} clickable={false} />

							<CommandBar>
								<PrimaryButton onClick={close}>
									{CancelLabel}
								</PrimaryButton>
								<PrimaryLink as="button" onClick={this.doDelete(item.id, close)}>
									{DeleteLabel}
								</PrimaryLink>
							</CommandBar>
						</div>
					)}
				</Localized>
			)
		});
	}

	renderList = () => {
		const { items, loading, card: Card, emptyText, onDelete, totalCount, onLoadMore } = this.props;
		const { selectedId } = this.state;

		return (
			<div className="list-view-list">
				<CardList emptyText={emptyText} loading={loading} totalCount={totalCount} onLoadMore={onLoadMore}>
					{(items || []).map((item, i) => (
						<Card 
							item={item}
							key={i}
							selected={selectedId === item.id}
							onDelete={onDelete ? this.handleDelete : null} />
					))}
				</CardList>
			</div>
		);
	}

	render() {
		const { title, backTo, backButton: Back, addButton: Add } = this.props;

		return (
			<div className="list-view">
				<HeaderStrip>
					<HeaderStripContentLarge>
						{backTo && <HeaderStripContent.Back to={backTo} />}

						{title}
					</HeaderStripContentLarge>
				</HeaderStrip>

				<MasterDetail 
					className="list-view-md"
					showDetail
					master={() => (
						<Sticky>
							<div className="list-view-commands">
								<Add />
							</div>
						</Sticky>
					)}
					detail={this.renderList} />

				<Sticky mode="bottom" positionRecheckInterval={200}>
					<CommandBar layout="mobile" mobileSize="xs sm">
						<Back />
						<Add />
					</CommandBar>
				</Sticky>
			</div>
		);
	}
}

ListView.propTypes = {
	title: PropTypes.node,
	backTo: PropTypes.any.isRequired,
	items: PropTypes.array,
	loading: PropTypes.bool,
	card: PropTypes.func.isRequired,
	backButton: PropTypes.func.isRequired,
	addButton: PropTypes.func.isRequired,
	emptyText: PropTypes.string,
	onDelete: PropTypes.func,
	totalCount: integer(),
	onLoadMore: PropTypes.func,
	
	showModal: PropTypes.func.isRequired
};

export default connect(null, { showModal })(ListView);