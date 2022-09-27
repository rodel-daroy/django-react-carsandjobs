import { SUBMIT_CONTACT_FORM } from '../actions/contact';
import { apiReducers } from 'utils/redux';

const submitForm = apiReducers(SUBMIT_CONTACT_FORM);

export default submitForm;