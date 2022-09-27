import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, propTypes } from 'redux-form';
import { ReduxDropdownField } from 'components/Forms/DropdownField';
import Localized from 'components/Localization/Localized';
import { connect } from 'react-redux';
import { lookupOptions, language } from 'redux/selectors';
import { loadLookups } from 'redux/actions/jobs';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import { filterToUrlSearch } from 'routes/Students/components/Programmes/filter';
import { ANY_KEY } from 'routes/Students/components/Programmes/ProgrammeFilterForm';
import { mergeUrlSearch } from 'utils/url';
import LabelAside from 'components/Forms/LabelAside';
import { getProvinceOptions } from 'components/Forms/ProvinceOptions';
import './ProgrammeSearchBox.css';

class ProgrammeSearchBox extends Component {
	constructor(props) {
		super(props);

		props.loadLookups();
	}

	getOptions(lookup, anyLabel) {
		return [
			{
				value: ANY_KEY,
				label: anyLabel
			},

			...lookup
		];
	}

	handleSubmit = values => {
		const { history, location } = this.props;

		history.push({
			pathname: '/students/programs',
			search: mergeUrlSearch(filterToUrlSearch(values), { detail: 1 }),
			state: {
				prev: location
			}
		});
	}

	render() {
		const { departments, handleSubmit, compact, className, language } = this.props;

		return (
			<Localized names={['Common', 'Jobs', 'Students']}>
				{({ DepartmentLabel, ProvinceLabel, OptionalLabel, AnyLabel, SearchLabel, SearchEducationProgrammesTitle }) => {
					const departmentOptions = this.getOptions(departments, AnyLabel);

					return (
						<aside className={`programme-search-box ${compact ? 'compact' : ''} ${className || ''}`}>
							<form className="programme-search-box-form" noValidate onSubmit={handleSubmit(this.handleSubmit)}>
								<div className="programme-search-box-inner">
									<h2>{SearchEducationProgrammesTitle}</h2>

									<div className="programme-search-box-filters">
										<div className="programme-search-box-filter">
											<Field
												name="province"
												label={(
													<div>{ProvinceLabel} <LabelAside>{OptionalLabel}</LabelAside></div>
												)}
												component={ReduxDropdownField}
												options={getProvinceOptions(language)} />
										</div>

										<div className="programme-search-box-filter">
											<Field
												name="department"
												label={DepartmentLabel}
												component={ReduxDropdownField}
												options={departmentOptions}
												searchable={false} />
										</div>
									</div>

									<div className="programme-search-box-button">
										<PrimaryButton type="submit">
											{SearchLabel}
										</PrimaryButton>
									</div>
								</div>
							</form>
						</aside>
					);
				}}
			</Localized>
		);
	}
}

ProgrammeSearchBox.propTypes = {
	...propTypes,

	loading: PropTypes.bool,
	compact: PropTypes.bool,
	className: PropTypes.string,

	loadLookups: PropTypes.func.isRequired,
	departments: PropTypes.array.isRequired,
	history: PropTypes.object.isRequired,
	language: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
	departments: lookupOptions('departments')(state),
	language: language(state)
});
 
export default withLocaleRouter(connect(mapStateToProps, { loadLookups })(reduxForm({
	form: 'programmeSearchBox',
	initialValues: {
		department: ANY_KEY
	}
})(ProgrammeSearchBox)));