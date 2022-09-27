import React from 'react';
import PropTypes from 'prop-types';
import { CoverLetter } from 'types/profile';
import { humanizePastDate } from 'utils/format';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import CheckboxField from 'components/Forms/CheckboxField';
import Card from 'components/Layout/Card';
import Localized from 'components/Localization/Localized';
import reloadOnRegionChange from 'components/Decorators/reloadOnRegionChange';
import { language } from 'redux/selectors';
import { useSelector } from 'react-redux';
import './CoverLetterCard.css';

const CoverLetterCard = ({ coverLetter, onDelete, onSetActive, ...otherProps }) => {
	const currentLanguage = useSelector(language);

	return (
		<Localized names="Common">
			{({ ModifiedLabel, ActiveLabel, InactiveLabel }) => (
				<Card
					{...otherProps}

					className="cover-letter-card"
					active={coverLetter.active}
					image={<span className="icon icon-doc-text-inv"></span>}
					age={`${ModifiedLabel} ${humanizePastDate(coverLetter.modifiedDate, currentLanguage)}`}
					status={(
						<React.Fragment>
							{coverLetter.active && (
								<React.Fragment>
									<span className="icon icon-check"></span> {ActiveLabel}
								</React.Fragment>
							)}

							{!coverLetter.active && InactiveLabel}
						</React.Fragment>
					)}
					leftActions={(
						<div className="cover-letter-card-check">
							<CheckboxField offState checked={coverLetter.active} onChange={() => onSetActive(coverLetter, !coverLetter.active)} />
						</div>
					)}
					rightActions={(
						<PrimaryLink as="button" className="cover-letter-card-delete" type="button" onClick={() => onDelete(coverLetter)}>
							<span className="icon icon-delete"></span>
						</PrimaryLink>)}>

					<Card.Name>{coverLetter.name}</Card.Name>
					<Card.Description>{coverLetter.description}</Card.Description>
				</Card>
			)}
		</Localized>
	);
};

CoverLetterCard.propTypes = {
	coverLetter: CoverLetter.isRequired,
	onDelete: PropTypes.func,
	onSetActive: PropTypes.func
};

export default reloadOnRegionChange(CoverLetterCard);