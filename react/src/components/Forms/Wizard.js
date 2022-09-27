import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { integer } from 'airbnb-prop-types';
import CommandBar from 'components/Layout/CommandBar';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import PrimaryLink from 'components/Buttons/PrimaryLink';
import { connect } from 'react-redux';
import { reduxForm, initialize, touch, destroy } from 'redux-form';
import HeaderStrip from 'components/Layout/HeaderStrip';
import HeaderStripContent from 'components/Layout/HeaderStripContent';
import HeaderStripContentLarge from 'components/Layout/HeaderStripContentLarge';
import MasterDetail from 'components/Layout/MasterDetail';
import LoadingOverlay from 'components/Common/LoadingOverlay';
import SectionIndicator from 'components/Navigation/SectionIndicator';
import Sticky from 'react-sticky-el';
import { localized } from 'redux/selectors';
import './Wizard.css';

class Wizard extends Component {
	constructor(props) {
		super(props);

		this._forms = [];

		this.state = {
			index: props.index || 0
		};
	}

	static getDerivedStateFromProps(props, state) {
		const { forms } = props;

		let newState = {};

		if(state.previousForms !== forms) {
			const reduxForms = forms.map(form => {
				const result = reduxForm({
					destroyOnUnmount: false
				})(form);
				result.shortTitle = form.shortTitle;
			
				return result;
			});

			newState = {
				...newState, 

				reduxForms,
				previousForms: forms
			};
		}

		return newState;
	}

	componentDidUpdate(prevProps, prevState) {
		const { index } = this.props;

		if(index != null && index !== prevProps.index && this.state.index !== index)
			this.setState({ index });

		if(this.state.index !== prevState.index)
			window.scrollTo(0, 0);
	}

	resetForms() {
		const { initialize, initialValues, form } = this.props;

		initialize(form, initialValues);
	}

	componentDidMount() {
		this.resetForms();
	}

	componentWillUnmount() {
		const { form, destroy } = this.props;
		destroy(form);
	}

	handlePrevious = () => {
		this.setState({ 
			index: this.state.index - 1
		});
	}

	handleNext = () => {
		const { index, reduxForms } = this.state;
		const { touch, form } = this.props;

		const currentForm = this._forms[index];

		touch(form, ...currentForm.fieldList);
		
		if(currentForm.valid) {
			if(index < reduxForms.length - 1)
				this.setState({ index: index + 1 });
			else
				this.doSubmit();
		} 
	}

	doSubmit() {
		const { index } = this.state;
		const { onSubmit } = this.props;

		const currentForm = this._forms[index];

		onSubmit(currentForm.values);
	}

	handleChangeSection = index => {
		this.setState({ index });
	}

	renderCommands = () => {
		const { index, reduxForms } = this.state;
		const { loading, submitText, localizedCommon } = this.props;

		const nextText = (index < reduxForms.length - 1) ? localizedCommon.NextLabel : (submitText || localizedCommon.SubmitLabel);

		return (
			<CommandBar className="wizard-commands" layout="auto">
				{index > 0 && (
					<PrimaryLink onClick={this.handlePrevious} disabled={loading} iconClassName="icon icon-angle-left" hasIcon>
						{localizedCommon.PreviousLabel}
					</PrimaryLink>
				)}
				<PrimaryButton onClick={this.handleNext} disabled={loading}>
					{nextText} <span className="icon icon-angle-right"></span>
				</PrimaryButton>
			</CommandBar>
		);
	}

	renderForms = () => {
		const { index, reduxForms } = this.state;
		const { loading, form, validate } = this.props;

		const Form = reduxForms[index];

		return (
			<div className="wizard-forms">
				<Form 
					ref={ref => this._forms[index] = ref}
					form={form}
					onSubmit={this.handleSubmit}
					loading={loading}
					validate={validate}
					first />

				{this.renderCommands()}
			</div>
		);
	}

	renderSections = () => {
		const { localized = {} } = this.props;
		const { index, reduxForms } = this.state;

		const sections = reduxForms.map((form, i) => ({
			name: localized[form.shortTitle],
			complete: index > i,
			disabled: index < i
		}));

		return (
			<Sticky>
				<div className="wizard-sections">
					<SectionIndicator
						index={index}
						onChange={this.handleChangeSection}
						sections={sections} />
				</div>
			</Sticky>
		);
	}

	render() {
		const { loading, title, backTo } = this.props;
		const { index } = this.state;

		let back;
		if(index === 0)
			back = backTo && <HeaderStripContent.Back to={backTo} />;
		else
			back = <HeaderStripContent.Back as="button" onClick={this.handlePrevious} />;

		return (
			<div className="wizard">
				<HeaderStrip>
					<HeaderStripContentLarge>
						{back}
						{title}
					</HeaderStripContentLarge>
				</HeaderStrip>

				<MasterDetail 
					className="wizard-md"
					showDetail
					ratio="quarter"
					master={this.renderSections} 
					detail={this.renderForms} />

				{loading && (
					<div className="wizard-loading">
						<LoadingOverlay />
					</div>
				)}
			</div>
		);
	}
}

Wizard.propTypes = {
	initialValues: PropTypes.object,
	onSubmit: PropTypes.func.isRequired,
	loading: PropTypes.bool,
	form: PropTypes.string.isRequired,
	forms: PropTypes.array.isRequired,
	title: PropTypes.node.isRequired,
	backTo: PropTypes.any,
	submitText: PropTypes.string,
	index: integer(),
	validate: PropTypes.func,
	localized: PropTypes.object,

	initialize: PropTypes.func.isRequired,
	touch: PropTypes.func.isRequired,
	destroy: PropTypes.func.isRequired,
	localizedCommon: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	localizedCommon: localized('Common')(state)
});
 
export default connect(mapStateToProps, { initialize, touch, destroy })(Wizard);