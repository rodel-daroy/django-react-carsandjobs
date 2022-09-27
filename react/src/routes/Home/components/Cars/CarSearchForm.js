import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, propTypes, formValueSelector } from 'redux-form';
import { ReduxDropdownField } from 'components/Forms/DropdownField';
import PrimaryButton from 'components/Buttons/PrimaryButton';
import { connect } from 'react-redux';
import { loadMakes, loadModels } from 'redux/actions/autolife';
import { required } from 'utils/validation';
import orderBy from 'lodash/orderBy';
import Localized from 'components/Localization/Localized';
import './CarSearchForm.css';

const currentYear = new Date().getFullYear();
const YEARS = [
	currentYear + 1,
	currentYear,
	currentYear - 1
];

class CarSearchForm extends Component {
	constructor(props) {
		super(props);

		props.loadMakes();
	}

	componentDidUpdate(prevProps) {
		const { currentMake, loadModels, change } = this.props;

		if(currentMake && currentMake !== prevProps.currentMake) {
			loadModels({ make: currentMake });

			change('model', null);
		}
	}

	render() {
		const { handleSubmit, makes, models, currentMake } = this.props;

		let makeOptions = [];
		if(!makes.loading && makes.result)
			makeOptions = orderBy(makes.result, ['name']).map(({ name }) => ({
				label: name,
				value: name
			}));

		let modelOptions = [];
		if(!models.loading && models.result)
			modelOptions = orderBy(models.result, ['name']).map(({ name }) => ({
				label: name.toUpperCase(),
				value: name
			}));
		
		return (
			<Localized names={['Common', 'Cars']}>
				{({
					YearLabel,
					MakeLabel,
					ModelLabel,
					SearchLabel
				}) => (
					<form 
						className="car-search-form" 
						noValidate 
						onSubmit={handleSubmit}>
							
						<Field
							name="year"
							label={YearLabel}
							component={ReduxDropdownField}
							options={YEARS.map(year => ({
								label: year,
								value: year
							}))}
							searchable={false}
							validate={[required]} />

						<Field
							name="make"
							label={MakeLabel}
							component={ReduxDropdownField}
							options={makeOptions}
							validate={[required]}
							disabled={makes.loading} />

						<Field
							name="model"
							label={ModelLabel}
							component={ReduxDropdownField}
							options={modelOptions}
							validate={[required]}
							disabled={models.loading || !currentMake} />

						<div className="car-search-form-submit">
							<PrimaryButton as="button" type="submit">
								{SearchLabel}
							</PrimaryButton>
						</div>
					</form>
				)}
			</Localized>
		);
	}
}

CarSearchForm.propTypes = {
	...propTypes,

	loadMakes: PropTypes.func.isRequired,
	loadModels: PropTypes.func.isRequired,
	makes: PropTypes.object.isRequired,
	models: PropTypes.object.isRequired,
	currentMake: PropTypes.string
};

const mapStateToProps = (state, { form }) => ({
	makes: state.autoLife.makes,
	models: state.autoLife.models,

	currentMake: formValueSelector(form)(state, 'make')
});
 
export default reduxForm({
	form: 'carSearchForm'
})(connect(mapStateToProps, { 
	loadMakes, 
	loadModels 
})(CarSearchForm));