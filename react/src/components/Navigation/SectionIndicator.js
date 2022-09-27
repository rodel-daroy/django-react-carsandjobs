import React from 'react';
import PropTypes from 'prop-types';
import { integer } from 'airbnb-prop-types';
import './SectionIndicator.css';

const SectionIndicator = ({ sections, index, className, onChange }) => (
	<nav className={`section-indicator ${sections.length > 4 ? 'small-gaps' : ''} ${className || ''}`}>
		{sections.length > 0 &&
			<ul>
				{sections.map((section, i) => {
					const active = index === i;
					
					return (
						<li 
							key={i} 
							className={`${active ? 'active' : ''} ${section.complete ? 'complete' : ''} ${section.disabled ? 'disabled' : ''}`}>

							<button 
								className="section-indicator-button" 
								type="button" 
								onClick={() => onChange(i)}
								disabled={section.disabled}>
								
								<div className="section-indicator-circle">
									{section.complete ? <span className="icon icon-check"></span> : <span>{`0${i + 1}`}</span>}
								</div>
								<div className="section-indicator-name">
									{section.name}
								</div>
							</button>
						</li>
					);
				})}
			</ul>}
	</nav>
);

SectionIndicator.propTypes = {
	sections: PropTypes.arrayOf(PropTypes.shape({
		name: PropTypes.node,
		complete: PropTypes.bool,
		disabled: PropTypes.bool
	})).isRequired,
	index: integer(),
	className: PropTypes.string,
	onChange: PropTypes.func.isRequired
};

SectionIndicator.defaultProps = {
	index: 0
};

export default SectionIndicator;
