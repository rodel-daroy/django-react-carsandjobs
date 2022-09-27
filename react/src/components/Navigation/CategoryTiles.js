import React from 'react';
import PropTypes from 'prop-types';
import { childrenOfType } from 'airbnb-prop-types';
import CategoryTile from './CategoryTile';
import './CategoryTiles.css';

const CategoryTiles = ({ children, caption, size, className }) => (
	<nav className={`category-tiles ${size} ${className || ''}`}>
		<div className="category-tiles-inner">
			{caption && (
				<div className="category-tiles-caption">
					{typeof caption === 'string' && <h2>{caption}</h2>}
					{typeof caption !== 'string' && caption}
				</div>
			)}

			<ul>
				{React.Children.toArray(children).map((child, i) => (
					<li key={i}>
						{React.cloneElement(child, { size })}
					</li>
				))}
			</ul>
		</div>
	</nav>
);

CategoryTiles.propTypes = {
	children: childrenOfType(CategoryTile),
	caption: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
	size: PropTypes.oneOf(['tiny', 'small', 'medium', 'large']).isRequired,
	className: PropTypes.string
};

CategoryTiles.defaultProps = {
	size: 'small'
};

export default CategoryTiles;