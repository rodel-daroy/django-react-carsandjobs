import { apiSagaHandleError } from './helpers';
import * as autoLife from 'services/autolife';
import { LOAD_MAKES, LOAD_MODELS } from 'redux/actions/autolife';
import { all } from 'redux-saga/effects';

const makes = apiSagaHandleError(autoLife.getMakes, LOAD_MAKES);
const models = apiSagaHandleError(autoLife.getModels, LOAD_MODELS);

export default function* () {
	yield all([
		makes,
		models
	]);
}