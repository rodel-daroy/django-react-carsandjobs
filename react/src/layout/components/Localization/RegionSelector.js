import React from 'react';
import PropTypes from 'prop-types';
import DropdownField from 'components/Forms/DropdownField';
import { getProvinceOptions } from 'components/Forms/ProvinceOptions';
import LanguageSelector from './LanguageSelector';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import './RegionSelector.css';

const RegionSelector = ({ locale: { region, language }, setLocale }) => {
	const handleLanguageChange = language => {
		setLocale({ language });
	};

	const handleRegionChange = region => {
		setLocale({ region });
	};

	return (
		<div className="region-selector">
			<LanguageSelector 
				className="region-selector-lang" 
				value={language} 
				onChange={handleLanguageChange}
				noLabel />

			<DropdownField
				className="region-selector-region"
				size="small"
				noFrame
				searchable={false}
				value={region}
				onChange={handleRegionChange}
				options={getProvinceOptions(language)} />
		</div>
	);
};

RegionSelector.propTypes = {
	locale: PropTypes.object.isRequired,
	setLocale: PropTypes.func.isRequired
};

export default withLocaleRouter(RegionSelector);