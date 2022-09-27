import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CommandBar from 'components/Layout/CommandBar';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import CheckboxField from 'components/Forms/CheckboxField';
import './RemoveTileModal.css';

const RemoveTileModal = ({ onRemove, onDelete, onCancel }) => {
	const [deleteTile, setDeleteTile] = useState(false);

	const handleChange = e => {
		const value = e.target.checked;
		if(value !== deleteTile)
			setDeleteTile(value);
	};

	return (
		<div className="remove-tile-modal">
			<p>Are you sure you want to remove this tile?</p>

			<div className="remove-tile-modal-check">
				<CheckboxField
					label="Permanently delete tile"
					value={deleteTile}
					onChange={handleChange} />
			</div>

			<CommandBar>
				<PrimaryButton type="button" onClick={deleteTile ? onDelete : onRemove}>
					{deleteTile ? 'Delete' : 'Remove'} tile
				</PrimaryButton>
				<PrimaryLink hasIcon iconClassName="icon icon-cancel" onClick={onCancel}>
					Cancel
				</PrimaryLink>
			</CommandBar>
		</div>
	);
};

RemoveTileModal.propTypes = {
	onRemove: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired
};
 
export default RemoveTileModal;