import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, propTypes, registerField, formValueSelector } from 'redux-form';
import { ReduxTextField } from 'components/Forms/TextField';
import { required } from 'utils/validation';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import { ReduxRadioGroupField } from 'components/Forms/RadioGroupField';
import { DEFAULT_BUTTON_TEXT } from 'config/constants';
import LoadingOverlay from 'components/Common/LoadingOverlay';
import CommandBar from 'components/Layout/CommandBar';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import SelectAssetModal from '../Assets/SelectAssetModal';
import { default as CNJField } from 'components/Forms/Field';
import { connect } from 'react-redux';
import AssetPreview from '../Assets/AssetPreview';
import { ReduxArticleField } from './ArticleField';
import './TileForm.css';

const TileForm = ({ 
	handleSubmit, 
	loading, 
	onCancel, 
	registerField, 
	form, 
	change, 
	asset,
	article,
	tileCtaLink
}) => {
	const [selectAssetOpen, setSelectAssetOpen] = useState(false);

	useEffect(() => {
		registerField(form, 'tileAsset', 'Field');
	}, [form, registerField]);

	useEffect(() => {
		if(article)
			change('tileCtaLink', `/content/${article}`);
	}, [article, change]);

	const sizes = [1, 2].map(size => ({
		label: size,
		value: size
	}));

	const handleAsset = asset => {
		setSelectAssetOpen(false);
		change('tileAsset', asset);
	};

	const handleAssetClick = () => setSelectAssetOpen(true);

	return (
		<form className="tile-form" onSubmit={handleSubmit}>
			<Field
				name="tileHeadline"
				label="Heading"
				component={ReduxTextField}
				validate={[required]}
				disabled={loading} />
			<Field
				name="tileSubheading"
				label="Subheading"
				component={ReduxTextField} 
				disabled={loading} />

			<CNJField
				label="Asset"
				inputComponent={() => (
					<div role="button" onClick={handleAssetClick}>
						{asset && (
							<div className="tile-form-asset-preview">
								<AssetPreview asset={asset} />
							</div>
						)}
						
						<PrimaryButton 
							as="button" 
							type="button" 
							size="small">

							Select asset...
						</PrimaryButton>
					</div>
				)} />

			<Field
				name="tileCtaText"
				label="CTA"
				component={ReduxTextField}
				placeholder={DEFAULT_BUTTON_TEXT}
				disabled={loading} />

			<Field
				name="article"
				label="Link"
				component={ReduxArticleField}
				placeholder="Select article"
				disabled={loading}
				last />

			<Field
				name="tileCtaLink"
				component={ReduxTextField}
				suffix={(
					<PrimaryLink 
						href={tileCtaLink}
						target="_blank"
						hasIcon 
						iconClassName="icon icon-link"
						disabled={!tileCtaLink} />
				)}
				validate={[required]}
				disabled={loading} />

			<Field
				name="columns"
				label="Preferred size"
				component={ReduxRadioGroupField}
				options={sizes}
				validate={[required]}
				disabled={loading} />

			<CommandBar>
				<PrimaryButton type="submit" disabled={loading}>
					Save tile
				</PrimaryButton>

				{onCancel && (
					<PrimaryLink 
						as="button" 
						type="button" 
						hasIcon 
						iconClassName="icon icon-cancel" 
						onClick={onCancel}
						disabled={loading}>

						Cancel
					</PrimaryLink>
				)}
			</CommandBar>

			{loading && <LoadingOverlay />}

			<SelectAssetModal 
				isOpen={selectAssetOpen} 
				onClose={() => setSelectAssetOpen(false)}
				onSubmit={handleAsset} />
		</form>
	);
};

TileForm.propTypes = {
	...propTypes,
	registerField: PropTypes.func.isRequired,
	asset: PropTypes.object,
	article: PropTypes.any,
	tileCtaLink: PropTypes.string,

	loading: PropTypes.bool,
	onCancel: PropTypes.func
};

const mapStateToProps = (state, { form }) => {
	const formValue = formValueSelector(form);

	return {
		asset: formValue(state, 'tileAsset'),
		article: formValue(state, 'article'),
		tileCtaLink: formValue(state, 'tileCtaLink')
	};
};
 
export default reduxForm({
	form: 'tileForm'
})(connect(mapStateToProps, { registerField })(TileForm));