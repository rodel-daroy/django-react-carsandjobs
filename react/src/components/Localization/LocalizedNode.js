import React from 'react';
import PropTypes from 'prop-types';
import Localized from './Localized';
import { parseMarkdown } from 'utils/format';
import { LocalizationNames } from './types';

const LocalizedNode = ({ as: Component, names, groupKey, markdown, ...otherProps }) => (
	<Localized names={names}>
		{({ [groupKey]: content }) => {
			if(markdown) {
				const markdownContent = parseMarkdown(content);

				return (
					<Component 
						{...otherProps} 
						dangerouslySetInnerHTML={{ __html: markdownContent }} />
				);
			}
			else
				return (
					<Component {...otherProps}>
						{content}
					</Component>
				);
		}}
	</Localized>
);

LocalizedNode.propTypes = {
	as: PropTypes.any,
	names: LocalizationNames.isRequired,
	groupKey: PropTypes.string.isRequired,
	markdown: PropTypes.bool
};

LocalizedNode.defaultProps = {
	as: 'span'
};
 
export default LocalizedNode;