import { apiSagaHandleError } from './helpers';
import * as here from 'services/here';
import { AUTOCOMPLETE_LOCATION } from 'redux/actions/geolocation';
import { all } from 'redux-saga/effects';

const autoCompleteLocation = apiSagaHandleError(here.autoCompleteLocation, AUTOCOMPLETE_LOCATION, { alwaysFetch: true });

export default function* () {
	yield all([
		autoCompleteLocation
	]);
}