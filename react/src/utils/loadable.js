import React from 'react';
import Loadable from 'react-loadable';
import EmptyState from 'components/Layout/EmptyState';
import ErrorBoundary from 'components/Common/ErrorBoundary';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import Localized from 'components/Localization/Localized';
import { parseMarkdown } from 'utils/format';

export const makeLoadable = loader => {
	const LoadableComponent = Loadable({
		loader,
		/* eslint-disable-next-line react/display-name, react/prop-types */
		loading: ({ error, pastDelay }) => {
			if(error)
				return (
					<Localized names="Common">
						{({ 
							ReloadPageMessage = 'Please reload the page to get the latest version of Cars and Jobs.',
							ReloadLabel = 'Reload'
						}) => (
							<EmptyState>
								<div>
									<div dangerouslySetInnerHTML={{ __html: parseMarkdown(ReloadPageMessage) }}>
									</div>

									<PrimaryButton as="button" type="button" onClick={() => window.location.reload(true)}>
										{ReloadLabel}
									</PrimaryButton>
								</div>
							</EmptyState>
						)}
					</Localized>
				);

			if(pastDelay)
				return <EmptyState.Loading />;
	
			return null;
		}
		/* eslint-enable */
	});

	const LoadableWrapper = props => (
		<ErrorBoundary>
			<LoadableComponent {...props} />
		</ErrorBoundary>
	);

	return LoadableWrapper;
};