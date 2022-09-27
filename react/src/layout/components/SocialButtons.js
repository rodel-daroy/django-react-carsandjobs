import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadNavigation } from 'redux/actions/localization';
import { region, language, navigation } from 'redux/selectors';
import sortBy from 'lodash/sortBy';
import './SocialButtons.css';

const MAPPINGS = {
	'Twitter': 'icon icon-twitter',
	'YouTube': 'icon icon-youtube',
	'LinkedIn': 'icon icon-linkedin',
	'Facebook': 'icon icon-facebook'
};

class SocialButtons extends Component {
	constructor(props) {
		super(props);

		const { language, region, loadNavigation } = props;
		loadNavigation({
			name: 'Social',
			language,
			region
		});
	}

	componentDidUpdate(prevProps) {
		const { language, region, loadNavigation } = this.props;

		if(language !== prevProps.language || region !== prevProps.region)
			loadNavigation({
				name: 'Social',
				language,
				region
			});
	}

	renderButton = ({ caption, to, type }) => {
		if(type === 'MenuItem') {
			const mapping = MAPPINGS[caption.en || caption.fr];

			if(mapping)
				return (
					<li key={caption.en || caption.fr}>
						<a href={to} target="_blank" rel="noopener noreferrer" title={caption.en || caption.fr}>
							<span className={mapping}></span>
						</a>
					</li>
				);
		}
		
		return null;
	}

	render() {
		const { navigation, className } = this.props;

		return (
			<ul className={`social-buttons ${className || ''}`}>
				{sortBy(navigation, ['order']).map(this.renderButton)}
			</ul>
		);
	}
}

SocialButtons.propTypes = {
	className: PropTypes.string,
	
	language: PropTypes.string.isRequired,
	region: PropTypes.string.isRequired,
	loadNavigation: PropTypes.func.isRequired,
	navigation: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
	language: language(state),
	region: region(state),
	navigation: navigation('Social')(state)
});
 
export default connect(mapStateToProps, { loadNavigation })(SocialButtons);