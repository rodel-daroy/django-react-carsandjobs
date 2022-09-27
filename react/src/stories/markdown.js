/*global module*/
import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean } from '@storybook/addon-knobs';

import { parseMarkdown } from 'utils/format';
import MarkdownEditor from 'components/Forms/Markdown/MarkdownEditor';
import MarkdownField from 'components/Forms/Markdown/MarkdownField';
import SimpleMarkdownEditor from 'components/Forms/Markdown/SimpleMarkdownEditor';
import SimpleMarkdownField from 'components/Forms/Markdown/SimpleMarkdownField';
import FieldTest from './helpers/FieldTest';

const MARKDOWN_VALUE = 'The quick *brown fox* jumps over the lazy dog.\n\n\nThe quick brown fox jumps over the lazy dog.\n\n\n* test item 1\n* test item 2';

storiesOf('Markdown', module)
	.add('Line breaks', () => (
		<div dangerouslySetInnerHTML={{ __html: parseMarkdown(MARKDOWN_VALUE) }}></div>
	))
	.add('Editor', () => (
		<FieldTest as={MarkdownEditor} />
	))
	.add('Field', () => (
		<FieldTest as={MarkdownField} label="Label" />
	))
	.add('Simple MDE', () => {
		const disabled = boolean('Disabled', false);
		const readOnly = boolean('Read-only', false);

		return (
			<FieldTest as={SimpleMarkdownEditor} disabled={disabled} readOnly={readOnly} />
		);
	})
	.add('Simple MDE field', () => {
		const disabled = boolean('Disabled', false);
		const readOnly = boolean('Read-only', false);

		return (
			<FieldTest as={SimpleMarkdownField} label="Label" disabled={disabled} readOnly={readOnly} placeholder="Enter text" />
		);
	})
	.add('Simple MDE field with initial value', () => (
		<FieldTest as={SimpleMarkdownEditor} value={MARKDOWN_VALUE} />
	));