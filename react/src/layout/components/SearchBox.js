import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SearchForm from './SearchForm';
import { filterToUrlSearch } from 'routes/Jobs/filter';
import Localized from 'components/Localization/Localized';
import { scrollTo } from 'utils';
import { focusField } from 'components/Forms/Field';
import WithAsset from 'components/Content/WithAsset';
import ASpot from 'components/Content/ASpot';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import './SearchBox.css';

class SearchBox extends Component {
	state = {
		flash: false
	}

	focus() {
		if(this._container) {
			scrollTo(this._container);

			setTimeout(() => focusField('keywords'), 200);

			this.setState({ flash: true });
		}
	}

	componentDidUpdate(prevProps, prevState) {
		const { flash } = this.state;

		if(flash && !prevState.flash) {
			clearTimeout(this._flashTimeout);

			this._flashTimeout = setTimeout(() => {
				this.setState({ flash: false });
			}, 2000);
		}
	}

	componentWillUnmount() {
		clearTimeout(this._flashTimeout);
	}

	render() {
		// eslint-disable-next-line no-unused-vars, react/prop-types
		const { orientation, history, location, match, className, background, assetName, setLocale, locale, ...otherProps } = this.props;
		const { flash } = this.state;
		
		const handleSearch = values => {
			const search = filterToUrlSearch(values);

			history.push(`/jobs/search${search}`);
		};

		const container = children => {
			if(orientation === 'horizontal')
				return <div className="search-box-horizontal">{children}</div>;
			else
				return (
					<WithAsset name={assetName}>
						{({ asImage }) => (
							<ASpot className="search-box-a-spot" image={asImage}>
								{children}
							</ASpot>
						)}
					</WithAsset>
				);
		};

		return (
			<Localized names="Common">
				{({ SearchJobsTitle }) => (
					<div {...otherProps} className={`search-box ${flash ? 'flash' : ''} ${className || ''}`} ref={ref => this._container = ref}>
						{container(
							<div className="search-box-content">
								<h1 className="search-box-title">{SearchJobsTitle}</h1>

								<SearchForm form="searchForm" onSubmit={handleSearch} orientation={orientation} />
							</div>
						)}
					</div>
				)}
			</Localized>
		);
	}
}

SearchBox.propTypes = {
	orientation: PropTypes.oneOf(['horizontal', 'vertical']),
	className: PropTypes.string,
	background: PropTypes.bool,
	assetName: PropTypes.string,

	history: PropTypes.object.isRequired
};

SearchBox.defaultProps = {
	orientation: 'vertical',
	assetName: 'Search A-Spot'
};

export default withLocaleRouter(SearchBox);