import React from 'react';
import EmptyState from 'components/Layout/EmptyState';
import Localized from 'components/Localization/Localized';
import { parseMarkdown } from 'utils/format';

const NotFoundView = () => (
	<Localized names="Common">
		{({ NotFound }) => (
			<EmptyState>
				<div dangerouslySetInnerHTML={{ __html: parseMarkdown(NotFound) }}>
				</div>
			</EmptyState>
		)}
	</Localized>
);
 
export default NotFoundView;