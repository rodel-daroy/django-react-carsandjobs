import React from 'react';
import PropTypes from 'prop-types';
import { saveSearch } from 'redux/actions/profile';
import { showModal } from 'redux/actions/modals';
import { JobFilter } from 'types/jobs';
import { connect } from 'react-redux';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import SaveSearchForm from './SaveSearchForm';
import LocalizedNode from 'components/Localization/LocalizedNode';
import Localized from 'components/Localization/Localized';

const SaveSearch = ({ saveSearch, filter, showModal, children, saved }) => {
	const doSaveSearch = close => values => {
		saveSearch({
			...values,
			filter
		});

		close();
	};

	const onSave = () => {
		showModal({
			title: <LocalizedNode names={['Common', 'Jobs']} groupKey="SaveSearchLabel" />,
			/* eslint-disable react/display-name, react/prop-types */
			content: ({ close }) => (
				<SaveSearchForm onSubmit={doSaveSearch(close)} onCancel={close} />
			)
			/* eslint-enable */
		});
	};

	if(!saved)
		return children({
			onSave
		});
	else
		return null;
};

SaveSearch.propTypes = {
	filter: JobFilter.isRequired,
	children: PropTypes.func,
	saved: PropTypes.bool,

	saveSearch: PropTypes.func.isRequired,
	showModal: PropTypes.func.isRequired
};

SaveSearch.defaultProps = {
	/* eslint-disable react/display-name, react/prop-types */
	children: ({ onSave }) => (
		<Localized names={['Common', 'Jobs']}>
			{({
				SaveSearchLabel,
				SaveLabel
			}) => (
				<PrimaryLink 
					size="large" 
					as="button" 
					onClick={onSave}
					hasIcon
					iconClassName="icon icon-bookmark">
					
					<span className="hidden-xs hidden-sm">{SaveSearchLabel}</span>
					<span className="hidden-md hidden-lg">{SaveLabel}</span>
				</PrimaryLink>
			)}
		</Localized>
	)
	/* eslint-enable */
};
 
export default connect(null, { saveSearch, showModal })(SaveSearch);