import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Wizard from 'components/Forms/Wizard';
import Forms from './Forms';
import validate, { getPreview } from './validation';
import Localized from 'components/Localization/Localized';
import ContentMetaTags from 'components/Content/ContentMetaTags';
import errorBoundary from 'components/Decorators/errorBoundary';
import requireRole from 'components/Decorators/requireRole';
import { connect } from 'react-redux';
import { authDealers, language, DEALER_ROLES } from 'redux/selectors';
import { normalizeJobPosting } from 'redux/helpers';
import { getPrevLink } from 'utils/router';
import { autofill } from 'redux-form';
import withLocaleRouter from 'components/Localization/withLocaleRouter';

const FORM = 'jobPosting';

class JobPostingWizardView extends Component {
	constructor(props) {
		super(props);

		const { location, history } = props;
		const template = location.state ? location.state.template : null;

		this.state = {
			initialValues: location.state ? location.state.values : null,
			backTo: getPrevLink(location, '/employer/job-postings'),
			template
		};

		history.replace({
			pathname: location.pathname,
			state: {
				template
			}
		});
	}

	prepopulate(template) {
		const { autofill } = this.props;

		for(const [key, value] of Object.entries(template))
			autofill(FORM, key, value);
	}

	componentDidMount() {
		const { template } = this.state;

		if(template)
			this.prepopulate(template);
	}

	handleSubmit = async values => {
		const { history, dealers, location } = this.props;

		const normalized = await normalizeJobPosting(values);
		const preview = getPreview(normalized, dealers);

		const prev = {
			...location,
			state: {
				values
			}
		};

		history.push({
			pathname: '/jobs/preview',
			state: {
				preview,
				posting: normalized,
				prev
			}
		});
	}

	render() {
		const { initialValues, backTo } = this.state;
		const { language } = this.props;

		let actualInitialValues = initialValues;
		if(!actualInitialValues)
			actualInitialValues = { language };

		return (
			<Localized names={['Common', 'Employer']}>
				{localized => {
					const { CreateJobPostingTitle, PreviewLabel } = localized;

					return (
						<React.Fragment>
							<ContentMetaTags title={CreateJobPostingTitle} />

							<Wizard
								title={<h1>{CreateJobPostingTitle}</h1>}
								forms={Forms}
								form={FORM}
								onSubmit={this.handleSubmit}
								backTo={backTo}
								submitText={PreviewLabel}
								initialValues={actualInitialValues}
								index={initialValues ? 3 : null}
								validate={validate}
								localized={localized} />
						</React.Fragment>
					);
				}}
			</Localized>
		);
	}
}

JobPostingWizardView.propTypes = {
	history: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired,
	language: PropTypes.string.isRequired,
	dealers: PropTypes.array.isRequired,
	autofill: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	language: language(state),
	dealers: authDealers(state)
});
 
export default errorBoundary(requireRole(DEALER_ROLES)(withLocaleRouter(connect(mapStateToProps, { autofill })(JobPostingWizardView))));