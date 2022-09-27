import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { integer } from 'airbnb-prop-types';
import EmptyState from 'components/Layout/EmptyState';
import { PageStepper, PageStepperSmall } from 'components/Navigation/PageStepper';
import { mediaQuery } from 'utils/style';
import Media from 'react-media';
import Localized from 'components/Localization/Localized';
import './PagedList.css';

class PagedList extends Component {
	state = {}

	componentDidMount() {
		const { onRangeChange, pageIndex } = this.props;

		onRangeChange(this.getRange(pageIndex));
	}

	getRange(pageIndex = this.props.pageIndex) {
		const { pageSize } = this.props;

		const startIndex = pageSize * pageIndex;
		const endIndex = startIndex + pageSize - 1;

		return {
			startIndex,
			endIndex
		};
	}

	handlePageChange = pageIndex => {
		const { onChange, pageIndex: previousPageIndex } = this.props;

		this.setState({
			previousPageIndex 
		});

		onChange(pageIndex);
	}

	componentDidUpdate(prevProps) {
		const { pageIndex, onRangeChange } = this.props;

		if(pageIndex !== prevProps.pageIndex)
			onRangeChange(this.getRange(pageIndex));
	}

	renderPaginator(className) {
		const { totalCount, pageSize, pageIndex } = this.props;

		const startIndex = pageSize * pageIndex;
		const endIndex = Math.min(startIndex + pageSize - 1, totalCount - 1);

		return (
			<Localized names="Common">
				{({ PageLabel }) => (
					<div className={`paged-list-paginator ${className || ''}`}>
						{totalCount > 0 && (
							<span className="paged-list-page-count">
								{(PageLabel || '')
									.replace('[start]', startIndex + 1)
									.replace('[end]', endIndex + 1)
									.replace('[total]', totalCount)}
							</span>
						)}

						{pageSize < totalCount && (
							<Media query={mediaQuery('xs sm')}>
								{small => small ? (
									<PageStepperSmall
										className="paged-list-paginator-inner"
										onChange={this.handlePageChange}
										count={Math.ceil(totalCount / pageSize)}
										index={pageIndex}
										size="large"
										wrapAround={false} />
								) : (
									<PageStepper
										className="paged-list-paginator-inner"
										onChange={this.handlePageChange}
										count={Math.ceil(totalCount / pageSize)}
										index={pageIndex}
										size="large"
										numbers
										limit={5}
										wrapAround={false} />
								)}
							</Media>
						)}
					</div>
				)}
			</Localized>
		);
	}

	renderInner() {
		const { loading, children } = this.props;
		let { pageIndex } = this.props;
		const { previousPageIndex } = this.state;

		if(loading && typeof previousPageIndex === 'number')
			pageIndex = previousPageIndex;

		const items = children(this.getRange(pageIndex));
		if(items)
			return (
				<React.Fragment>
					{this.renderPaginator('top')}

					<div className="paged-list-results">
						{items}
					</div>

					{this.renderPaginator('bottom')}
				</React.Fragment>
			);
		else
			return null;
	}

	render() { 
		const { loading, className } = this.props;

		return (
			<div className={`paged-list ${loading ? 'loading' : ''} ${className || ''}`}>
				{this.renderInner()}

				{loading && <EmptyState.Loading />}
			</div>
		);
	}
}

PagedList.propTypes = {
	className: PropTypes.string,
	totalCount: integer().isRequired,
	pageSize: integer(),
	pageIndex: integer(),
	children: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	onRangeChange: PropTypes.func.isRequired,
	loading: PropTypes.bool
};

PagedList.defaultProps = {
	pageSize: 20,
	pageIndex: 0
};
 
export default PagedList;