import React from 'react';
import PropTypes from 'prop-types';
import { childrenOfType } from 'airbnb-prop-types';
import TileSlot from './TileSlot';
import TileView from './TileView';
import TileEditViewSlot from './TileEditViewSlot';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import './TileEditView.css';

const TileEditView = ({ children, onInsert, onMove, onEdit, onDelete }) => {
	const slots = React.Children.toArray(children);

	const handleMove = sourceIndex => destIndex => onMove(sourceIndex, destIndex);

	return (
		<section className="tile-edit-view">
			{slots.length === 0 && (
				<div className="tile-edit-view-add">
					<PrimaryButton onClick={() => onInsert(0)}>
						Add tile
					</PrimaryButton>
				</div>
			)}

			<TileView>
				{slots.map((slot, i) => React.cloneElement(slot, {}, (
					<TileEditViewSlot 
						key={i} 
						index={i}
						onInsert={onInsert} 
						onMove={handleMove(i)}
						onEdit={onEdit}
						onDelete={onDelete}>

						{slot.props.children}
					</TileEditViewSlot>
				)))}
			</TileView>
		</section>
	);
};

TileEditView.propTypes = {
	children: childrenOfType(TileSlot),
	onInsert: PropTypes.func.isRequired,
	onMove: PropTypes.func.isRequired,
	onEdit: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired
};
 
export default TileEditView;
