import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { verifyEmail } from 'redux/actions/profile';
import { showModal } from 'redux/actions/modals';
import { urlSearchToObj } from 'utils/url';
import { passiveModal } from 'components/Modals/helpers';
import LocalizedNode from 'components/Localization/LocalizedNode';
import withLocaleRouter from 'components/Localization/withLocaleRouter';

class VerifyEmailView extends Component {
	constructor(props) {
		super(props);

		const { location, verifyEmail } = props;
		const { email, utoken: token } = urlSearchToObj(location.search);

		if(email && token)
			verifyEmail({
				email,
				token
			});
	}

	componentDidUpdate(prevProps) {
		const { verifyState: { loading, result, error }, showModal } = this.props;

		if(!loading && prevProps.verifyState.loading && result && !error)
			showModal(passiveModal({
				title: <LocalizedNode names="Common" groupKey="EmailVerifiedTitle" as="span" />,
				redirectTo: '/?signin=1'
			}));
	}

	render() { 
		return null;
	}
}

VerifyEmailView.propTypes = {
	verifyEmail: PropTypes.func.isRequired,
	verifyState: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired,
	showModal: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	verifyState: state.profile.verifyEmail
});
 
export default withLocaleRouter(connect(mapStateToProps, { verifyEmail, showModal })(VerifyEmailView));