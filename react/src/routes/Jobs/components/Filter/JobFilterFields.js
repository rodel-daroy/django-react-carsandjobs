import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { connect } from 'react-redux';
import { loadLookups } from 'redux/actions/jobs';
import { ReduxTextField } from 'components/Forms/TextField';
import { ReduxDropdownField } from 'components/Forms/DropdownField';
import differenceWith from 'lodash/differenceWith';
import { ReduxRadioListField } from 'components/Forms/RadioListField';
import { ReduxLocationField } from 'components/Forms/LocationField';
//import filter from 'lodash/filter';
import castArray from 'lodash/castArray';
import uniq from 'lodash/uniq';
import { JobFilter } from 'types/jobs';
import Localized from 'components/Localization/Localized';
import './JobFilterFields.css';

const MAX_FIELDS = 3;

/* eslint-disable react/display-name, react/prop-types */
const FIELDS = [
	{
		key: 'keywords',
		kind: 'search',
		input: ({ onChange, localized: { KeywordsLabel, KeywordsPlaceholder } }) => (
			<Field
				key="keywords"
				name="keywords"
				component={ReduxTextField}
				label={KeywordsLabel}
				onChange={onChange}
				placeholder={KeywordsPlaceholder} />
		)
	},
	{
		key: 'location',
		kind: 'place',
		input: ({ onChange, localized: { LocationLabel } }) => (
			<Field
				key="location"
				label={LocationLabel}
				name="location"
				component={ReduxLocationField}
				onChange={onChange} />
		),
		select: ({ onChange, localized: { LocationLabel } }) => (
			<Field
				key="location"
				label={LocationLabel}
				name="location"
				component={ReduxLocationField}
				onChange={onChange} />
		)
	},
	{
		key: 'department',
		kind: 'category',
		union: 'department',
		input: ({ departments, onChange, localized: { DepartmentLabel } }) => (
			<Field
				key="department"
				name="department"
				component={ReduxDropdownField}
				label={DepartmentLabel}
				options={departments}
				onChange={onChange} />
		),
		select: ({ departments, onChange, localized: { DepartmentLabel } }) => (
			<Field
				key="department"
				name="department"
				component={ReduxRadioListField}
				options={departments}
				label={DepartmentLabel}
				onChange={onChange} />
		)
	},
	/* eslint-disable no-unused-vars */
	{
		key: 'category',
		kind: 'category',
		union: 'department',
		input: ({ categories, onChange, localized: { CategoryLabel } }) => null /*(
			<Field
				key="category"
				name="category"
				component={ReduxDropdownField}
				label={CategoryLabel}
				options={categories}
				onChange={onChange} />
		)*/,
		select: ({ categories, onChange, localized: { CategoryLabel } }) => null /* (
			<Field
				key="category"
				name="category"
				component={ReduxRadioListField}
				options={categories}
				label={CategoryLabel}
				onChange={onChange} />
		) */
	},
	/* eslint-enable no-unused-vars */
	{
		key: 'positionType',
		kind: 'category',
		input: ({ positionTypes, onChange, localized: { PositionTypeLabel } }) => (
			<Field 
				key="positionType"
				name="positionType"
				component={ReduxDropdownField}
				label={PositionTypeLabel}
				options={positionTypes}
				onChange={onChange} />
		),
		select: ({ positionTypes, onChange, localized: { PositionTypeLabel } }) => (
			<Field
				key="positionType"
				name="positionType"
				component={ReduxRadioListField}
				options={positionTypes}
				label={PositionTypeLabel}
				onChange={onChange} />
		)
	},
	{
		key: 'experience',
		kind: 'experience',
		input: ({ experiences, onChange, localized: { ExperienceLabel } }) => (
			<Field 
				key="experience"
				name="experience"
				component={ReduxDropdownField}
				label={ExperienceLabel}
				options={experiences}
				onChange={onChange} />
		),
		select: ({ experiences, onChange, localized: { ExperienceLabel } }) => (
			<Field
				key="experience"
				name="experience"
				component={ReduxRadioListField}
				options={experiences}
				label={ExperienceLabel}
				onChange={onChange} />
		)
	},
	{
		key: 'education',
		kind: 'experience',
		input: ({ educations, onChange, localized: { EducationLabel } }) => (
			<Field 
				key="education"
				name="education"
				component={ReduxDropdownField}
				label={EducationLabel}
				options={educations}
				onChange={onChange} />
		),
		select: ({ educations, onChange, localized: { EducationLabel } }) => (
			<Field
				key="education"
				name="education"
				component={ReduxRadioListField}
				options={educations}
				label={EducationLabel}
				onChange={onChange} />
		)
	},
	{
		key: 'age',
		kind: 'search',
		input: ({ onChange, localized: { AgeLabel } }) => (
			<Field 
				key="age"
				name="age" 
				component={ReduxTextField} 
				type="number"
				label={AgeLabel}
				onChange={onChange} />
		),
		select: ({ onChange, localized: { PostedDateLabel, WithinLast7DaysLabel, WithinLast30DaysLabel, WithinLast90DaysLabel } }) => (
			<Field
				key="age"
				name="age"
				component={ReduxRadioListField}
				options={[
					{
						label: WithinLast7DaysLabel,
						value: 7
					},
					{
						label: WithinLast30DaysLabel,
						value: 30
					},
					{
						label: WithinLast90DaysLabel,
						value: 90
					}
				]}
				label={PostedDateLabel}
				onChange={onChange} />
		)
	}
];
/* eslint-enable react/display-name, react/prop-types */

class JobFilterFields extends Component {
	constructor(props) {
		super(props);

		this.state = {};

		props.loadLookups();
	}

	static getDerivedStateFromProps(props) {
		const { lookups: { departments, positionTypes, experiences, educations, categories }, jobs, language } = props;

		const mapLookup = (lookup, fieldName) => {
			lookup = lookup || [];

			const options = lookup.map(l => {
				const count = (jobs ? jobs.jobs : [])
					.filter(job => castArray(job[fieldName]).includes(l.id))
					.length;
					
				const countText = (count > 0) ? `${count}+` : '';

				return {
					value: l.id,
					label: (
						<span className="job-filter-field">
							<span className="job-filter-field-count"><span>{countText}</span></span> {l.name[language]}
						</span>
					),
					count
				};
			});

			return options.sort((a, b) => b.count - a.count);
		};

		return {
			departments: mapLookup(departments, 'department'),
			positionTypes: mapLookup(positionTypes, 'positionType'),
			experiences: mapLookup(experiences, 'experience'),
			educations: mapLookup(educations, 'education'),
			categories: mapLookup(categories, 'category')
		};
	}

	getFields() {
		const { fieldType, showAllFields, keys, excludeKeys } = this.props;
		const filter = this.props.filter || {};

		const includeKey = key => (keys == null || keys.includes(key)) && (excludeKeys == null || !excludeKeys.includes(key));

		let fields = FIELDS.filter(f => !!f[fieldType] && includeKey(f.key));

		if(!showAllFields) {
			const filledFields = Object.keys(filter).filter(k => !!filter[k]);

			let availableFields = differenceWith(fields, filledFields, (arrVal, othVal) => arrVal.key === othVal);

			const filledFieldObjs = filledFields.map(key => FIELDS.find(f => f.key === key)).filter(f => !!f);

			availableFields = availableFields.filter(field => !field.union || !filledFieldObjs.map(f => f.union).includes(field.union));

			fields = [];

			let kinds = availableFields.map(f => f.kind);
			for(const kind of uniq(kinds).slice(0, MAX_FIELDS))
				fields.push(availableFields.find(f => f.kind === kind));
		}

		return fields;
	}

	render() {
		const { lookups } = this.props;

		if(Object.keys(lookups).length > 0)
			return (
				<Localized names={['Common', 'Jobs']}>
					{localized => {
						const { fieldType, onChange } = this.props;

						const fields = this.getFields();

						const fieldProps = {
							...this.state,

							onChange,
							localized
						};

						return (
							<React.Fragment>
								{fields.map(field => field[fieldType](fieldProps))}
							</React.Fragment>
						);
					}}
				</Localized>
			);
		else
			return null;
	}
}

export const JobFilterFieldTypes = PropTypes.oneOf(['input', 'select']);

JobFilterFields.propTypes = {
	filter: JobFilter,
	keys: PropTypes.arrayOf(PropTypes.string),
	excludeKeys: PropTypes.arrayOf(PropTypes.string),
	showAllFields: PropTypes.bool,
	fieldType: JobFilterFieldTypes.isRequired,
	onChange: PropTypes.func,

	loadLookups: PropTypes.func,
	lookups: PropTypes.object,
	jobs: PropTypes.object,
	language: PropTypes.string.isRequired
};

JobFilterFields.defaultProps = {
	fieldType: 'input'
};

const mapStateToProps = state => ({
	lookups: state.jobs.lookups,
	jobs: state.jobs.jobs.result,
	language: state.localization.current.language
});

export default connect(mapStateToProps, { loadLookups })(JobFilterFields);