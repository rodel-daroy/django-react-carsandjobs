import React from 'react';
import PropTypes from 'prop-types';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import RelatedArticles from './RelatedArticles';
import get from 'lodash/get';
import './RelatedArticlesView.css';

const RelatedArticlesView = ({ articles, className }) => {
	if(articles && articles.length > 0) {
		const displayArticles = articles.slice(0, 4).map((item, i) => {
			const image = get(item, 'assets[0].asset_content[0].url');

			//const link = props.routes[1].path == '/content/preview/:content_name' ? `content/preview/${item.content_id}` : `content/${item.slug}`;

			const link = `/content/${item.id}`;

			return (
				<RelatedArticles.Article 
					key={i} 
					title={item.heading} 
					content={item.synopsis} 
					link={link} 
					image={image} />
			);
		});

		return (
			<aside className={`related-articles-view ${className || ''}`}>
				<h2>Related articles</h2>

				<RelatedArticles>
					{displayArticles}
				</RelatedArticles>
			</aside>
		);
	}
	else
		return null;
};

RelatedArticlesView.propTypes = {
	articles: PropTypes.array,
	className: PropTypes.string
};

export default withLocaleRouter(RelatedArticlesView);
