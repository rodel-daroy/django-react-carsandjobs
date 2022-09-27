import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PromoBanner from 'components/Content/PromoBanner';
import moment from 'moment';

class FreeDayPromoBanner extends Component {
	constructor(props) {
		super(props);

		this.state = {
			hour: this.hour
		};
	}

	get hour() {
		const { utcOffset } = this.props;
		const time = moment().utcOffset(utcOffset);
		return time.hour();
	}

	componentDidMount() {
		this._interval = setInterval(() => this.setState({ hour: this.hour }), 60 * 1000);
	}

	componentWillUnmount() {
		clearInterval(this._interval);
	}

	render() {
		const { promoCodeFormat, date, utcOffset } = this.props;
		const { hour } = this.state;

		const currentDate = moment().utcOffset(utcOffset);
		if(moment(date).isSame(currentDate, 'day')) {
			const promoCode = (promoCodeFormat || '').replace('[hour]', hour);

			return (
				<PromoBanner>
					Promo code: {promoCode}
				</PromoBanner>
			);
		}

		return null;
	}
}

FreeDayPromoBanner.propTypes = {
	date: PropTypes.any.isRequired,
	utcOffset: PropTypes.any,
	promoCodeFormat: PropTypes.string.isRequired
};

FreeDayPromoBanner.defaultProps = {
	utcOffset: '-04:00'
};
 
export default FreeDayPromoBanner;