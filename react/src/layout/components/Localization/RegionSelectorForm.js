import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Localized from 'components/Localization/Localized';
import DropdownField from 'components/Forms/DropdownField';
import { getProvinceOptions } from 'components/Forms/ProvinceOptions';
import { useSelector } from 'react-redux';
import { region, language } from 'redux/selectors';
import LanguageSelector from './LanguageSelector';
import CommandBar from 'components/Layout/CommandBar';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import './RegionSelectorForm.css';

const RegionSelectorForm = ({ onSubmit, onCancel }) => {
	const originalRegion = useSelector(region);
	const originalLanguage = useSelector(language);

	const [reg, setRegion] = useState(originalRegion);
	const [lang, setLanguage] = useState(originalLanguage);

	const handleRegionChange = region => setRegion(region);

	const handleOkClick = e => {
		e.preventDefault();

		onSubmit({
			language: lang,
			region: reg
		});
	};

	return (
		<Localized names="Common">
			{({ ProvinceLabel, OkLabel, CancelLabel }) => (
				<form className="region-selector-form" onSubmit={handleOkClick}>
					<LanguageSelector 
						className="region-selector-form-language" 
						value={lang} 
						onChange={setLanguage} />

					<DropdownField
						label={ProvinceLabel}
						className="region-selector-form-region"
						size="large"
						searchable={false}
						value={reg}
						onChange={handleRegionChange}
						options={getProvinceOptions(lang)} />

					<CommandBar>
						<PrimaryButton type="submit">
							{OkLabel}
						</PrimaryButton>
						<PrimaryLink as="button" type="button" onClick={onCancel}>
							{CancelLabel}
						</PrimaryLink>
					</CommandBar>
				</form>
			)}
		</Localized>
	);
};

RegionSelectorForm.propTypes = {
	onSubmit: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired
};
 
export default RegionSelectorForm;