/*global module*/
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import range from 'lodash/range';

import TextField from 'components/Forms/TextField';
import PasswordFieldTest from './helpers/PasswordFieldTest';
import DropdownField from 'components/Forms/DropdownField';
import RadioListField from 'components/Forms/RadioListField';
import LocationField from 'components/Forms/LocationField';
import TextAreaField from 'components/Forms/TextAreaField';
import UploadField from 'components/Forms/UploadField';
import CheckboxField from 'components/Forms/CheckboxField';
import RadioGroupField from 'components/Forms/RadioGroupField';
import DateField from 'components/Forms/DateField';
import FieldTest from './helpers/FieldTest';

import { geocodeLocationPosition } from 'services/here';

storiesOf('Fields/Text', module)
	.add('text field', () => (
		<TextField
			label="Field label" />
	))
	.add('text field disabled', () => (
		<TextField
			label="Field label"
			value="field value"
			disabled />
	))
	.add('prefixed text field', () => (
		<TextField
			label="Field label"
			prefix="$" />
	))
	.add('suffixed text field', () => (
		<TextField
			label="Field label"
			suffix="km" />
	))
	.add('text field error', () => (
		<TextField
			label="Field label"
			suffix="km"
			state="error"
			helpText="Error text" />
	))
	.add('text field warning', () => (
		<TextField
			label="Field label"
			suffix="km"
			state="warning"
			helpText="Warning text" />
	))
	.add('text field horizontal', () => (
		<TextField
			label="Field label"
			suffix="km"
			state="error"
			helpText="Error text"
			orientation="horizontal" />
	));

storiesOf('Fields/Password', module)
	.add('with meter', () => (
		<PasswordFieldTest
			label="Field label" />
	))
	.add('without meter', () => (
		<PasswordFieldTest
			label="Field label"
			hideMeter />
	));

const OPTIONS = range(0, 100).map(i => ({
	label: `Test item ${i} ${String.fromCharCode(i + 65)}`,
	value: i
}));

const loadOptions = async search => {
	search = (search || '').toLowerCase();

	return new Promise(resolve => {
		setTimeout(() => {
			const options = OPTIONS.filter(option => option.label.toLowerCase().indexOf(search) !== -1);

			resolve({ options });
		}, Math.random() * 2000);
	});
};

const loadOption = async value => {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(OPTIONS.find(option => option.value === value));
		}, Math.random() * 1000);
	});
};

storiesOf('Fields/Dropdown', module)
	.add('searchable', () => (
		<FieldTest 
			as={DropdownField}
			label="Field label"
			options={OPTIONS} />
	))
	.add('non-searchable', () => (
		<FieldTest 
			as={DropdownField} 
			label="Field label"
			options={OPTIONS}
			searchable={false} />
	))
	.add('initialized', () => (
		<FieldTest
			as={DropdownField}
			label="Field label"
			options={OPTIONS}
			value={OPTIONS[0].value} />
	))
	.add('async', () => (
		<FieldTest
			as={DropdownField}
			label="Field label"
			options={loadOptions}
			loadOption={loadOption}
			placeholder="Select async" />
	))
	.add('async initialized', () => (
		<FieldTest
			as={DropdownField}
			label="Field label"
			options={loadOptions}
			loadOption={loadOption}
			value={OPTIONS[Math.floor(Math.random() * OPTIONS.length)].value}
			placeholder="Select async" />
	))
	.add('no frame', () => (
		<FieldTest 
			as={DropdownField} 
			options={OPTIONS}
			noFrame />
	))
	.add('small', () => (
		<FieldTest 
			as={DropdownField} 
			label="Field label"
			options={OPTIONS}
			size="small" />
	))
	.add('medium', () => (
		<FieldTest 
			as={DropdownField} 
			label="Field label"
			options={OPTIONS}
			size="medium" />
	))
	.add('horizontal', () => (
		<FieldTest 
			as={DropdownField} 
			label="Field label"
			options={OPTIONS}
			orientation="horizontal" />
	))
	.add('error', () => (
		<FieldTest
			as={DropdownField}
			label="Field label"
			options={OPTIONS}
			state="error"
			helpText="Error text" />
	))
	.add('warning', () => (
		<FieldTest
			as={DropdownField}
			label="Field label"
			options={OPTIONS}
			state="warning"
			helpText="Warning text" />
	))
	.add('disabled', () => (
		<FieldTest
			as={DropdownField}
			label="Field label"
			options={OPTIONS}
			disabled />
	));

storiesOf('Fields/Radio list', module)
	.add('radio list', () => (
		<RadioListField 
			label="Field label"
			options={[
				{
					value: 0,
					label: 'option 1'
				},
				{
					value: 1,
					label: 'option 2'
				},
				{
					value: 2,
					label: 'option 3'
				}
			]}
			visibleOptions={2} />
	))
	.add('radio list with value', () => (
		<RadioListField 
			label="Field label"
			value={2}
			options={[
				{
					value: 0,
					label: 'option 1'
				},
				{
					value: 1,
					label: 'option 2'
				},
				{
					value: 2,
					label: 'option 3'
				}
			]}
			visibleOptions={2} />
	));

storiesOf('Fields/Location', module)
	.add('location', () => (
		<FieldTest
			as={LocationField}
			label="Field label"
			onChange={value => {
				geocodeLocationPosition(value || {})
					.then(location => action('position')(location));
			}} />
	))
	.add('existing location', () => (
		<FieldTest
			as={LocationField}
			label="Field label"
			value={{ city: 'Brampton', province: 'ON' }}
			onChange={value => {
				geocodeLocationPosition(value || {})
					.then(location => action('position')(location));
			}} />
	));

storiesOf('Fields/Text area', module)
	.add('text area', () => (
		<TextAreaField
			label="Field label" />
	))
	.add('text area with value', () => (
		<TextAreaField
			label="Field label"
			value="Lorem ipsum" />
	));

storiesOf('Fields/Upload', module)
	.add('upload', () => (
		<UploadField
			label="Field label"
			onChange={action('onChange')} />
	))
	.add('upload PDF', () => (
		<UploadField
			label="Field label"
			accept="application/pdf"
			maxSize={2097152}
			onChange={action('onChange')} />
	));

storiesOf('Fields/Checkbox', module)
	.add('checkbox', () => (
		<CheckboxField
			label="Field label"
			onChange={action('onChange')} />
	));

storiesOf('Fields/RadioGroupField', module)
	.add('radio group', () => (
		<RadioGroupField
			label="Field label"
			value={2}
			options={[
				{
					value: 0,
					label: 'option 1'
				},
				{
					value: 1,
					label: 'option 2'
				},
				{
					value: 2,
					label: 'option 3'
				}
			]}
			onChange={action('onChange')} />
	));

storiesOf('Fields/Date', module)
	.add('date', () => (
		<DateField
			label="Field label"
			value={new Date(2018, 11, 28)} />
	));