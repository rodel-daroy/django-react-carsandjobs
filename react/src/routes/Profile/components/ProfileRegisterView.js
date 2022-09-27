import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ProfileRegisterWizard from './ProfileRegisterWizard';
import { connect } from 'react-redux';
import { register } from 'redux/actions/profile';
import { showModal } from 'redux/actions/modals';
import LocalizedNode from 'components/Localization/LocalizedNode';
import { localized } from 'redux/selectors';
import Localized from 'components/Localization/Localized';
import { parseMarkdown } from 'utils/format';
import CommandBar from 'components/Layout/CommandBar';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import get from 'lodash/get';
import LocaleLink from 'components/Localization/LocaleLink';

class ProfileRegisterView extends Component {
	handleSubmit = values => {
		const { register } = this.props;

		register(values, {
			transformError: this.transformError
		});
	}

	transformError = error => {
		const { localized: { DuplicateUserMessage } } = this.props;

		if(error.status === 409)
			return new Error(DuplicateUserMessage);
		else
			return error;
	}

	componentDidUpdate(prevProps) {
		const { registerProfile, showModal } = this.props;

		if(registerProfile !== prevProps.registerProfile) {
			if(registerProfile.result && !registerProfile.loading) {
				const email = get(registerProfile.result, 'data.email');

				showModal({
					title: <LocalizedNode names="Profile" groupKey="RegisteredTitle" as="h1" />,
					content: ({ close }) => (
						<Localized names={['Common', 'Profile']}>
							{({ RegisteredMessage, ResendEmailLabel }) => (
								<div>
									<div 
										dangerouslySetInnerHTML={{ 
											__html: parseMarkdown((RegisteredMessage || '').replace('[email]', email))
										}}>
									</div>

									<CommandBar>
										<PrimaryButton 
											as={LocaleLink} 
											to={`/?resend-verification=${email}`} 
											onClick={() => close(false)}>
											
											{ResendEmailLabel}
										</PrimaryButton>
									</CommandBar>
								</div>
							)}
						</Localized>
					),
					redirectTo: '/'
				});
			}
		}
	}

	render() {
		const { registerProfile: { loading } } = this.props;

		return (
			<ProfileRegisterWizard onSubmit={this.handleSubmit} loading={loading} />
		);
	}
}

ProfileRegisterView.propTypes = {
	register: PropTypes.func.isRequired,
	registerProfile: PropTypes.object,
	showModal: PropTypes.func.isRequired,
	localized: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	registerProfile: state.profile.register,
	localized: localized('Profile')(state)
});
 
export default connect(mapStateToProps, { register, showModal })(ProfileRegisterView);