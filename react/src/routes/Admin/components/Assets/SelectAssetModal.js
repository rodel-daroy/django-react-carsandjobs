import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modals/Modal';
import ResponsiveModalFrame from 'components/Modals/ResponsiveModalFrame';
import AssetSelector from './AssetSelector';
import TabSet from 'components/Navigation/TabSet';
import AssetForm from './AssetForm';
import { connect } from 'react-redux';
import { createAsset } from 'redux/actions/assets';
import LoadingOverlay from 'components/Common/LoadingOverlay';
import usePrevious from 'hooks/usePrevious';
import './SelectAssetModal.css';

const SelectAssetModal = ({ isOpen, onClose, onSubmit, selectedId, createAsset, asset: { loading, result } }) => {
	const prevResult = usePrevious(result);
	useEffect(() => {
		if(isOpen && result && result !== prevResult)
			onSubmit(result);
	}, [isOpen, result, prevResult, onSubmit]);
	
	const handleAssetSelect = (id, asset) => {
		onSubmit(asset);
	};

	const handleAssetCreate = asset => {
		createAsset(asset, {
			transformError: error => {
				if(error.status === 409)
					return new Error('There is already an asset with this name');

				return error;
			}
		});
	};

	return (
		<Modal className="select-asset-modal" isOpen={isOpen} onRequestClose={onClose}>
			<ResponsiveModalFrame title={<h2>Select asset</h2>} onRequestClose={onClose}>
				<div className="select-asset-modal-inner">
					<TabSet name="selectAssetTabs" className="select-asset-modal-tabs">
						<TabSet.Tab caption="Use existing asset">
							{() => (
								<AssetSelector selectedId={selectedId} onChange={handleAssetSelect} />
							)}
						</TabSet.Tab>
						<TabSet.Tab caption="Upload asset">
							{() => (
								<AssetForm onSubmit={handleAssetCreate} />
							)}
						</TabSet.Tab>
					</TabSet>

					{loading && (
						<LoadingOverlay />
					)}
				</div>
			</ResponsiveModalFrame>
		</Modal>
	);
};

SelectAssetModal.propTypes = {
	selectedId: PropTypes.string,
	isOpen: PropTypes.bool,
	onClose: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,

	createAsset: PropTypes.func.isRequired,
	asset: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	asset: state.assets.createAsset
});
 
export default connect(mapStateToProps, { createAsset })(SelectAssetModal);