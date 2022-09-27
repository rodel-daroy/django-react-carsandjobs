import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContactUsForm from './ContactUsForm';
import HeaderStrip from 'components/Layout/HeaderStrip';
import HeaderStripContentLarge from 'components/Layout/HeaderStripContentLarge';
import { connect } from 'react-redux';
import { submitContactForm } from 'redux/actions/contact';
import { showModal } from 'redux/actions/modals';
import CommandBar from 'components/Layout/CommandBar';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import { localized } from 'redux/selectors';
import LocalizedNode from 'components/Localization/LocalizedNode';
import { parseMarkdown } from 'utils/format';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import './ContactUsView.css';

class ContactUsView extends Component {
	componentDidUpdate(prevProps) {
		const { contact: { loading, error }, showModal } = this.props;

		if(!loading && !error && prevProps.contact.loading) {
			showModal({
				title: <LocalizedNode as="h1" names="Common" groupKey="ContactUsThanks" />,
				content: ({ close }) => (
					<div>
						<div dangerouslySetInnerHTML={{ __html: parseMarkdown(this.props.localized.ContactUsDialog) }}></div>

						<CommandBar>
							<PrimaryButton onClick={close}>
								{this.props.localized.OkLabel}
							</PrimaryButton>
						</CommandBar>
					</div>
				),
				redirectTo: '/'
			});
		}
	}

	handleSubmit = values => {
		this.props.submitContactForm(values);
	}

	handleCancel = () => {
		const { history } = this.props;
		history.push('/');
	}

	render() {
		const { contact: { loading } } = this.props;

		return (
			<div className="contact-us-view">
				<HeaderStrip>
					<HeaderStripContentLarge>
						<h1>{this.props.localized.ContactUsTitle}</h1>
					</HeaderStripContentLarge>
				</HeaderStrip>

				<div className="contact-us-view-form">
					<ContactUsForm 
						onSubmit={this.handleSubmit} 
						onCancel={this.handleCancel}
						loading={loading} />
				</div>
			</div>
		);
	}
}

ContactUsView.propTypes = {
	history: PropTypes.object.isRequired,
	contact: PropTypes.object.isRequired,
	submitContactForm: PropTypes.func.isRequired,
	showModal: PropTypes.func.isRequired,
	localized: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	contact: state.contact,
	localized: localized('Common')(state)
});
 
export default withLocaleRouter(connect(mapStateToProps, { submitContactForm, showModal })(ContactUsView));