import { apiReducers } from 'utils/redux';
import { AUTOCOMPLETE_LOCATION } from 'redux/actions/geolocation';
import { combineReducers } from 'redux';

const autoCompleteLocation = apiReducers(AUTOCOMPLETE_LOCATION);

export default combineReducers({
	autoCompleteLocation
});