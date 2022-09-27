import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ViewPanel from 'components/Layout/ViewPanel';
import HeaderStrip from 'components/Layout/HeaderStrip';
import HeaderStripContent from 'components/Layout/HeaderStripContent';
import { connect } from 'react-redux';
import { loadApplication } from 'redux/actions/employer';
import ApplicationDetail from './ApplicationDetail';
import EmptyState from 'components/Layout/EmptyState';
import NotFoundView from 'layout/components/NotFoundView';
import ApplicationDetailCommands from './ApplicationDetailCommands';
import ContentMetaTags from 'components/Content/ContentMetaTags';
import Localized from 'components/Localization/Localized';
import './ApplicationDetailFullView.css';

class ApplicationDetailFullView extends Component {
	constructor(props) {
		super(props);

		const { match: { params: { id } }, loadApplication } = props;
		loadApplication({ id });
	}

	componentDidUpdate(prevProps) {
		const { match: { params: { id } }, loadApplication } = this.props;
		const { match: { params: { id: oldId } } } = prevProps;

		if(id !== oldId)
			loadApplication({ id });
	}

	render() {
		const { application: { result, loading, error } } = this.props;

		if(!loading && error)
			return <NotFoundView />;

		return (
			<Localized names="Employer">
				{({ ApplicationTitle }) => (
					<ViewPanel className="application-detail-full-view" scrolling>
						<ContentMetaTags title={ApplicationTitle} />

						<HeaderStrip>
							<HeaderStripContent className="application-detail-full-view-header">
								<h1>Application</h1>
							</HeaderStripContent>
						</HeaderStrip>

						<div className="application-detail-full-view-inner">
							{!loading && result && (
								<ApplicationDetail application={result} />
							)}

							{loading && <EmptyState.Loading />}
						</div>

						{!loading && result && <ApplicationDetailCommands application={result} layout="mobile" />}
					</ViewPanel>
				)}
			</Localized>
		);
	}
}

ApplicationDetailFullView.propTypes = {
	match: PropTypes.object.isRequired,
	loadApplication: PropTypes.func.isRequired,
	application: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	application: state.employer.application
});
 
export default connect(mapStateToProps, { loadApplication })(ApplicationDetailFullView);