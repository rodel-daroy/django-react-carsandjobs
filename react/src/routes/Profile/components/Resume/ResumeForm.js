import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, propTypes } from 'redux-form';
import { ReduxTextField } from 'components/Forms/TextField';
import { ReduxTextAreaField } from 'components/Forms/TextAreaField';
import { required, requiredUpload, uploadSize } from 'utils/validation';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import CommandBar from 'components/Layout/CommandBar';
import { ReduxCheckboxField } from 'components/Forms/CheckboxField';
import LoadingOverlay from 'components/Common/LoadingOverlay';
import { ReduxUploadField } from 'components/Forms/UploadField';
import LocaleLink from 'components/Localization/LocaleLink';
import Localized from 'components/Localization/Localized';
import { parseMarkdown } from 'utils/format';
import './ResumeForm.css';

const MAX_RESUME_SIZE = 1024 * 1024 * 5;

const validatePdf = [requiredUpload(), uploadSize(MAX_RESUME_SIZE)];
const validateExistingPdf = [uploadSize(MAX_RESUME_SIZE)];

const ResumeForm = ({ className, handleSubmit, loading, fileUrl, processing }) => (
	<Localized names={['Common', 'Profile']}>
		{({ 
			NameLabel, 
			DescriptionLabel, 
			PDFLabel, 
			SearchableTextLabel, 
			ProcessingPDFLabel, 
			ActiveLabel, 
			SearchableLabel,
			GoBackLabel,
			SaveLabel,
			PDFExtractionMessage
		}) => (
			<form className={`resume-form ${className || ''}`} onSubmit={handleSubmit}>
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
					name="file"
					label={PDFLabel}
					component={ReduxUploadField}
					accept="application/pdf"
					validate={fileUrl ? validateExistingPdf : validatePdf}
					disabled={loading}
					url={fileUrl} />

				<div dangerouslySetInnerHTML={{ __html: parseMarkdown(PDFExtractionMessage) }}></div>

				<div className="resume-form-text">
					<Field
						className="resume-form-text-field"
						label={SearchableTextLabel}
						name="text"
						component={ReduxTextAreaField}
						disabled={loading}
						readOnly />
					
					{processing && (
						<LoadingOverlay>
							{ProcessingPDFLabel}
						</LoadingOverlay>
					)}
				</div>

				<Field
					label={ActiveLabel}
					name="active"
					component={ReduxCheckboxField}
					disabled={loading} />

				<Field
					label={SearchableLabel}
					name="searchable"
					component={ReduxCheckboxField}
					disabled={loading} />

				<div className="resume-form-commands-outer">
					<CommandBar className="resume-form-commands" layout="auto">
						<PrimaryLink as={LocaleLink} to="/profile/resumes" iconClassName="icon icon-angle-left" hasIcon disabled={loading}>
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

ResumeForm.propTypes = {
	...propTypes,

	className: PropTypes.string,
	loading: PropTypes.bool,
	processing: PropTypes.bool
};
 
export default reduxForm({
	form: 'resume',
	enableReinitialize: true
})(ResumeForm);