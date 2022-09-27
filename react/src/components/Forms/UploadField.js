import React from 'react';
import Upload from './Upload';
import Field, { AllFieldPropTypes } from './Field';
import { makeReduxField } from './common';
import omit from 'lodash/omit';
import './UploadField.css';

/* eslint-disable no-unused-vars, react/prop-types */
const UploadField = ({ inputComponent, className, accept, multiple, maxSize, minSize, children, ...otherProps }) => {
	const upload = ({ id, type, inputClassName, placeholder, inputComponent, labelId, state, autofilled, helpText, onDrop, onDragStart, ...otherProps }) => (
		/* eslint-enable */
		<Upload 
			{...otherProps}
			
			id={id}
			className={`form-control upload-field-inner ${inputClassName || ''}`}
			accept={accept}
			multiple={multiple}
			maxSize={maxSize}
			minSize={minSize}>

			{children}
		</Upload>
	);

	return (
		<Field {...otherProps} className={`upload-field ${className || ''}`} inputComponent={upload} />
	);
};

UploadField.propTypes = {
	...omit(AllFieldPropTypes, ['inputComponent']),

	// eslint-disable-next-line react/forbid-foreign-prop-types
	...Upload.propTypes
};

UploadField.defaultProps = {
	...Upload.defaultProps
};
 
export default UploadField;

export const ReduxUploadField = makeReduxField(UploadField);