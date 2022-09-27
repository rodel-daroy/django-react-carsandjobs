import { actionCreator } from 'utils/redux';

export const SIGN_IN = 'user/SIGN_IN';

export const SIGN_IN_JOBSEEKER = 'user/SIGN_IN_JOBSEEKER';
export const SIGN_IN_DEALER = 'user/SIGN_IN_DEALER';
export const SIGN_IN_TADA = 'user/SIGN_IN_TADA';

export const SIGN_OUT = 'user/SIGN_OUT';

export const INVALIDATE_TOKEN = 'user/INVALIDATE_TOKEN';
export const REFRESH_TOKEN = 'user/REFRESH_TOKEN';

export const signInJobseeker = actionCreator(SIGN_IN_JOBSEEKER);
export const signInDealer = actionCreator(SIGN_IN_DEALER);
export const signInTada = actionCreator(SIGN_IN_TADA);

export const signOut = () => ({ type: SIGN_OUT });

export const invalidateToken = actionCreator(INVALIDATE_TOKEN);
export const refreshToken = actionCreator(REFRESH_TOKEN);