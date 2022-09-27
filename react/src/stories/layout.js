/*global module*/
import React from 'react';
import { storiesOf } from '@storybook/react';
import range from 'lodash/range';

import VitalsGroup from 'components/Layout/VitalsGroup';
import AccordionTest from './helpers/AccordionTest';
import PagedListTest from './helpers/PagedListTest';

storiesOf('Layout', module)
	.add('Vitals group', () => (
		<VitalsGroup>
			{range(1, 12).map(i => (
				<VitalsGroup.Vital key={i} caption={`Vital ${i}`}>
					Value {i}
				</VitalsGroup.Vital>
			))}
		</VitalsGroup>
	))
	.add('Accordion', () => (
		<AccordionTest />
	))
	.add('Paged list', () => (
		<PagedListTest />
	));