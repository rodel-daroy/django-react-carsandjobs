import React from 'react';
import PropTypes from 'prop-types';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import { formatDate } from 'utils/format';
import { useSelector } from 'react-redux';
import { language } from 'redux/selectors';
import './Attribution.css';

const Attribution = ({ author, url, date, className }) => {
	const currentLanguage = useSelector(language);

	if(!date)
		return null;
		
	return (
		<div className={`attribution ${className || ''}`}>
			<ul>
				{author && (
					<li className="attribution-author">
						{url && (
							<PrimaryLink 
								className="attribution-author-link" 
								as="a" 
								href={url} 
								target="_blank" 
								rel="noopener noreferrer">
								
								{author}
							</PrimaryLink>
						)}

						{!url && author}
					</li>
				)}

				<li className="attribution-date">
					{formatDate(date, currentLanguage)}
				</li>
			</ul>
		</div>
	);
};

Attribution.propTypes = {
	author: PropTypes.string,
	url: PropTypes.string,
	date: PropTypes.any,
	className: PropTypes.string
};
 
export default Attribution;