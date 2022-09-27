import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, propTypes, Field, formValueSelector } from 'redux-form';
import { required } from 'utils/validation';
import { ReduxTextField } from 'components/Forms/TextField';
import { ReduxUploadField } from 'components/Forms/UploadField';
import CommandBar from 'components/Layout/CommandBar';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import { connect } from 'react-redux';
import usePrevious from 'hooks/usePrevious';

const AssetForm = ({ handleSubmit, loading, currentFile, currentName, change }) => {
	const prevFile = usePrevious(currentFile);
	useEffect(() => {
		if(currentFile && !currentName && currentFile !== prevFile)
			change('name', currentFile[0].name);
	}, [currentFile, prevFile, currentName, change]);

	return (
		<form onSubmit={handleSubmit}>
			<Field
				name="file"
				label="Image"
				component={ReduxUploadField}
				accept={['image/jpeg', 'image/png']}
				validate={[required]}
				disabled={loading} />

			<Field
				name="name"
				label="Name"
				component={ReduxTextField}
				validate={[required]}
				disabled={loading} />

			<CommandBar>
				<PrimaryButton type="submit" disabled={loading}>
					Save asset
				</PrimaryButton>
			</CommandBar>
		</form>
	);
};

AssetForm.propTypes = {
	...propTypes,

	loading: PropTypes.bool,

	currentFile: PropTypes.any,
	currentName: PropTypes.string
};

const mapStateToProps = (state, { form }) => {
	const select = formValueSelector(form);

	return {
		currentFile: select(state, 'file'),
		currentName: select(state, 'name')
	};
};
 
export default reduxForm({ form: 'assetForm' })(connect(mapStateToProps)(AssetForm));