import { actionCreator } from 'utils/redux';

export const LOAD_PROGRAMMES = 'education/LOAD_PROGRAMMES';
export const LOAD_MORE_PROGRAMMES = 'education/LOAD_MORE_PROGRAMMES';

export const LOAD_PLACEHOLDERS = 'education/LOAD_PLACEHOLDERS';

export const loadProgrammes = actionCreator(LOAD_PROGRAMMES);
export const loadMoreProgrammes = actionCreator(LOAD_MORE_PROGRAMMES);

export const loadPlaceholders = actionCreator(LOAD_PLACEHOLDERS);