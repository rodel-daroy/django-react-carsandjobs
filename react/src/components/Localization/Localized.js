import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { localized } from 'redux/selectors';
import castArray from 'lodash/castArray';
import { LocalizationNames } from './types';

const Localized = ({ children, names, ...otherProps }) => {
	const combined = Object.assign({}, ...castArray(names).map(name => otherProps[name]));

	return children(combined);
};

Localized.propTypes = {
	names: LocalizationNames.isRequired,
	children: PropTypes.func.isRequired
};

const mapStateToProps = (state, { names }) => {
	let result = {};
	for(const name of castArray(names))
		result[name] = localized(name)(state);

	return result;
};
 
export default connect(mapStateToProps)(Localized);