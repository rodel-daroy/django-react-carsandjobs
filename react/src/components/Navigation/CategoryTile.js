import React from 'react';
import PropTypes from 'prop-types';
import LocaleLink from 'components/Localization/LocaleLink';
import './CategoryTile.css';

const CategoryTile = ({ onClick, image, caption, to, size }) => {
	let Component = to ? LocaleLink : 'button';

	return (
		<Component type={Component === 'button' ? 'button' : null} className="category-tile" to={to} onClick={onClick} aria-label={caption}>
			<div className={`category-tile-inner ${size}`}>
				<div className="category-tile-image" style={{ backgroundImage: `url(${image})` }}></div>

				<div className="category-tile-caption">
					<span className="category-tile-text">{caption}</span>
					<span className="icon icon-angle-right"></span>
				</div>
			</div>
		</Component>
	);
};

CategoryTile.propTypes = {
	image: PropTypes.string,
	caption: PropTypes.node,
	onClick: PropTypes.func,
	to: PropTypes.any,
	size: PropTypes.string
};

CategoryTile.defaultProps = {
	image: 'https://picsum.photos/960/350?random=1'
};

export default CategoryTile;