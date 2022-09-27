import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Default from './layouts/Default';
import { connect } from 'react-redux';
import { loadArticle } from 'redux/actions/content';
import EmptyState from 'components/Layout/EmptyState';
import NotFoundView from 'layout/components/NotFoundView';
import WithLocalization from 'components/Localization/WithLocalization';
import ContentMetaTags from 'components/Content/ContentMetaTags';
import { language, region } from 'redux/selectors';
import AssetConverter from 'components/Content/AssetConverter';
import defaultASpot from './img/default-aspot.jpg';
import layouts from './layouts';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import { locationToUrl } from 'utils/router';

class ContentView extends Component {
	constructor(props) {
		super(props);

		const { match: { params: { contentId } }, loadArticle } = props;
		loadArticle({ id: contentId });
	}

	componentDidUpdate(prevProps) {
		const { match: { params: { contentId } }, loadArticle, language } = this.props;
		const { match: { params: { contentId: prevContentId } } } = prevProps;

		if(contentId && (contentId !== prevContentId || language !== prevProps.language))
			loadArticle({ id: contentId });
	}

	validatePublishState() {
		const { article: { result }, language, preview } = this.props;

		return result && (preview || result.publishState[language] === 'Published');
	}

	render() {
		const { article: { loading, result } } = this.props;

		if(loading) {
			return (
				<EmptyState.Loading />
			);
		}
		else {
			if(result && this.validatePublishState()) {
				const { 
					heading, 
					subHeading, 
					articleBody, 
					publishDate, 
					spotA, 
					spotB, 
					byline, 
					byline_link, 
					relatedArticles,
					synopsis,
					publishState
				} = result;
				const { language, history, location, locale } = this.props;

				const layoutName = result.layout ? result.layout.name : null;
				const ContentLayout = layouts[layoutName] || Default;

				const imageSpotA = new AssetConverter(spotA).getImage({
					src: defaultASpot
				});
				const carouselImages = new AssetConverter(spotB).asImageArray;

				const alternates = Object.keys(publishState).filter(lang => publishState[lang] === 'Published').map(language => ({
					language,
					url: locationToUrl(history.expandLocation(location, { ...locale, language }))
				}));

				return (
					<WithLocalization names={['Jobs', 'Students']}>
						{() => (
							<React.Fragment>
								<ContentMetaTags
									title={heading[language]}
									metaDescription={synopsis[language]}
									alternates={alternates} />

								<ContentLayout 
									title={heading[language]}
									subTitle={subHeading[language]}
									content={articleBody[language]}
									date={publishDate}
									image={imageSpotA}
									carouselImages={carouselImages}
									author={byline}
									authorUrl={byline_link}
									relatedArticles={relatedArticles} />
							</React.Fragment>
						)}
					</WithLocalization>
				);
			}
			else
				return <NotFoundView />;
		}
	}
}

ContentView.propTypes = {
	preview: PropTypes.bool,

	match: PropTypes.object.isRequired,
	article: PropTypes.object.isRequired,
	loadArticle: PropTypes.func.isRequired,
	language: PropTypes.string.isRequired,
	region: PropTypes.string.isRequired,
	history: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired,
	locale: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	article: state.content.article,
	language: language(state),
	region: region(state)
});
 
export default withLocaleRouter(connect(mapStateToProps, { loadArticle })(ContentView));