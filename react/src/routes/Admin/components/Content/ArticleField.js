import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DropdownField from 'components/Forms/DropdownField';
import { connect } from 'react-redux';
import { lookupArticles } from 'redux/actions/tiles';
import { apiPromise } from 'utils/redux';
import omit from 'lodash/omit';
import { makeReduxField } from 'components/Forms/common';
import './ArticleField.css';

let ArticleField = 
	class ArticleField extends Component {
		loadArticles = async search => {
			const { lookupArticles } = this.props;

			lookupArticles({ 
				startIndex: 0, 
				count: 50, 
				language: 'en', 
				filter: { 
					article: search
				} 
			});

			const { articles } = await apiPromise(() => this.props.articles);

			return {
				options: articles.map(article => ({
					value: article.id,
					label: (
						<div className="article-field-option">
							<div className="article-field-option-heading">{article.heading}</div>
							<div className="article-field-option-slug">/content/{article.id}</div>
						</div>
					)
				}))
			};
		}

		loadOption = async value => {
			if(value)
				return {
					value,
					label: value
				};
				
			return null;
		}

		render() {
			// eslint-disable-next-line no-unused-vars
			const { articles, lookupArticles, ...otherProps } = this.props;

			return (
				<DropdownField 
					{...otherProps} 
					className="article-field"
					options={this.loadArticles}
					loadOption={this.loadOption} />
			);
		}
	};

ArticleField.propTypes = {
	lookupArticles: PropTypes.func.isRequired,
	articles: PropTypes.object.isRequired,

	// eslint-disable-next-line react/forbid-foreign-prop-types
	...omit(DropdownField.propTypes, ['options']),
};

ArticleField.defaultProps = {
	...DropdownField.defaultProps
};

const mapStateToProps = state => ({
	articles: state.tiles.lookupArticles
});

ArticleField = connect(mapStateToProps, { lookupArticles })(ArticleField);

export default ArticleField;
export const ReduxArticleField = makeReduxField(ArticleField);
