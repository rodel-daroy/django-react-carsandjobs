import React from 'react';
import PropTypes from 'prop-types';
import Spinner from 'components/Common/Spinner';
import Localized from 'components/Localization/Localized';
import './EmptyState.css';

const EmptyState = ({ className, children, inline, ...otherProps }) => (
	<Localized names="Common">
		{({ PleaseSelectAnItemLabel }) => {
			if(React.Children.count(children) === 0)
				children = PleaseSelectAnItemLabel;

			return (
				<div {...otherProps} className={`empty-state ${inline ? 'inline' : ''} ${className || ''}`}>
					{children}
				</div>
			);
		}}
	</Localized>
);

EmptyState.propTypes = {
	className: PropTypes.string,
	children: PropTypes.node,
	inline: PropTypes.bool
};

EmptyState.Loading = ({ children, ...otherProps }) => (
	<EmptyState {...otherProps}>
		<div>
			<Spinner />

			{children}
		</div>
	</EmptyState>
);

EmptyState.Loading.propTypes = {
	children: PropTypes.node
};

EmptyState.Loading.displayName = 'EmptyState.Loading';
 
export default EmptyState;