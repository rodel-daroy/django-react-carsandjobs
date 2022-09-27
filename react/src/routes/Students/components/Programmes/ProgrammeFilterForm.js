import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, propTypes, getFormValues } from 'redux-form';
import { ReduxDropdownField } from 'components/Forms/DropdownField';
import CommandBar from 'components/Layout/CommandBar';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import { connect } from 'react-redux';
import { loadLookups } from 'redux/actions/jobs';
import { lookupOptions, language } from 'redux/selectors';
import Localized from 'components/Localization/Localized';
import LabelAside from 'components/Forms/LabelAside';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';
import { mediaQuery } from 'utils/style';
import Media from 'react-media';
import { getProvinceOptions } from 'components/Forms/ProvinceOptions';
import './ProgrammeFilterForm.css';

export const ANY_KEY = 'ANY';

class ProgrammeFilterForm extends Component {
	constructor(props) {
		super(props);

		props.loadLookups();
	}

	handleClear = () => this.props.initialize();

	getOptions(lookup, anyLabel) {
		return [
			{
				value: ANY_KEY,
				label: anyLabel
			},

			...lookup
		];
	}

	componentDidUpdate(prevProps) {
		const { handleSubmit } = this.props;

		const currentValues = omit(this.props.currentValues, ['detail']);
		const prevValues = omit(prevProps.currentValues, ['detail']);

		if(!isEqual(currentValues, prevValues) && Object.keys(prevValues).length > 0)
			handleSubmit(this.doSubmit(false))();
	}

	doSubmit = fromButton => values => {
		const { onUpdateFilter } = this.props;

		onUpdateFilter({
			...values,
			detail: fromButton
		});
	}

	render() { 
		const { handleSubmit, loading, departments, language } = this.props;

		if(departments.length > 0)
			return (
				<Localized names={['Common', 'Jobs', 'Students']}>
					{({ AnyLabel, SearchLabel, ClearLabel, DepartmentLabel, OptionalLabel, ProvinceLabel }) => {
						const departmentOptions = this.getOptions(departments, AnyLabel);

						return (
							<form className="programme-filter-form" noValidate onSubmit={handleSubmit(this.doSubmit(true))}>
								<div className="programme-filter-form-body">
									<Field
										name="province"
										label={(
											<div>{ProvinceLabel} <LabelAside>{OptionalLabel}</LabelAside></div>
										)}
										component={ReduxDropdownField}
										options={getProvinceOptions(language)}
										disabled={loading} />

									<Field
										name="department"
										label={DepartmentLabel}
										component={ReduxDropdownField}
										options={departmentOptions}
										disabled={loading}
										searchable={false} />
								</div>

								<Media query={mediaQuery('xs sm')}>
									{mobile => mobile && (
										<div className="programme-filter-form-commands">
											<CommandBar layout="alwaysMobile">
												<PrimaryButton type="submit">
													{SearchLabel}
												</PrimaryButton>

												<PrimaryLink as="button" type="button" hasIcon iconClassName="icon icon-cancel" onClick={this.handleClear}>
													{ClearLabel}
												</PrimaryLink>
											</CommandBar>
										</div>
									)}
								</Media>
							</form>
						);
					}}
				</Localized>
			);
		else
			return null;
	}
}

ProgrammeFilterForm.propTypes = {
	...propTypes,

	loading: PropTypes.bool,
	onUpdateFilter: PropTypes.func.isRequired,

	loadLookups: PropTypes.func.isRequired,
	departments: PropTypes.array.isRequired,
	currentValues: PropTypes.object,
	language: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
	departments: lookupOptions('departments')(state),
	currentValues: getFormValues('programmeFilter')(state),
	language: language(state)
});
 
export default connect(mapStateToProps, { loadLookups })(reduxForm({
	form: 'programmeFilter'
})(ProgrammeFilterForm));