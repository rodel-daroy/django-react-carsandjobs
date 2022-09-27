import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContentMetaTags from 'components/Content/ContentMetaTags';
import HeaderStrip from 'components/Layout/HeaderStrip';
import HeaderStripContentLarge from 'components/Layout/HeaderStripContentLarge';
import HeaderStripContent from 'components/Layout/HeaderStripContent';
import moment from 'moment';
import { connect } from 'react-redux';
import { loadJobStats } from 'redux/actions/admin';
import EmptyState from 'components/Layout/EmptyState';
import ContentBlock from 'components/Layout/ContentBlock';
import requireRole from 'components/Decorators/requireRole';
import { ADMIN_ROLE, language } from 'redux/selectors';
import Localized from 'components/Localization/Localized';
import { getLocale } from 'utils/format';
import './JobStatsView.css';

class JobStatsView extends Component {
	constructor(props) {
		super(props);

		props.loadJobStats();
	}

	renderMonth = (i, month, data, years) => {
		const { language } = this.props;

		return (
			<tr key={month}>
				<td>{moment().locale(getLocale(language)).localeData().months()[i]}</td>
				
				{years.map(year => (
					<td key={year}>
						{data[year]}
					</td>
				))}

				<td className="job-stats-view-table-total">{data.Total}</td>
			</tr>
		);
	}

	renderTable(result) {
		if(result) {
			const localeData = moment().locale('en').localeData();
			const months = localeData.months();

			const years = 
				Object.keys(result[months[0]])
					.filter(key => key !== 'Total')
					.map(year => parseInt(year, 10))
					.sort();

			//const totals = years.map(year => months.reduce((acc, cur) => acc + result[cur][year], 0));
			const totals = years.map(year => result.Total[year]);
			const totalOfTotals = months.reduce((acc, cur) => acc + result[cur].Total, 0);

			return (
				<Localized names={['Common', 'Employer', 'Admin']}>
					{({
						MonthLabel,
						TotalLabel
					}) => (
						<ContentBlock>
							<table className="job-stats-view-table">
								<thead>
									<tr>
										<th>{MonthLabel}</th>
										{years.map(year => (
											<th key={year}>
												{year}
											</th>
										))}
										<th>{TotalLabel}</th>
									</tr>
								</thead>
								<tbody>
									{months.map((month, i) => this.renderMonth(i, month, result[month], years))}

									<tr className="job-stats-view-table-total">
										<td>{TotalLabel}</td>

										{totals.map((total, i) => (
											<td key={i}>
												{total}
											</td>
										))}

										<td>
											{totalOfTotals}
										</td>
									</tr>
								</tbody>
							</table>
						</ContentBlock>
					)}
				</Localized>
			);
		}
		else
			return null;
	}

	render() {
		const { jobStats: { loading, result } } = this.props;

		return (
			<Localized names={['Common', 'Employer', 'Admin']}>
				{({
					JobStatsTitle
				}) => (
					<div className="job-stats-view">
						<ContentMetaTags title={JobStatsTitle} />
						
						<HeaderStrip>
							<HeaderStripContentLarge>
								<HeaderStripContent.Back to="/admin" />

								<h1>{JobStatsTitle}</h1>
							</HeaderStripContentLarge>
						</HeaderStrip>

						{this.renderTable(result)}

						{loading && <EmptyState.Loading />}
					</div>
				)}
			</Localized>
		);
	}
}

JobStatsView.propTypes = {
	jobStats: PropTypes.object.isRequired,
	loadJobStats: PropTypes.func.isRequired,
	language: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
	jobStats: state.admin.jobStats,
	language: language(state)
});
 
export default requireRole(ADMIN_ROLE)(connect(mapStateToProps, { loadJobStats })(JobStatsView));