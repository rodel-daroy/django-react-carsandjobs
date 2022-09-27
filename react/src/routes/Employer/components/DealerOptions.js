import React from 'react';
import './DealerOptions.css';

export const getDealerOptions = dealers => dealers.map(dealer => {
	return {
		label: (
			<span className={`dealer-option ${dealer.isDealerGroup ? 'dealer-group' : ''}`}>{dealer.name}</span>
		),
		value: dealer.id,
		name: dealer.name
	};
});