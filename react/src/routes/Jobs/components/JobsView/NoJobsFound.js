import React from 'react';
import Localized from 'components/Localization/Localized';
import magnifyingGlass from '../img/magnifying-glass.svg';
import './NoJobsFound.css';

const NoJobsFound = () => {
	return (
		<Localized names="Jobs">
			{({ NoJobsFoundLabel }) => (
				<div className="no-jobs-found">
					<img className="no-jobs-found-mag-glass" src={magnifyingGlass} alt="" />

					<p>{NoJobsFoundLabel}</p>
				</div>
			)}
		</Localized>
	);
};
 
export default NoJobsFound;