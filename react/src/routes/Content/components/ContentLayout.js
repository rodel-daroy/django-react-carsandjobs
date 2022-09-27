import React from 'react';
import PropTypes from 'prop-types';
import { integer } from 'airbnb-prop-types';
import MasterDetail from 'components/Layout/MasterDetail';
import { parseMarkdown } from 'utils/format';
import AnchorNav from 'components/Navigation/AnchorNav';
import './ContentLayout.css';

const { Provider, Consumer } = React.createContext({ reverse: false });

const ContentLayout = ({ children, className, reverse, widthBreak, ratio, ...otherProps }) => (
	<Provider value={{ reverse, widthBreak, ratio }}>
		<div {...otherProps} className={`content-layout ${reverse ? 'reverse' : ''} ${className || ''}`}>
			{children}
		</div>
	</Provider>
);

ContentLayout.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	reverse: PropTypes.bool,
	widthBreak: integer(),

	// eslint-disable-next-line react/forbid-foreign-prop-types
	ratio: (MasterDetail.propTypes || {}).ratio
};

ContentLayout.defaultProps = {
	ratio: 'quarter'
};

export const MARKDOWN_OPTIONS = {
	offsetHeadings: 2,
	videoClassName: 'content-layout-content-video'
};

const filterAnchorNavHeadings = (headings = []) => headings.filter(heading => heading.level === 1);

const parseWithAnchorNav = (anchorNavContent, children) => {
	// render children as HTML and extract headings from children, if child content is same as anchor nav content
	let options = { ...MARKDOWN_OPTIONS };

	if (anchorNavContent && anchorNavContent === children)
		options.extractHeadings = true;

	const content = (
		<div dangerouslySetInnerHTML={{ __html: parseMarkdown(children, options) }}></div>
	);
	let headings = filterAnchorNavHeadings(options.headings);

	// in case the content for the anchor nav differs from children, extract headings from anchor nav content
	if (anchorNavContent && anchorNavContent !== children) {
		const anchorNavOptions = {
			...MARKDOWN_OPTIONS,
			extractHeadings: true
		};

		parseMarkdown(anchorNavContent, anchorNavOptions);
		headings = filterAnchorNavHeadings(anchorNavOptions.headings);
	}
	
	return { 
		content, 
		headings 
	};
};

ContentLayout.Content = ({ sidebar, children, anchorNavContent }) => (
	<Consumer>
		{({ reverse, widthBreak, ratio }) => {
			let content = children;
			let headings;

			if(typeof children === 'string')
				({ content, headings } = parseWithAnchorNav(anchorNavContent, children));

			return (
				<MasterDetail 
					className="content-layout-md"
					master={() => (
						<React.Fragment>
							{sidebar && (
								<aside className="content-layout-sidebar">
									{sidebar}
								</aside>
							)}

							{anchorNavContent && headings && (
								<AnchorNav className="content-layout-anchor-nav">
									{headings.map(({ slug, text }) => (
										<AnchorNav.Link key={slug} name={text} anchor={slug} />
									))}
								</AnchorNav>
							)}
						</React.Fragment>
					)}
					detail={() => (
						<React.Fragment>
							<div className="content-layout-content">
								{content}
							</div>
						</React.Fragment>
					)}
					ratio={ratio}
					showDetail
					reverse={reverse}
					widthBreak={widthBreak} />
			);
		}}
	</Consumer>
);

ContentLayout.Content.displayName = 'ContentLayout.Content';

ContentLayout.Content.propTypes = {
	sidebar: PropTypes.node,
	children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
	anchorNavContent: PropTypes.string
};

ContentLayout.Foreground = ({ children }) => (
	<Consumer>
		{({ reverse, widthBreak, ratio }) => (
			<div className="content-layout-foreground-outer">
				<MasterDetail
					role="presentation"
					className="content-layout-foreground-md" 
					master={() => null}
					detail={() => null}
					ratio={ratio}
					showDetail 
					reverse={reverse}
					widthBreak={widthBreak} />

				<div className="content-layout-foreground-outer-content">
					{children}
				</div>
			</div>
		)}
	</Consumer>
);

ContentLayout.Foreground.displayName = 'ContentLayout.Foreground';

ContentLayout.Foreground.propTypes = {
	children: PropTypes.node
};
 
export default ContentLayout;


