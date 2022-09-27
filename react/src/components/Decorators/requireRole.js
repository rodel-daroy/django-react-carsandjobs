import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import Localized from 'components/Localization/Localized';
import EmptyState from 'components/Layout/EmptyState';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import { parseMarkdown } from 'utils/format';
import LocaleLink from 'components/Localization/LocaleLink';
import { isSignedIn, authRole, JOBSEEKER_ROLE, isSigningIn } from 'redux/selectors';
import { connect } from 'react-redux';
import { showModal } from 'redux/actions/modals';
import LocalizedNode from 'components/Localization/LocalizedNode';

const requireRole = (roles, defaultRoute) => WrappedComponent => {
	class WrapperComponent extends Component {
		componentDidMount() {
			const { signedIn, history, location, showModal } = this.props;

			if(!signedIn)
				history.push(`${defaultRoute || location.pathname}?signin=1&redirect=${location.pathname}`);
			else {
				if(!this.validateRole()) {
					showModal({
						title: <LocalizedNode as="h1" names="Common" groupKey="ErrorTitle" />,
						content: () => (
							<Localized names="Common">
								{({ ForbiddenMessage }) => (
									<div dangerouslySetInnerHTML={{ __html: parseMarkdown(ForbiddenMessage) }}>
									</div>
								)}
							</Localized>
						)
					});
				}
			}
		}

		validateRole() {
			const { authRole } = this.props;

			if(authRole == null)
				return false;
			else {
				let actualRoles = roles || [JOBSEEKER_ROLE];
				if(!(actualRoles instanceof Array))
					actualRoles = [actualRoles];

				return actualRoles.includes(authRole);
			}
		}

		renderSignIn() {
			return (
				<Localized names="Common">
					{({ SignInRequiredMessage, SignInLabel }) => (
						<EmptyState>
							<div>
								<div dangerouslySetInnerHTML={{ __html: parseMarkdown(SignInRequiredMessage) }}></div>
								<PrimaryButton as={LocaleLink} to="?signin=1">
									{SignInLabel}
								</PrimaryButton>
							</div>
						</EmptyState>
					)}
				</Localized>
			);
		}

		renderForbidden() {
			return (
				<Localized names="Common">
					{({ ForbiddenMessage, SignInLabel }) => (
						<EmptyState>
							<div>
								<div dangerouslySetInnerHTML={{ __html: parseMarkdown(ForbiddenMessage) }}></div>
								<PrimaryButton as={LocaleLink} to="?signin=1">
									{SignInLabel}
								</PrimaryButton>
							</div>
						</EmptyState>
					)}
				</Localized>
			);
		}

		render() {
			const { signedIn, signingIn } = this.props;

			if(signedIn) {
				if(this.validateRole())
					return <WrappedComponent {...this.props} />;
				else
					return this.renderForbidden();
			}
			
			if(signingIn)
				return <EmptyState.Loading />;
				
			return this.renderSignIn();
		}
	}

	const mapStateToProps = state => ({
		signedIn: isSignedIn(state),
		signingIn: isSigningIn(state),
		authRole: authRole(state)
	});

	WrapperComponent.propTypes = {
		signedIn: PropTypes.bool,
		signingIn: PropTypes.bool,
		authRole: PropTypes.any,
		history: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
		showModal: PropTypes.func.isRequired
	};

	return withLocaleRouter(connect(mapStateToProps, { showModal })(WrapperComponent));
};

export default requireRole;