import { actionCreator } from 'utils/redux';

export const REGISTER = 'profile/REGISTER';
export const LOAD_PROFILE = 'profile/LOAD_PROFILE';
export const UPDATE_PROFILE = 'profile/UPDATE_PROFILE';

export const LOAD_COVER_LETTERS = 'profile/LOAD_COVER_LETTERS';
export const ADD_COVER_LETTER = 'profile/ADD_COVER_LETTER';
export const SET_COVER_LETTER_ACTIVE = 'profile/SET_COVER_LETTER_ACTIVE';
export const UPDATE_COVER_LETTER = 'profile/UPDATE_COVER_LETTER';
export const DELETE_COVER_LETTER = 'profile/DELETE_COVER_LETTER';

export const LOAD_RESUMES = 'profile/LOAD_RESUMES';
export const LOAD_RESUME = 'profile/LOAD_RESUME';
export const POLL_RESUME = 'profile/POLL_RESUME';
export const POLL_RESUME_STOP = 'profile/POLL_RESUME_STOP';
export const ADD_RESUME = 'profile/ADD_RESUME';
export const SET_RESUME_ACTIVE = 'profile/SET_RESUME_ACTIVE';
export const SET_RESUME_SEARCHABLE = 'profile/SET_RESUME_SEARCHABLE';
export const UPDATE_RESUME = 'profile/UPDATE_RESUME';
export const DELETE_RESUME = 'profile/DELETE_RESUME';

export const SAVE_SEARCH = 'profile/SAVE_SEARCH';
export const LOAD_SEARCHES = 'profile/LOAD_SEARCHES';
export const DELETE_SEARCH = 'profile/DELETE_SEARCH';

export const RESET_PASSWORD = 'profile/RESET_PASSWORD';
export const UPDATE_PASSWORD = 'profile/UPDATE_PASSWORD';

export const VERIFY_EMAIL = 'profile/VERIFY_EMAIL';
export const RESEND_VERIFICATION_EMAIL = 'profile/RESEND_VERIFICATION_EMAIL';

export const register = actionCreator(REGISTER);
export const loadProfile = actionCreator(LOAD_PROFILE);
export const updateProfile = actionCreator(UPDATE_PROFILE);

export const loadCoverLetters = actionCreator(LOAD_COVER_LETTERS);
export const addCoverLetter = actionCreator(ADD_COVER_LETTER);
export const setCoverLetterActive = actionCreator(SET_COVER_LETTER_ACTIVE);
export const updateCoverLetter = actionCreator(UPDATE_COVER_LETTER);
export const deleteCoverLetter = actionCreator(DELETE_COVER_LETTER);

export const loadResumes = actionCreator(LOAD_RESUMES);
export const loadResume = actionCreator(LOAD_RESUME);
export const pollResume = actionCreator(POLL_RESUME);
export const pollResumeStop = actionCreator(POLL_RESUME_STOP);
export const addResume = actionCreator(ADD_RESUME);
export const setResumeActive = actionCreator(SET_RESUME_ACTIVE);
export const setResumeSearchable = actionCreator(SET_RESUME_SEARCHABLE);
export const updateResume = actionCreator(UPDATE_RESUME);
export const deleteResume = actionCreator(DELETE_RESUME);

export const saveSearch = actionCreator(SAVE_SEARCH);
export const loadSearches = actionCreator(LOAD_SEARCHES);
export const deleteSearch = actionCreator(DELETE_SEARCH);

export const resetPassword = actionCreator(RESET_PASSWORD);
export const updatePassword = actionCreator(UPDATE_PASSWORD);

export const verifyEmail = actionCreator(VERIFY_EMAIL);
export const resendVerificationEmail = actionCreator(RESEND_VERIFICATION_EMAIL);