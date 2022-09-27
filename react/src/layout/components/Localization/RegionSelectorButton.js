import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { showModal } from 'redux/actions/modals';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import { LANGUAGES } from 'config/constants';
import LocalizedNode from 'components/Localization/LocalizedNode';
import RegionSelectorForm from './RegionSelectorForm';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import './RegionSelectorButton.css';

const RegionSelectorButton = ({ locale: { language, region }, setLocale, className, clip, showModal }) => {
	const handleClick = () => {
		const handleSubmit = close => locale => {
			setLocale(locale);
			close();
		};

		showModal({
			title: <LocalizedNode as="h1" names="Common" groupKey="LanguageRegionTitle" />,
			/* eslint-disable react/display-name, react/prop-types */
			content: ({ close }) => (
				<RegionSelectorForm onSubmit={handleSubmit(close)} onCancel={close} />
			),
			/* eslint-enable */
			className: 'region-selector-button'
		});
	};

	const languageName = LANGUAGES.find(l => l[1] === language)[0];

	return (
		<PrimaryLink 
			className={`region-selector-button ${className || ''}`} 
			as="button" 
			type="button" 
			onClick={handleClick} 
			size="small"
			iconClassName="icon icon-angle-right"
			hasIcon
			iconPosition="right"
			clip={clip}>

			<span className="region-selector-button-lang">{languageName}</span>-<span className="region-selector-button-region">{region}</span>
		</PrimaryLink>
	);
};

RegionSelectorButton.propTypes = {
	className: PropTypes.string,
	clip: PropTypes.bool,

	showModal: PropTypes.func.isRequired,
	locale: PropTypes.object.isRequired,
	setLocale: PropTypes.func.isRequired
};
 
export default withLocaleRouter(connect(null, { showModal })(RegionSelectorButton));