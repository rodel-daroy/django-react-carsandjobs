import React, { useCallback, useState } from 'react';
import PagedList from 'components/Layout/PagedList';
import { action } from '@storybook/addon-actions';

const useList = () => {
	const [state, setState] = useState({});

	const handleRangeChange = useCallback(({ startIndex, endIndex }) => {
		action('onRangeChange')({ startIndex, endIndex });

		setState(current => ({
			...current,
			loading: true
		}));

		const timeout = setTimeout(() => {
			let newItems;
			if(!state.items) {
				newItems = new Array(50 + Math.ceil(Math.random() * 100));
				for(let i = 0; i < newItems.length; ++i)
					newItems[i] = null;
			}
			else
				newItems = [...state.items];

			for(let i = Math.min(startIndex, newItems.length - 1); i < Math.min(endIndex + 1, newItems.length); ++i)
				newItems[i] = i;

			setState(current => ({
				...current,
				loading: false,
				items: newItems
			}));
		}, 500);

		return () => clearTimeout(timeout);
	}, [state]);

	return {
		items: state.items,
		loading: state.loading,
		handleRangeChange
	};
};

const PagedListTest = () => {
	const { items, loading, handleRangeChange } = useList();

	const [pageIndex, setPageIndex] = useState(0);

	const renderItems = useCallback(({ startIndex, endIndex }) => {
		action('children')({ startIndex, endIndex });

		return (
			<div>
				{(items || []).slice(startIndex, endIndex + 1).map(i => (
					<div key={i}>{i}</div>
				))}
			</div>
		);
	}, [items]);

	const handlePageChange = pageIndex => {
		action('onChange')(pageIndex);
		setPageIndex(pageIndex);
	};

	return (
		<PagedList
			onChange={handlePageChange}
			pageIndex={pageIndex}
			onRangeChange={handleRangeChange}
			loading={loading}
			totalCount={items ? items.length : 0}>

			{renderItems}
		</PagedList>
	);
};
 
export default PagedListTest;