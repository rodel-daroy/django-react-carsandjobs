import { actionCreator } from 'utils/redux';

export const SET_LOCALE = 'localization/SET_LOCALE';

export const GET_LOCALIZED_STRINGS = 'localization/GET_LOCALIZED_STRINGS';

export const LOAD_NAVIGATION = 'localization/LOAD_NAVIGATION';

export const setLocale = actionCreator(SET_LOCALE);

export const getLocalizedStrings = actionCreator(GET_LOCALIZED_STRINGS);

export const loadNavigation = actionCreator(LOAD_NAVIGATION);