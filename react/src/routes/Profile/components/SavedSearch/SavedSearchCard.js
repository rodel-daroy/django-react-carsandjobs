import React from 'react';
import PropTypes from 'prop-types';
import { SavedSearch } from 'types/profile';
import { humanizePastDate } from 'utils/format';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import Card from 'components/Layout/Card';
import Localized from 'components/Localization/Localized';
import { language } from 'redux/selectors';
import { useSelector } from 'react-redux';
import './SavedSearchCard.css';

const SavedSearchCard = ({ search, onDelete, ...otherProps }) => {
	const currentLanguage = useSelector(language);

	return (
		<Localized names="Common">
			{({ CreatedLabel }) => (
				<Card
					{...otherProps}

					className="search-card"
					active
					age={`${CreatedLabel} ${humanizePastDate(search.createdDate, currentLanguage)}`}
					image={<span className="icon icon-search"></span>}
					rightActions={(
						<PrimaryLink as="button" className="search-card-delete" type="button" onClick={() => onDelete(search)}>
							<span className="icon icon-delete"></span>
						</PrimaryLink>
					)}>

					<Card.Name>{search.name}</Card.Name>
				</Card>
			)}
		</Localized>
	);
};

SavedSearchCard.propTypes = {
	search: SavedSearch.isRequired,
	onDelete: PropTypes.func
};

export default SavedSearchCard;