import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, propTypes, Field } from 'redux-form';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import { ReduxTextField } from 'components/Forms/TextField';
import { ReduxLocationField } from 'components/Forms/LocationField';
import Localized from 'components/Localization/Localized';
import './SearchForm.css';

const SearchForm = ({ handleSubmit, orientation }) => (
	<Localized names="Common">
		{({ WhatLabel, WhereLabel, SearchLabel, WhatPlaceholder, WherePlaceholder }) => (
			<form className={`search-form ${orientation}`} onSubmit={handleSubmit}>
				<div className="search-form-filter">
					<Field
						label={WhatLabel}
						name="keywords"
						component={ReduxTextField}
						orientation={orientation}
						placeholder={WhatPlaceholder} />
				</div>

				<div className="search-form-filter">
					<Field
						label={WhereLabel}
						name="location"
						component={ReduxLocationField}
						orientation={orientation}
						placeholder={WherePlaceholder} />
				</div>

				<div className="search-form-button">
					<PrimaryButton type="submit" className="search-form-button-inner">
						{orientation === 'horizontal' && (
							<React.Fragment>
								<span className="hidden-xs hidden-sm hidden-md">{SearchLabel}</span>
								<span className="hidden-lg icon icon-search"></span>
							</React.Fragment>
						)}
						{orientation === 'vertical' && SearchLabel}
					</PrimaryButton>
				</div>
			</form>
		)}
	</Localized>
);

SearchForm.propTypes = {
	...propTypes,

	orientation: PropTypes.oneOf(['horizontal', 'vertical'])
};

SearchForm.defaultProps = {
	orientation: 'vertical'
};

export default reduxForm()(SearchForm);