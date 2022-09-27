import React from 'react';
import ErrorBoundary from 'components/Common/ErrorBoundary';

const errorBoundary = WrappedComponent => {
	const WrapperComponent = props => (
		<ErrorBoundary>
			<WrappedComponent {...props} />
		</ErrorBoundary>
	);

	WrapperComponent.displayName = `errorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`;

	return WrapperComponent;
};

export default errorBoundary;