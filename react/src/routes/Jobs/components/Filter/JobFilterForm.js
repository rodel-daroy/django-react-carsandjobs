import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, propTypes } from 'redux-form';
import CommandBar from 'components/Layout/CommandBar';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import Localized from 'components/Localization/Localized';
import './JobFilterForm.css';

const JobFilterForm = ({ handleSubmit, initialize, hideSubmit, className, children }) => {
	const handleClear = () => initialize({});

	return (
		<Localized names={['Common', 'Jobs']}>
			{({ ApplyLabel, ClearLabel }) => (
				<form className={`job-filter-form ${className || ''}`} onSubmit={handleSubmit}>
					<div className="job-filter-form-fields">
						{children}
					</div>

					{!hideSubmit && (
						<CommandBar layout="auto">
							<PrimaryButton type="submit">
								{ApplyLabel}
							</PrimaryButton>

							<PrimaryLink as="button" type="button" hasIcon iconClassName="icon icon-cancel" onClick={handleClear}>
								{ClearLabel}
							</PrimaryLink>
						</CommandBar>
					)}
				</form>
			)}
		</Localized>
	);
};

JobFilterForm.propTypes = {
	...propTypes,

	hideSubmit: PropTypes.bool,
	className: PropTypes.string,
	children: PropTypes.node
};

export default reduxForm()(JobFilterForm);