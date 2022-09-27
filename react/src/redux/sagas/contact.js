import { apiSagaHandleError } from './helpers';
import service from 'services';
import { SUBMIT_CONTACT_FORM } from '../actions/contact';
import { all } from 'redux-saga/effects';

const submitForm = apiSagaHandleError(service.submitContactForm, SUBMIT_CONTACT_FORM, { alwaysFetch: true });

export default function* () {
	yield all([
		submitForm
	]);
}