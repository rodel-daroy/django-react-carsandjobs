import React from 'react';
import { PROVINCES } from 'config/constants';
import orderBy from 'lodash/orderBy';
import './ProvinceOptions.css';

export const getProvinceOptions = (language = 'en', useNameForValue = false) => orderBy(PROVINCES, p => p[0][language]).map(p => ({
	label: (
		<span className="province-option">
			{p[0][language]} <span className="province-option-postal-code">{p[1]}</span>
		</span>
	),
	value: useNameForValue ? p[0][language] : p[1]
}));