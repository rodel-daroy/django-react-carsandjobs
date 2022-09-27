import { actionCreator } from 'utils/redux';

export const SET_SCROLLING_ENABLED = 'layout/SET_SCROLLING_ENABLED';
export const SET_GLOBAL_OVERLAY = 'layout/SET_GLOBAL_OVERLAY';

export const setScrollingEnabled = actionCreator(SET_SCROLLING_ENABLED);
export const setGlobalOverlay = actionCreator(SET_GLOBAL_OVERLAY);