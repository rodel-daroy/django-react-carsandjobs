import { apiReducers, successType } from 'utils/redux';
import { combineReducers } from 'redux';
import {
	REGISTER,
	LOAD_PROFILE,
	UPDATE_PROFILE,
	LOAD_COVER_LETTERS,
	ADD_COVER_LETTER,
	SET_COVER_LETTER_ACTIVE,
	UPDATE_COVER_LETTER,
	DELETE_COVER_LETTER,
	LOAD_RESUMES,
	LOAD_RESUME,
	ADD_RESUME,
	SET_RESUME_ACTIVE,
	SET_RESUME_SEARCHABLE,
	UPDATE_RESUME,
	DELETE_RESUME,
	POLL_RESUME,
	LOAD_SEARCHES,
	DELETE_SEARCH,
	SAVE_SEARCH,
	RESET_PASSWORD,
	UPDATE_PASSWORD,
	VERIFY_EMAIL,
	RESEND_VERIFICATION_EMAIL
} from 'redux/actions/profile';

const register = apiReducers(REGISTER);

const addRecord = (state, action) => {
	const result = state.result;
	const record = action.result;

	if(result && record)
		return {
			...state,

			result: [...result, record]
		};
	else
		return state;
};

const updateRecords = (state, action) => {
	const result = state.result;
	const record = action.result;

	if(result && record) {
		const index = result.findIndex(c => c.id === record.id);
		const newResult = [...result];
		newResult[index] = record;
		
		return {
			...state,

			result: newResult
		};
	}
	else
		return state;
};

const deleteRecord = (state, action) => {
	const result = state.result;
	const payload = action.payload;

	if(result && payload) {
		const index = result.findIndex(c => c.id === payload.id);
		const newResult = [...result];
		newResult.splice(index, 1);

		return {
			...state,

			result: newResult
		};
	}
	else
		return state;
};

const profile = apiReducers([LOAD_PROFILE, UPDATE_PROFILE]);

const loadCoverLetters = apiReducers(LOAD_COVER_LETTERS, {
	[successType(ADD_COVER_LETTER)]: addRecord,
	[successType(SET_COVER_LETTER_ACTIVE)]: updateRecords,
	[successType(UPDATE_COVER_LETTER)]: updateRecords,
	[successType(DELETE_COVER_LETTER)]: deleteRecord
});

const coverLetters = combineReducers({
	list: loadCoverLetters,
	add: apiReducers(ADD_COVER_LETTER),
	setActive: apiReducers(SET_COVER_LETTER_ACTIVE),
	update: apiReducers(UPDATE_COVER_LETTER),
	delete: apiReducers(DELETE_COVER_LETTER)
});

const loadResumes = apiReducers(LOAD_RESUMES, {
	[successType(LOAD_RESUME)]: updateRecords,
	[successType(ADD_RESUME)]: addRecord,
	[successType(SET_RESUME_ACTIVE)]: updateRecords,
	[successType(SET_RESUME_SEARCHABLE)]: updateRecords,
	[successType(UPDATE_RESUME)]: updateRecords,
	[successType(DELETE_RESUME)]: deleteRecord
});

const resumes = combineReducers({
	list: loadResumes,
	add: apiReducers(ADD_RESUME),
	setActive: apiReducers(SET_RESUME_ACTIVE),
	setSearchable: apiReducers(SET_RESUME_SEARCHABLE),
	update: apiReducers(UPDATE_RESUME),
	delete: apiReducers(DELETE_RESUME),
	poll: apiReducers(POLL_RESUME)
});

const searches = apiReducers(LOAD_SEARCHES, {
	[successType(SAVE_SEARCH)]: addRecord,
	[successType(DELETE_SEARCH)]: deleteRecord
});

const resetPassword = apiReducers(RESET_PASSWORD);
const updatePassword = apiReducers(UPDATE_PASSWORD);

const verifyEmail = apiReducers(VERIFY_EMAIL);
const resendVerificationEmail = apiReducers(RESEND_VERIFICATION_EMAIL);

export default combineReducers({
	register,
	profile,
	coverLetters,
	resumes,
	searches,
	resetPassword,
	updatePassword,
	verifyEmail,
	resendVerificationEmail
});