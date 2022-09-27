import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EmptyState from 'components/Layout/EmptyState';
import { getLocalizedStrings } from 'redux/actions/localization';
import castArray from 'lodash/castArray';
import isEqual from 'lodash/isEqual';
import { LocalizationNames } from './types';

class WithLocalization extends Component {
	constructor(props) {
		super(props);

		const { getLocalizedStrings, names, language } = props;

		for(const name of castArray(names))
			getLocalizedStrings({
				groupName: name,
				language
			});
	}

	componentDidUpdate(prevProps) {
		const { names, language, getLocalizedStrings } = this.props;

		if(!isEqual(names, prevProps.names) || language !== prevProps.language)
			for(const name of castArray(names))
				getLocalizedStrings({
					groupName: name,
					language
				});
	}

	render() {
		const { children, groups, names } = this.props;

		if(groups && castArray(names).findIndex(name => !!groups[name]) !== -1)
			return children();
		else
			return (
				<EmptyState.Loading />
			);
	}
}

WithLocalization.propTypes = {
	names: LocalizationNames.isRequired,
	children: PropTypes.func.isRequired,

	language: PropTypes.string.isRequired,
	getLocalizedStrings: PropTypes.func.isRequired,
	groups: PropTypes.object
};
 
const mapStateToProps = state => ({
	language: state.localization.current.language,
	groups: state.localization.strings.groups
});

export default connect(mapStateToProps, { getLocalizedStrings })(WithLocalization);