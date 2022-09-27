import React from 'react';
import PropTypes from 'prop-types';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import { NavLink } from 'react-router-dom';
import omit from 'lodash/omit';
import './Breadcrumbs.css';

const Breadcrumbs = ({ children, className, showHome }) => (
	<nav className={`breadcrumbs ${className || ''}`} aria-label="Breadcrumb">
		<ol>
			{showHome && (
				<li className="home-crumb">
					<NavLink className="crumb" to="/" aria-label="Home">
						<span className="icon icon-home" />
					</NavLink>
				</li>
			)}

			{children}
		</ol>
	</nav>
);

Breadcrumbs.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	showHome: PropTypes.bool
};

Breadcrumbs.defaultProps = {
	showHome: true
};

Breadcrumbs.Crumb = ({ name, className, as: Component, children, ...otherProps }) => (
	<li>
		<Component {...otherProps} className={`crumb ${className || ''}`}>
			{name}
			{children}
		</Component>
	</li>
);

Breadcrumbs.Crumb.propTypes = {
	name: PropTypes.string,
	className: PropTypes.string,
	as: PropTypes.any.isRequired,
	children: PropTypes.node
};

Breadcrumbs.Crumb.defaultProps = {
	as: NavLink
};

Breadcrumbs.Crumb.displayName = 'Breadcrumbs.Crumb';

const RouterBreadcrumbs = withLocaleRouter(props => {
	const { routes, lastName } = props;

	if (routes) {
		let children = routes.slice(1).map((route, i) => {
			let link,
				name = route.name;

			if (i < routes.length - 2) link = route.path;
			else name = lastName || route.name;

			return <Breadcrumbs.Crumb key={i} as={NavLink} link={link} name={name} />;
		});

		return (
			<Breadcrumbs {...omit(props, ['routes', 'lastName'])}>
				{children}
			</Breadcrumbs>
		);
	}
	else
		return null;
});

RouterBreadcrumbs.propTypes = {
	routes: PropTypes.array,
	lastName: PropTypes.string,

	// eslint-disable-next-line react/forbid-foreign-prop-types
	...Breadcrumbs.propTypes
};

export default Breadcrumbs;
export { RouterBreadcrumbs };
