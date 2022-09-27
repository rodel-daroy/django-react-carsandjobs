import React, { useEffect, useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadCategories } from 'redux/actions/tiles';
import DropdownField from 'components/Forms/DropdownField';
import orderBy from 'lodash/orderBy';
import { LANGUAGES } from 'config/constants';
import { language } from 'redux/selectors';
import usePrevious from 'hooks/usePrevious';
import './TileCategoryDropdown.css';

const TileCategoryDropdown = ({ 
	loadCategories, 
	categories, 
	value, 
	onChange, 
	language: initialLanguage, 
	defaultLanguage,
	onChangeLanguage,
	hideLanguage
}) => {
	const [language, setLanguage] = useState(initialLanguage || defaultLanguage);

	useEffect(() => {
		loadCategories();
	}, [loadCategories]);

	const handleChangeLanguage = useCallback(language => {
		setLanguage(language);

		if(onChangeLanguage)
			onChangeLanguage(language);
	}, [onChangeLanguage]);

	const sortedCategories = useMemo(() => {
		if(categories) {
			const categoriesForLanguage = categories.filter(cat => cat.language === language);

			return orderBy(categoriesForLanguage, ['categoryName', cat => cat.province || 0]);
		}

		return null;
	}, [categories, language]);

	const categoryOptions = useMemo(() => {
		return (sortedCategories || []).map(cat => ({
			value: cat.slug,
			label: (
				<span className="tile-category-dropdown-option">
					{cat.categoryName} <span className="tile-category-dropdown-option-province">{cat.province || 'Default'}</span>
				</span>
			)
		}));
	}, [sortedCategories]);

	const prevSortedCategories = usePrevious(sortedCategories);
	useEffect(() => {
		if(sortedCategories && sortedCategories !== prevSortedCategories) {
			if(sortedCategories.length > 0 && !value)
				onChange(sortedCategories[0].slug);
			else {
				if(value && !sortedCategories.find(cat => cat.slug === value))
					onChange(null);
			}
		}
	}, [sortedCategories, prevSortedCategories, onChange, value]);

	const prevLanguage = usePrevious(language);
	useEffect(() => {
		if(language !== prevLanguage) {
			if(value && sortedCategories) {
				if(!sortedCategories.find(cat => cat.slug === value)) {
					const original = (categories || []).find(cat => cat.slug === value);

					if(original) {
						let newCategory = sortedCategories.find(cat => cat.categoryName === original.categoryName && cat.province === original.province);
						if(!newCategory)
							newCategory = sortedCategories.find(cat => cat.categoryName === original.categoryName && !cat.province);

						if(newCategory)
							onChange(newCategory.slug);
					}
				}
			}
		}
	}, [language, prevLanguage, categories, onChange, value, sortedCategories]);
	
	return (
		<div className="tile-category-dropdown">
			<DropdownField
				label="Category"
				options={categoryOptions}
				value={value}
				searchable={false}
				onChange={onChange} />

			{!hideLanguage && (
				<DropdownField
					label="Language"
					options={LANGUAGES.map(lang => ({
						label: lang[0],
						value: lang[1]
					}))}
					value={language}
					searchable={false}
					onChange={handleChangeLanguage} />
			)}
		</div>
	);
};

TileCategoryDropdown.propTypes = {
	value: PropTypes.any,
	onChange: PropTypes.func.isRequired,
	language: PropTypes.string,
	onChangeLanguage: PropTypes.func,
	hideLanguage: PropTypes.bool,

	loadCategories: PropTypes.func.isRequired,
	categories: PropTypes.any,
	defaultLanguage: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
	categories: state.tiles.categories.result,
	defaultLanguage: language(state)
});
 
export default connect(mapStateToProps, { loadCategories })(TileCategoryDropdown);