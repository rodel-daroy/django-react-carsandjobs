import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContentMetaTags from 'components/Content/ContentMetaTags';
import HeaderStrip from 'components/Layout/HeaderStrip';
import HeaderStripContentLarge from 'components/Layout/HeaderStripContentLarge';
import HeaderStripContent from 'components/Layout/HeaderStripContent';
import moment from 'moment';
import DropdownField from 'components/Forms/DropdownField';
import { getProvinceOptions } from 'components/Forms/ProvinceOptions';
import RadioGroupField from 'components/Forms/RadioGroupField';
import ContentBlock from 'components/Layout/ContentBlock';
//import PrimaryButton from 'components/Buttons/PrimaryButton';
import { connect } from 'react-redux';
import { loadApplicationStats } from 'redux/actions/admin';
import EmptyState from 'components/Layout/EmptyState';
import requireRole from 'components/Decorators/requireRole';
import { ADMIN_ROLE, language } from 'redux/selectors';
import Localized from 'components/Localization/Localized';
import { getLocale } from 'utils/format';
import './ApplicationStatsView.css';

const YEARS = [moment().year() - 1, moment().year()];
const MONTHS = moment().locale('en').localeData().months();

const CURRENT_YEAR = moment().year();

class ApplicationStatsView extends Component {
	constructor(props) {
		super(props);

		this.state = {
			province: 'ON',
			year: CURRENT_YEAR
		};

		this.props.loadApplicationStats(this.state);
	}

	handleProvinceChange = province => {
		this.setState({ province });
	}

	handleYearChange = year => {
		this.setState({ year });
	}

	componentDidUpdate(prevProps, prevState) {
		const { year, province } = this.state;
		const { loadApplicationStats } = this.props;

		if(prevState.province !== province || prevState.year !== year)
			loadApplicationStats({
				province,
				year
			}, { cancelPrevious: true });
	}

	renderResults() {
		const { stats: { result }, language } = this.props;
		const { year } = this.state;

		return (
			<Localized names={['Common', 'Admin']}>
				{({ 
					MonthLabel, 
					JobsPostedLabel, 
					AccountsCreatedLabel, 
					TotalNewResumesLabel,
					TotalApplicationsLabel
				}) => (
					<table className="application-stats-view-table">
						<thead>
							<tr>
								<th>{MonthLabel}</th>
								<th>{JobsPostedLabel}</th>
								<th>{AccountsCreatedLabel}</th>
								<th>{TotalNewResumesLabel}</th>
								<th>{TotalApplicationsLabel}</th>
							</tr>
						</thead>
						<tbody>
							{MONTHS.map((month, i) => {
								const data = result[year][month];

								return (
									<tr key={month}>
										<td>{moment().locale(getLocale(language)).localeData().months()[i]}</td>
										<td>{data['Jobs Posted']}</td>
										<td>{data['Accounts Created']}</td>
										<td>{data['New Resumes']}</td>
										<td>{data['Applications']}</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				)}
			</Localized>
		);
	}

	render() {
		const { province, year } = this.state;
		const { stats: { loading, result } } = this.props;

		return (
			<Localized names={['Common', 'Admin']}>
				{({
					ApplicationStatsTitle,
					AllProvincesLabel,
					FilterByLabel,
					YearLabel
				}) => (
					<div className="application-stats-view">
						<ContentMetaTags title={ApplicationStatsTitle} />
						
						<HeaderStrip>
							<HeaderStripContentLarge>
								<HeaderStripContent.Back to="/admin" />

								<h1>{ApplicationStatsTitle}</h1>
							</HeaderStripContentLarge>
						</HeaderStrip>

						<ContentBlock className="application-stats-view-filter">
							<DropdownField
								label={FilterByLabel}
								options={[
									{
										label: AllProvincesLabel,
										value: null
									},
						
									...getProvinceOptions()
								]}
								placeholder={AllProvincesLabel}
								value={province}
								onChange={this.handleProvinceChange} />

							<RadioGroupField
								label={YearLabel}
								options={YEARS.map(year => ({
									label: year,
									value: year
								}))}
								onChange={this.handleYearChange}
								value={year} />

							{/* <PrimaryButton>
								Export
							</PrimaryButton> */}
						</ContentBlock>

						<ContentBlock>
							{!loading && result && result[year] && this.renderResults()}

							{loading && <EmptyState.Loading />}
						</ContentBlock>
					</div>
				)}
			</Localized>
		);
	}
}

ApplicationStatsView.propTypes = {
	loadApplicationStats: PropTypes.func.isRequired,
	stats: PropTypes.object.isRequired,
	language: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
	stats: state.admin.applicationStats,
	language: language(state)
});
 
export default requireRole(ADMIN_ROLE)(connect(mapStateToProps, { loadApplicationStats })(ApplicationStatsView));