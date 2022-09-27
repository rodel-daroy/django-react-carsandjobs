import { combineReducers } from 'redux';
import { apiReducers } from 'utils/redux';
import { LOAD_MAKES, LOAD_MODELS } from 'redux/actions/autolife';

const makes = apiReducers(LOAD_MAKES);
const models = apiReducers(LOAD_MODELS);

export default combineReducers({
	makes,
	models
});