import React from 'react';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import useAuthTokenRefresh from 'hooks/useAuthTokenRefresh';
import { action } from '@storybook/addon-actions';

const UseAuthTokenRefresh = () => {
	const { refreshToken, isTokenRefreshing } = useAuthTokenRefresh();

	const handleClick = () => {
		refreshToken(action('Token refreshed'));
	};

	return (
		<React.Fragment>
			<PrimaryButton onClick={handleClick} disabled={isTokenRefreshing}>
				Refresh token
			</PrimaryButton>
		</React.Fragment>
	);
};
 
export default UseAuthTokenRefresh;