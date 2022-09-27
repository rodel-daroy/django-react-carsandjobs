import React from 'react';
import PropTypes from 'prop-types';
import Localized from 'components/Localization/Localized';
import { LANGUAGES } from 'config/constants';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import './LanguageSelector.css';

const LanguageSelector = ({ value, onChange, noLabel, className }) => {
	const renderLanguage = (lang, i) => {
		if(lang[1] === value) {
			return (
				<span key={i} className="language-selector-option current">{lang[1]}</span>
			);
		}
		else {
			return (
				<PrimaryLink 
					key={i} 
					as="button"
					className="language-selector-option"
					type="button" 
					onClick={() => onChange(lang[1])}>

					{lang[1]}
				</PrimaryLink>
			);
		}
	};

	return (
		<Localized names="Common">
			{({ LanguageLabel }) => (
				<div className={`language-selector ${className || ''}`}>
					{!noLabel && (
						<label>{LanguageLabel}</label>
					)}
					{LANGUAGES.map(renderLanguage)}
				</div>
			)}
		</Localized>
	);
};

LanguageSelector.propTypes = {
	noLabel: PropTypes.bool,
	value: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	className: PropTypes.string
};
 
export default LanguageSelector;