/*global module*/
import React from 'react';
import { storiesOf } from '@storybook/react';

import JobCard from 'routes/Jobs/components/JobCard';

storiesOf('Job cards', module)
	.add('card', () => (
		<JobCard 
			job={{
				title: 'Job title 1',
				company: 'Company name', 
				logo: 'http://via.placeholder.com/200x100',
				date: new Date(2018, 4, 25),
				city: 'Toronto',
				province: 'ON'
			}}
			to="/" />
	));