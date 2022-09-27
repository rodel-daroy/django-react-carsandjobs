import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HeaderStrip from 'components/Layout/HeaderStrip';
import HeaderStripContent from 'components/Layout/HeaderStripContent';
import HeaderStripContentLarge from 'components/Layout/HeaderStripContentLarge';
import MasterDetail from 'components/Layout/MasterDetail';
import LoadingOverlay from 'components/Common/LoadingOverlay';
import AnchorNav from 'components/Navigation/AnchorNav';
import camelCase from 'lodash/camelCase';
import { reduxForm, propTypes } from 'redux-form';
import Sticky from 'react-sticky-el';
import CommandBar from 'components/Layout/CommandBar';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import Localized from 'components/Localization/Localized';
import pick from 'lodash/pick';
import { connect } from 'react-redux';
import { showModal } from 'redux/actions/modals';
import { confirmModal } from 'components/Modals/helpers';
import './UpdateForm.css';

class UpdateForm extends Component {
	componentDidUpdate(prevProps) {
		const { location: { hash } } = this.props;

		if(hash && hash !== prevProps.hash)
			document.querySelector(hash).scrollIntoView();
	}

	handleCancel = () => {
		const { onCancel, showModal } = this.props;

		showModal(confirmModal({
			title: <h3>Confirm</h3>,
			content: 'Are you sure you want to discard your changes?',
			onOk: onCancel
		}));
	}

	renderCommands = () => {
		const { submitText, loading, dirty, commands } = this.props;

		let extraCommands;
		if(commands)
			extraCommands = commands({ dirty, loading });

		if(dirty || extraCommands)
			return (
				<div className="update-form-commands-outer">
					<MasterDetail
						showDetail
						ratio="quarter"
						master={() => null}
						detail={() => (
							<Localized names="Common">
								{({ UpdateLabel, CancelLabel }) => (
									<CommandBar className="update-form-commands" layout="auto" mobileSize="xs sm">
										{dirty && ([
											<PrimaryButton key="update-submit" type="submit" disabled={loading}>
												{submitText || UpdateLabel}
											</PrimaryButton>,
											<PrimaryLink
												key="update-cancel"
												onClick={this.handleCancel} 
												disabled={loading} 
												iconClassName="icon icon-cancel" 
												hasIcon>

												{CancelLabel}
											</PrimaryLink>
										])}

										{extraCommands}
									</CommandBar>
								)}
							</Localized>
						)} />
				</div>
			);
		else
			return null;
	}

	render() {
		const { title, backTo, handleSubmit, loading, forms, localized = {}, readOnly } = this.props;
		
		return (
			<form className="update-form" onSubmit={handleSubmit}>
				<HeaderStrip>
					<HeaderStripContentLarge>
						{backTo && <HeaderStripContent.Back to={backTo} />}

						{title}
					</HeaderStripContentLarge>
				</HeaderStrip>

				<MasterDetail
					className="update-form-md"
					showDetail
					ratio="quarter"
					master={() => (
						<AnchorNav>
							{forms.map((form, i) => (
								<AnchorNav.Link key={i} name={localized[form.shortTitle]} anchor={camelCase(form.formName)} />
							))}
						</AnchorNav>
					)} 
					detail={() => (
						<div className="update-form-forms">
							{forms.map((Form, i) => (
								<Form 
									{...pick(this.props, Object.keys(propTypes))}

									key={i} 
									id={camelCase(Form.formName)}
									className="update-form-section"  
									loading={loading} 
									first
									readOnly={readOnly} />
							))}
						</div>
					)} />

				<Sticky mode="bottom" positionRecheckInterval={200}>
					{this.renderCommands()}
				</Sticky>

				{loading && (
					<div className="update-form-loading">
						<LoadingOverlay />
					</div>
				)}
			</form>
		);
	}
}

UpdateForm.propTypes = {
	...propTypes,

	title: PropTypes.node,
	backTo: PropTypes.any,
	loading: PropTypes.bool,
	forms: PropTypes.array.isRequired,
	onCancel: PropTypes.func.isRequired,
	localized: PropTypes.object,
	submitText: PropTypes.string,
	readOnly: PropTypes.bool,
	commands: PropTypes.func,

	showModal: PropTypes.func.isRequired
};
 
export default reduxForm({
	enableReinitialize: true
})(withLocaleRouter(connect(null, { showModal })(UpdateForm)));