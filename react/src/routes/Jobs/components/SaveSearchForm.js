import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, propTypes } from 'redux-form';
import { ReduxTextField } from 'components/Forms/TextField';
import { required } from 'utils/validation';
import CommandBar from 'components/Layout/CommandBar';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import Localized from 'components/Localization/Localized';

const SaveSearchForm = ({ handleSubmit, onCancel }) => (
	<Localized names={['Common', 'Jobs']}>
		{({ NameLabel, CancelLabel, SaveLabel }) => (
			<form className="save-search-form" noValidate onSubmit={handleSubmit}>
				<Field
					name="name"
					label={NameLabel}
					component={ReduxTextField}
					validate={[required]} />

				<CommandBar>
					<PrimaryLink as="button" type="button" onClick={onCancel} iconClassName="icon icon-cancel" hasIcon>
						{CancelLabel}
					</PrimaryLink>
					<PrimaryButton type="submit">
						{SaveLabel}
					</PrimaryButton>
				</CommandBar>
			</form>
		)}
	</Localized>
);

SaveSearchForm.propTypes = {
	...propTypes,

	onCancel: PropTypes.func.isRequired
};
 
export default reduxForm({
	form: 'saveSearch'
})(SaveSearchForm);