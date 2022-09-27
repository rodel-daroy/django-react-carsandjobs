import { Component } from 'react';
import PropTypes from 'prop-types';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import { urlSearchToObj } from 'utils/url';
import { connect } from 'react-redux';
import { signInTada } from 'redux/actions/user';
import { isSignedIn, authOrigin, TADA_ORIGIN } from 'redux/selectors';

class TadaContainer extends Component {
	state = {}

	static getDerivedStateFromProps(props) {
		const { location: { search } } = props;

		const token = urlSearchToObj(search).token;
		return {
			token
		};
	}

	componentDidMount() {
		const { token } = this.state;
		const { signInTada } = this.props;

		if(token)
			signInTada({ token });
	}

	componentDidUpdate(prevProps, prevState) {
		const { token } = this.state;
		const { signInTada, signedIn, origin, history } = this.props;

		if(token && token !== prevState.token)
			signInTada({ token });
		else {
			if(signedIn && prevProps.signedIn !== signedIn && origin === TADA_ORIGIN)
				history.push('/employer/dashboard');
		}
	}

	render() {
		return null;
	}
}

TadaContainer.propTypes = {
	location: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	signInTada: PropTypes.func.isRequired,
	signedIn: PropTypes.bool.isRequired,
	origin: PropTypes.string
};

const mapStateToProps = state => ({
	signedIn: isSignedIn(state),
	origin: authOrigin(state)
});
 
export default withLocaleRouter(connect(mapStateToProps, { signInTada })(TadaContainer));