import React from 'react';
import PropTypes from 'prop-types';
import { integer } from 'airbnb-prop-types';
import './Paginator.css';

const Paginator = ({ pageCount, onChange, dark, selectedPage, disabled, numbers, limit }) => {
	if (typeof selectedPage !== 'number') selectedPage = 0;

	let min, max;
	if(limit) {
		min = selectedPage - Math.floor((limit - 1) / 2);
		max = selectedPage + Math.ceil((limit - 1) / 2);

		if(min < 0) {
			min = 0;
			max = Math.min(pageCount - 1, limit - 1);
		}
		else {
			if(max > pageCount - 1) {
				max = pageCount - 1;
				min = Math.max(0, max - limit + 1);
			}
		}
	}
	else {
		min = 0;
		max = pageCount - 1;
	}

	const li = [];
	for (let i = min; i <= max; ++i) {
		let onClick = null;
		if (onChange && selectedPage !== i) onClick = onChange.bind(this, i);

		li.push(
			<li key={i} className={`${selectedPage === i ? 'selected' : ''}`}>
				<button
					type="button"
					className={`btn btn-link page-button ${dark ? 'dark' : 'light'}`}
					onClick={onClick}
					role="radio"
					aria-label={`Page ${i + 1}`}
					aria-checked={selectedPage === i}
					disabled={disabled}
				/>
			</li>
		);
	}

	const handleKeyDown = e => {
		if(!disabled && onChange) {
			switch(e.key) {
				case 'ArrowLeft': {
					if(selectedPage > 0) {
						e.preventDefault();
						onChange(selectedPage - 1);
					}

					break;
				}

				case 'ArrowRight': {
					if(selectedPage < pageCount - 1) {
						e.preventDefault();
						onChange(selectedPage + 1);
					}

					break;
				}

				default:
					break;
			}
		}
	};

	return (
		<div 
			className={`paginator ${dark ? 'dark' : 'light'} ${numbers ? 'numbers' : ''}`} 
			role="radiogroup" 
			onKeyDown={handleKeyDown}>
			
			<ol className="pages" style={{ counterReset: `paginator ${min}` }}>
				{li}
			</ol>
		</div>
	);
};

Paginator.propTypes = {
	pageCount: PropTypes.number,
	selectedPage: PropTypes.number,
	onChange: PropTypes.func,
	dark: PropTypes.bool,
	disabled: PropTypes.bool,
	numbers: PropTypes.bool,
	limit: integer()
};

export default Paginator;
