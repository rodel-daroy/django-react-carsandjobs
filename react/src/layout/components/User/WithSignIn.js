import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import { urlSearchToObj, mergeUrlSearch } from 'utils/url';
import WithResponsiveModal from 'components/Modals/WithResponsiveModal';
import SignInForm from './SignInForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import UpdatePasswordForm from './UpdatePasswordForm';
import ResendVerificationEmailForm from './ResendVerificationEmailForm';
import ResponsiveModalFrame from 'components/Modals/ResponsiveModalFrame';
import { resetPassword, updatePassword, resendVerificationEmail } from 'redux/actions/profile';
import { signInJobseeker, signInDealer, signOut } from 'redux/actions/user';
import { connect } from 'react-redux';
import { localized, JOBSEEKER_ORIGIN, DEALER_ORIGIN } from 'redux/selectors';
import { parseMarkdown } from 'utils/format';
import { showModal } from 'redux/actions/modals';
import LocalizedNode from 'components/Localization/LocalizedNode';
import { passiveModal } from 'components/Modals/helpers';
import Localized from 'components/Localization/Localized';
import './WithSignIn.css';

class WithSignIn extends Component {
	state = {}

	static getDerivedStateFromProps(props, state) {
		const { location: { search } } = props;
		const searchObj = urlSearchToObj(search);

		let signIn = !!parseInt(searchObj.signin, 10);
		let forgotPassword = searchObj['forgot-password'];
		let updatePassword = searchObj['update-password'];
		let resendVerification = searchObj['resend-verification'];

		const isOpen = signIn || (forgotPassword != null) || (updatePassword != null) || (resendVerification != null);
		const redirect = searchObj.redirect;

		if(!isOpen) {
			signIn = state.signIn;
			forgotPassword = state.forgotPassword;
			updatePassword = state.updatePassword;
			resendVerification = state.resendVerification;
		}

		return {
			isOpen,
			signIn,
			forgotPassword,
			updatePassword,
			resendVerification,
			redirect,
			updateToken: searchObj.utoken
		};
	}

	get redirectUrl() {
		const { location: { pathname, search }, signInState } = this.props;
		const { redirect, signIn, resendVerification } = this.state;

		if(redirect)
			return redirect;

		if(signIn) {
			if(signInState.origin === DEALER_ORIGIN)
				return '/employer/dashboard';

			if(signInState.origin === JOBSEEKER_ORIGIN)
				return '/profile';
		}

		if(resendVerification)
			return '?signin=1';

		return pathname + mergeUrlSearch(search, { 
			signin: null, 
			'forgot-password': null, 
			'update-password': null, 
			'resend-verification': null,
			redirect: null,
			utoken: null
		});
	}

	getApiState(props = this.props) {
		const { signIn, forgotPassword, updatePassword, resendVerification } = this.state;
		const { signInState, resetPasswordState, updatePasswordState, resendVerificationState } = props;

		if(signIn)
			return signInState;
		else {
			if(forgotPassword)
				return resetPasswordState;
			else {
				if(updatePassword)
					return updatePasswordState;
				else {
					if(resendVerification)
						return resendVerificationState;
					else
						return null;
				}
			}
		}
	}

	showError(messageKey) {
		const { showModal, localized } = this.props;

		showModal({
			title: <LocalizedNode as="h1" names="Common" groupKey="ErrorTitle" />,
			content: () => (
				<div dangerouslySetInnerHTML={{ __html: parseMarkdown(localized[messageKey]) }}></div>
			)
		});
	}

	showSuccess() {
		const { showModal, localized, location } = this.props;
		const { forgotPassword, resendVerification } = this.state;

		if(resendVerification) {
			showModal({
				title: <LocalizedNode names="Common" groupKey="VerificationEmailSentTitle" as="h2" />,
				content: () => (
					<Localized names="Common">
						{({ VerificationEmailSentMessage }) => (
							<div dangerouslySetInnerHTML={{ __html: parseMarkdown(VerificationEmailSentMessage) }}></div>
						)}
					</Localized>
				)
			});

			return;
		}

		const titleKey = forgotPassword ? 'ResetPasswordSuccessTitle' : 'UpdatePasswordSuccessTitle';
		const messageKey = forgotPassword ? 'ResetPasswordSuccessMessage' : 'UpdatePasswordSuccessMessage';

		let redirectTo = {
			...location,
			search: null
		};
		if(!forgotPassword)
			redirectTo.search = '?signin=1';

		showModal(passiveModal({
			title: <LocalizedNode names="Common" groupKey={titleKey} as="h1" />,
			content: () => (
				<div dangerouslySetInnerHTML={{ __html: parseMarkdown(localized[messageKey]) }}></div>
			),
			redirectTo
		}));
	}

	componentDidUpdate(prevProps) {
		const { history, signOut, location: { search } } = this.props;
		const { signIn } = this.state;

		const shouldSignOut = !!parseInt(urlSearchToObj(search).signout, 10);

		if(shouldSignOut) {
			signOut();
			history.replace('/');
		}
		else {
			const apiState = this.getApiState();
			const prevApiState = this.getApiState(prevProps);

			if(apiState) {
				if(apiState.result && !apiState.loading && !apiState.error && prevApiState.loading) {
					if(signIn)
						history.replace(this.redirectUrl);
					else
						this.showSuccess();
				}
			}
		}
	}

	transformSignInError = error => {
		const { localized: { SignInErrorMessage } } = this.props;

		if(error.status === 401)
			return new Error(SignInErrorMessage);
		
		return error;
	}

	transformResetError = error => {
		const { localized: { ResetPasswordErrorMessage } } = this.props;

		if(error.status === 400)
			return new Error(ResetPasswordErrorMessage);
		
		return error;
	}
	
	handleSignInJobseeker = values => {
		this.props.signInJobseeker(values, { transformError: this.transformSignInError });
	}

	handleSignInDealer = values => {
		this.props.signInDealer(values, { transformError: this.transformSignInError });
	}

	handleResetPassword = values => {
		this.props.resetPassword(values, { transformError: this.transformResetError });
	}

	handleUpdatePassword = values => {
		const { password } = values;
		const { updatePassword: email, updateToken: token } = this.state;

		values = {
			'new-password': password,
			email,
			token
		};

		this.props.updatePassword(values);
	}

	handleResendVerification = values => {
		this.props.resendVerificationEmail(values);
	}

	handleRequestClose = () => {
		const { history } = this.props;

		history.push(this.redirectUrl);
	}

	renderSignInContent({ mobile, loading }) {
		const { localized: { SignInLabel } } = this.props;

		return (
			<ResponsiveModalFrame 
				title={SignInLabel}
				className="with-signin-modal-frame"
				onRequestClose={this.handleRequestClose}
				mobile={mobile}>

				<SignInForm 
					onSignInJobseeker={this.handleSignInJobseeker} 
					onSignInDealer={this.handleSignInDealer}
					onCancel={this.handleRequestClose}
					loading={loading} />
			</ResponsiveModalFrame>
		);
	}

	renderForgotPasswordContent({ mobile, loading }) {
		let { forgotPassword: email } = this.state;
		if(email.indexOf('@') === -1)
			email = '';

		return (
			<ResponsiveModalFrame
				title={this.props.localized.ResetPasswordTitle}
				className="with-signin-modal-frame"
				onRequestClose={this.handleRequestClose}
				mobile={mobile}>
				
				<ForgotPasswordForm 
					loading={loading} 
					initialValues={{ email }}
					onSubmit={this.handleResetPassword}
					onCancel={this.handleRequestClose} />
			</ResponsiveModalFrame>
		);
	}

	renderUpdatePasswordContent({ mobile, loading }) {
		return (
			<ResponsiveModalFrame
				title={this.props.localized.UpdatePasswordTitle}
				className="with-signin-modal-frame"
				onRequestClose={this.handleRequestClose}
				mobile={mobile}>
				
				<UpdatePasswordForm 
					loading={loading}
					onSubmit={this.handleUpdatePassword}
					onCancel={this.handleRequestClose} />
			</ResponsiveModalFrame>
		);
	}

	renderResendVerificationContent({ mobile, loading }) {
		let { resendVerification: email } = this.state;
		if(email.indexOf('@') === -1)
			email = '';

		return (
			<ResponsiveModalFrame
				title={this.props.localized.ResendVerificationEmailTitle}
				className="with-signin-modal-frame"
				onRequestClose={this.handleRequestClose}
				mobile={mobile}>
				
				<ResendVerificationEmailForm 
					loading={loading}
					initialValues={{ email }}
					onSubmit={this.handleResendVerification}
					onCancel={this.handleRequestClose} />
			</ResponsiveModalFrame>
		);
	}

	/* eslint-disable no-unused-vars */
	renderModalContent = ({ mobile }) => {
		const apiState = this.getApiState();

		if(apiState) {
			const { loading } = apiState;

			/* eslint-enable */
			if(this.state.signIn)
				return this.renderSignInContent({ mobile, loading });
			else {
				if(this.state.forgotPassword != null)
					return this.renderForgotPasswordContent({ mobile, loading });
				else {
					if(this.state.updatePassword != null)
						return this.renderUpdatePasswordContent({ mobile, loading });
					else {
						if(this.state.resendVerification != null)
							return this.renderResendVerificationContent({ mobile, loading });
						else
							return null;
					}
				}
			}
		}
	}

	render() { 
		/* eslint-disable no-unused-vars */
		const { location, ...otherProps } = this.props;
		/* eslint-enable */
		const { isOpen } = this.state;

		return (
			<WithResponsiveModal 
				{...otherProps} 
				modalContent={this.renderModalContent}
				isOpen={isOpen}
				onRequestClose={this.handleRequestClose} />
		);
	}
}

WithSignIn.propTypes = {
	// eslint-disable-next-line react/forbid-foreign-prop-types
	...WithResponsiveModal.propTypes, 

	location: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	signInJobseeker: PropTypes.func.isRequired,
	signInDealer: PropTypes.func.isRequired,
	signInState: PropTypes.object,
	signOut: PropTypes.func.isRequired,
	localized: PropTypes.object.isRequired,
	showModal: PropTypes.func.isRequired,
	resetPassword: PropTypes.func.isRequired,
	updatePassword: PropTypes.func.isRequired,
	resendVerificationEmail: PropTypes.func.isRequired,
	resetPasswordState: PropTypes.object.isRequired,
	updatePasswordState: PropTypes.object.isRequired,
	resendVerificationState: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	signInState: state.user.current,
	resetPasswordState: state.profile.resetPassword,
	updatePasswordState: state.profile.updatePassword,
	resendVerificationState: state.profile.resendVerificationEmail,
	localized: localized('Common')(state)
});
 
export default withLocaleRouter(connect(mapStateToProps, { 
	signInJobseeker, 
	signInDealer, 
	signOut, 
	showModal, 
	resetPassword, 
	updatePassword,
	resendVerificationEmail
})(WithSignIn));