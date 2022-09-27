import { actionCreator } from 'utils/redux';

export const LOAD_MAKES = 'autolife/LOAD_MAKES';
export const LOAD_MODELS = 'autolife/LOAD_MODELS';

export const loadMakes = actionCreator(LOAD_MAKES);
export const loadModels = actionCreator(LOAD_MODELS);