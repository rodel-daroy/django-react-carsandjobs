import React from 'react';
import ProfileRegisterView from './components/ProfileRegisterView';
import WithLocalization from 'components/Localization/WithLocalization';
import errorBoundary from 'components/Decorators/errorBoundary';

const Register = () => (
	<WithLocalization names="Profile">
		{() => (
			<ProfileRegisterView />
		)}
	</WithLocalization>
);

export default errorBoundary(Register);