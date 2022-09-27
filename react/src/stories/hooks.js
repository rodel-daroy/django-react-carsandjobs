/*global module*/
import React from 'react';
import { storiesOf } from '@storybook/react';
import UseAuthTokenRefreshTest from './helpers/UseAuthTokenRefreshTest';

storiesOf('Hooks/useAuthTokenRefresh', module)
	.add('refresh', () => {
		return (
			<UseAuthTokenRefreshTest />
		);
	});