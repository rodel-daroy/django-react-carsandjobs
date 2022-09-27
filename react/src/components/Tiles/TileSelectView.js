import React from 'react';
import PropTypes from 'prop-types';
import { childrenOfType } from 'airbnb-prop-types';
import TileSlot from './TileSlot';
import TileView from './TileView';
import TileSelectOverlay from './TileSelectOverlay';

const TileSelectView = ({ index, onChange, children }) => {
	const handleClick = index => () => {
		if(onChange)
			onChange(index);
	};

	return (
		<section className="tile-select-view">
			<TileView>
				{React.Children.toArray(children).map((slot, i) => React.cloneElement(slot, {}, (
					<TileSelectOverlay key={i} selected={i === index} onClick={handleClick(i)}>
						{slot.props.children}
					</TileSelectOverlay>
				)))}
			</TileView>
		</section>
	);
};

TileSelectView.propTypes = {
	index: PropTypes.number,
	onChange: PropTypes.func,
	children: childrenOfType(TileSlot)
};
 
export default TileSelectView;