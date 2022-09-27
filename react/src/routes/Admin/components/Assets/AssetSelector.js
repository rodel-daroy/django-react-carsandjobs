import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadAssets } from 'redux/actions/assets';
import PagedList from 'components/Layout/PagedList';
import AssetPreview from './AssetPreview';
import TextField from 'components/Forms/TextField';
import { useDebouncedCallback } from 'use-debounce';
import usePrevious from 'hooks/usePrevious';
import './AssetSelector.css';

const AssetSelectorAsset = ({ asset, onClick, selected }) => (
	<button 
		className={`asset-selector-asset ${selected ? 'selected' : ''}`} 
		type="button" 
		onClick={onClick}>

		<AssetPreview asset={asset}></AssetPreview>
	</button>
);

AssetSelectorAsset.propTypes = {
	asset: PropTypes.object.isRequired,
	onClick: PropTypes.func,
	selected: PropTypes.bool
};

const AssetSelector = ({ loadAssets, assets: { loading, all }, onChange, selectedId }) => {
	const [pageIndex, setPageIndex] = useState();
	const [searchText, setSearchText] = useState('');
	const [key, setKey] = useState(0);

	const handleRangeChange = ({ startIndex, endIndex }) => {
		loadAssets({
			startIndex,
			count: (endIndex - startIndex) + 1,
			filter: {
				name: searchText
			}
		});
	};

	const handleSearchTextChange = e => {
		const text = e.target.value;
		if(text !== searchText) {
			setSearchText(text);
		}
	};

	const [updateKey] = useDebouncedCallback(() => {
		setKey(key => key + 1);
		setPageIndex(0);
	}, 500);

	const prevSearchText = usePrevious(searchText);
	useEffect(() => {
		if(searchText !== prevSearchText)
			updateKey();
	}, [searchText, prevSearchText, updateKey]);

	const renderAssets = useCallback(({ startIndex, endIndex }) => {
		return (
			<div className="asset-selector-assets">
				{(all || []).slice(startIndex, endIndex).filter(asset => !!asset).map(asset => (
					<AssetSelectorAsset 
						key={asset.id} 
						asset={asset} 
						onClick={() => onChange(asset.id, asset)}
						selected={asset.id === selectedId} />
				))}
			</div>
		);
	}, [onChange, all, selectedId]);

	return (
		<div>
			<TextField 
				prefix={(
					<span className="icon icon-search"></span>
				)}
				placeholder="Search assets" 
				value={searchText} 
				onChange={handleSearchTextChange} />

			<PagedList
				key={`list-${key}`}
				className="asset-selector"
				totalCount={all ? all.length : 0}
				loading={loading}
				pageIndex={pageIndex}
				onChange={setPageIndex}
				onRangeChange={handleRangeChange}>
				
				{renderAssets}
			</PagedList>
		</div>
	);
};

AssetSelector.propTypes = {
	selectedId: PropTypes.string,
	onChange: PropTypes.func.isRequired,

	loadAssets: PropTypes.func.isRequired,
	assets: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	assets: state.assets.assets
});
 
export default connect(mapStateToProps, { loadAssets })(AssetSelector);