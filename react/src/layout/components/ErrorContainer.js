import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { clearError } from 'redux/actions/common';
import { showModal } from 'redux/actions/modals';
import withLocaleRouter from 'components/Localization/withLocaleRouter';
import { mergeUrlSearch } from 'utils/url';
import { localized } from 'redux/selectors';
import LocalizedNode from 'components/Localization/LocalizedNode';
import { parseMarkdown } from 'utils/format';
import { signOut } from 'redux/actions/user';
import ApiError from 'services/ApiError';

class ErrorContainer extends Component {
	getErrorMessage(error) {
		const { 
			localized: { 
				BadRequestMessage, 
				UnauthorizedMessage, 
				GenericErrorMessage, 
				TokenExpiredMessage, 
				InsufficientCreditMessage,
				ForbiddenMessage 
			}
		} = this.props;

		if(error instanceof ApiError) {
			switch(error.status) {
				// bad request
				case 400:
					return parseMarkdown(BadRequestMessage);

				// unauthorized
				case 401: {
					if(error.signedIn)
						return parseMarkdown(TokenExpiredMessage);
					else
						return parseMarkdown(UnauthorizedMessage);
				}

				// payment required
				case 402:
					return parseMarkdown(InsufficientCreditMessage);

				// forbidden
				case 403:
					return parseMarkdown(ForbiddenMessage);
					
				// not found
				case 404:
					return null;
				
				default:
					return parseMarkdown(GenericErrorMessage);
			}
		}
		else
			return parseMarkdown(error.message);
	}

	isUnauthorized(error) {
		return error.status === 401;
	}

	componentDidUpdate(prevProps) {
		const { error, showModal, clearError, location } = this.props;

		if(error && error !== prevProps.error) {
			const message = this.getErrorMessage(error);

			if(message) {
				let redirectTo;
				if(this.isUnauthorized(error))
					redirectTo = location.pathname 
						+ mergeUrlSearch(location.search, { 
							signin: 1, 
							redirect: location.pathname + location.search 
						});
				else
					redirectTo = location;

				showModal({
					title: <LocalizedNode as="h1" names="Common" groupKey="ErrorTitle" />,
					content: () => (
						<div dangerouslySetInnerHTML={{ __html: message }}></div>
					),
					redirectTo,
					onClose: clearError
				});
			}
		}
	}

	render() { 
		return null;
	}
}

ErrorContainer.propTypes = {
	error: PropTypes.object,
	clearError: PropTypes.func.isRequired,
	location: PropTypes.object.isRequired,
	showModal: PropTypes.func.isRequired,
	localized: PropTypes.object.isRequired,
	signOut: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	error: state.common.error,
	localized: localized('Common')(state)
});
 
export default withLocaleRouter(connect(mapStateToProps, { clearError, showModal, signOut })(ErrorContainer));