import React, { Component } from 'react';
import Field from './Field';
import DatePicker from 'react-datepicker';
import { makeReduxField } from './common';
import omit from 'lodash/omit';
import moment from 'moment';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import './DateField.css';

class DateFieldInner extends Component {
	state = {
		value: null
	}

	static getDerivedStateFromProps(props) {
		const { value } = props;

		return {
			value: value ? moment(value) : null
		};
	}

	handleChange = value => {
		const { onChange } = this.props;

		onChange(value ? value.toDate() : null);
	}

	handleBlur = () => {
		const { onBlur } = this.props;

		if(onBlur)
			onBlur();
	}

	render() { 
		/* eslint-disable-next-line */
		const { value, locale, setLocale, history, match, location, ...otherProps } = this.props;
		const { value: actualValue } = this.state;

		return (
			<DatePicker 
				{...otherProps} 
				
				locale={`${locale.language}-CA`}
				selected={actualValue}
				className="form-control"
				onChange={this.handleChange}
				onBlur={this.handleBlur}
				autoComplete="off" />
		);
	}
}

DateFieldInner.propTypes = {
	// eslint-disable-next-line react/forbid-foreign-prop-types
	...omit(Field.propTypes || {}, ['inputComponent'])
};

const DateFieldInnerLocale = withLocaleRouter(DateFieldInner);

const inputComponent = props => <DateFieldInnerLocale {...props} />;

const DateField = ({ className, ...otherProps }) => (
	<Field {...otherProps} className={`custom-date-field ${className || ''}`} inputComponent={inputComponent} />
);

DateField.propTypes = {
	// eslint-disable-next-line react/forbid-foreign-prop-types
	...DateFieldInner.propTypes
};

const ReduxDateField = makeReduxField(DateField);
 
export default DateField;
export { ReduxDateField };