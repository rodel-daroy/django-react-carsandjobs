import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadProfile, updateProfile } from 'redux/actions/profile';
import { showModal } from 'redux/actions/modals';
import UpdateForm from 'components/Forms/UpdateForm';
import { UpdateForms } from './Forms/index';
import Localized from 'components/Localization/Localized';
import LocalizedNode from 'components/Localization/LocalizedNode';
import ContentMetaTags from 'components/Content/ContentMetaTags';
import errorBoundary from 'components/Decorators/errorBoundary';
import { passiveModal } from 'components/Modals/helpers';
import withLocaleRouter from 'components/Localization/withLocaleRouter';

class ProfileUpdateView extends Component {
	constructor(props) {
		super(props);

		props.loadProfile();
	}

	state = {
		submitting: false
	}

	componentDidUpdate(prevProps) {
		const { profile, showModal } = this.props;
		const { submitting } = this.state;

		if(submitting && profile !== prevProps.profile && prevProps.profile.loading && !profile.loading && profile.result)
			showModal(passiveModal({
				title: <LocalizedNode names="Profile" groupKey="ProfileUpdatedTitle" />,
				redirectTo: '/profile'
			}));
	}

	handleSubmit = values => {
		this.props.updateProfile(values);

		this.setState({
			submitting: true
		});
	}

	handleCancel = () => {
		this._form.reset();
	}

	render() { 
		const { profile: { result, loading } } = this.props;

		return (
			<Localized names="Profile">
				{localized => {
					const { ProfileDetailsTitle } = localized;

					return (
						<React.Fragment>
							<ContentMetaTags title={ProfileDetailsTitle} />

							<UpdateForm 
								ref={ref => this._form = ref}
								title={<h1>{ProfileDetailsTitle}</h1>}
								form="profileUpdate"
								forms={UpdateForms}
								initialValues={result} 
								onSubmit={this.handleSubmit}
								onCancel={this.handleCancel}
								loading={loading}
								backTo="/profile"
								localized={localized} />
						</React.Fragment>
					);
				}}
			</Localized>
		);
	}
}

ProfileUpdateView.propTypes = {
	profile: PropTypes.object,
	loadProfile: PropTypes.func.isRequired, 
	updateProfile: PropTypes.func.isRequired,
	location: PropTypes.object.isRequired,
	showModal: PropTypes.func.isRequired
};

const mapStateToDispatch = state => ({
	profile: state.profile.profile
});
 
export default errorBoundary(withLocaleRouter(connect(mapStateToDispatch, { loadProfile, updateProfile, showModal })(ProfileUpdateView)));