import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, propTypes } from 'redux-form';
import { ReduxTextField } from 'components/Forms/TextField';
import { ReduxTextAreaField } from 'components/Forms/TextAreaField';
import { required } from 'utils/validation';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import CommandBar from 'components/Layout/CommandBar';
import { ReduxCheckboxField } from 'components/Forms/CheckboxField';
import LoadingOverlay from 'components/Common/LoadingOverlay';
import LocaleLink from 'components/Localization/LocaleLink';
import Localized from 'components/Localization/Localized';
import './CoverLetterForm.css';

const CoverLetterForm = ({ className, handleSubmit, loading }) => (
	<Localized names="Common">
		{({ NameLabel, DescriptionLabel, TextLabel, ActiveLabel, SaveLabel, GoBackLabel }) => (
			<form className={`cover-letter-form ${className || ''}`} onSubmit={handleSubmit}>
				<Field
					label={NameLabel}
					name="name"
					component={ReduxTextField}
					validate={[required]}
					disabled={loading} />

				<Field
					label={DescriptionLabel}
					name="description"
					component={ReduxTextField}
					disabled={loading} />

				<Field
					label={TextLabel}
					name="text"
					component={ReduxTextAreaField}
					validate={[required]}
					disabled={loading} />

				<Field
					label={ActiveLabel}
					name="active"
					component={ReduxCheckboxField}
					disabled={loading} />

				<div className="cover-letter-form-commands-outer">
					<CommandBar className="cover-letter-form-commands" layout="auto">
						<PrimaryLink as={LocaleLink} to="/profile/cover-letters" iconClassName="icon icon-angle-left" hasIcon disabled={loading}>
							{GoBackLabel}
						</PrimaryLink>

						<PrimaryButton type="submit" disabled={loading}>
							{SaveLabel}
						</PrimaryButton>
					</CommandBar>
				</div>

				{loading && <LoadingOverlay />}
			</form>
		)}
	</Localized>
);

CoverLetterForm.propTypes = {
	...propTypes,

	className: PropTypes.string,
	loading: PropTypes.bool
};
 
export default reduxForm({
	form: 'coverLetter'
})(CoverLetterForm);