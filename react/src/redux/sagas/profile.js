import { apiSagaHandleError, handleError } from './helpers';
import service from 'services';
import {
	REGISTER,
	UPDATE_PROFILE,
	LOAD_PROFILE,
	LOAD_COVER_LETTERS,
	ADD_COVER_LETTER,
	SET_COVER_LETTER_ACTIVE,
	UPDATE_COVER_LETTER,
	DELETE_COVER_LETTER,
	LOAD_RESUMES,
	ADD_RESUME,
	SET_RESUME_ACTIVE,
	SET_RESUME_SEARCHABLE,
	UPDATE_RESUME,
	DELETE_RESUME,
	LOAD_RESUME,
	POLL_RESUME,
	POLL_RESUME_STOP,
	LOAD_SEARCHES,
	SAVE_SEARCH,
	DELETE_SEARCH,
	RESET_PASSWORD,
	UPDATE_PASSWORD,
	VERIFY_EMAIL,
	RESEND_VERIFICATION_EMAIL
} from 'redux/actions/profile';
import { all, takeEvery, put, call, takeLatest, take, race } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { successType, reloadType } from 'utils/redux';
import { REHYDRATE } from 'redux-persist';
import { SIGN_IN } from 'redux/actions/user';

const register = apiSagaHandleError(service.register, REGISTER, { alwaysFetch: true });
const loadProfile = apiSagaHandleError(service.getProfile, LOAD_PROFILE, { alwaysFetch: true });
const updateProfile = apiSagaHandleError(service.updateProfile, UPDATE_PROFILE, { alwaysFetch: true });

const loadCoverLetters = apiSagaHandleError(service.getCoverLetters, LOAD_COVER_LETTERS, { alwaysFetch: true });
const addCoverLetter = apiSagaHandleError(service.addCoverLetter, ADD_COVER_LETTER, { alwaysFetch: true });
const setCoverLetterActive = apiSagaHandleError(service.setCoverLetterActive, SET_COVER_LETTER_ACTIVE, { alwaysFetch: true });
const updateCoverLetter = apiSagaHandleError(service.updateCoverLetter, UPDATE_COVER_LETTER, { alwaysFetch: true });
const deleteCoverLetter = apiSagaHandleError(service.deleteCoverLetter, DELETE_COVER_LETTER, { alwaysFetch: true });

const loadResumes = apiSagaHandleError(service.getResumes, LOAD_RESUMES, { alwaysFetch: true });
const loadResume = apiSagaHandleError(service.getResume, LOAD_RESUME, { alwaysFetch: true });
const setResumeActive = apiSagaHandleError(service.setResumeActive, SET_RESUME_ACTIVE, { alwaysFetch: true });
const setResumeSearchable = apiSagaHandleError(service.setResumeSearchable, SET_RESUME_SEARCHABLE, { alwaysFetch: true });
const deleteResume = apiSagaHandleError(service.deleteResume, DELETE_RESUME, { alwaysFetch: true });

function* handleAddResume({ payload }) {
	const { file, ...otherProps } = payload;

	try {
		const uploadResult = yield call(service.uploadResume, { file });
		const addResult = yield call(service.addResume, { ...otherProps, fileId: uploadResult.id });

		yield put({ type: successType(ADD_RESUME), result: addResult });
	}
	catch(error) {
		yield handleError(error, ADD_RESUME);
	}
}

const addResume = takeEvery(ADD_RESUME, handleAddResume);

function* handleUpdateResume({ payload }) {
	const { file, ...otherProps } = payload;

	try {
		let uploadResult;
		if(file)
			uploadResult = yield call(service.uploadResume, { file });

		let update = otherProps;
		if(file)
			update = {
				...otherProps,

				fileId: uploadResult.id
			};
			
		const updateResult = yield call(service.updateResume, update);

		yield put({ type: successType(UPDATE_RESUME), result: updateResult });
	}
	catch(error) {
		yield handleError(error, UPDATE_RESUME);
	}
}

const updateResume = takeEvery(UPDATE_RESUME, handleUpdateResume);

function* getResume(id) {
	let processing;
	try {
		const result = yield call(service.getResume, { id });

		processing = result.processing;

		yield put({ type: successType(POLL_RESUME), result });
	}
	catch(error) {
		yield handleError(error, LOAD_RESUME, POLL_RESUME);

		processing = false;
	}

	return processing;
}

function* handlePollResume(id, processing) {
	while(processing) {
		processing = yield getResume(id);

		yield call(delay, 5000);
	}
}

function* watchPollSaga({ payload }) {
	const id = payload.id;

	const processing = yield getResume(id);
	yield race([
		call(handlePollResume, id, processing),
		take(POLL_RESUME_STOP)
	]);
}

const pollResume = takeLatest(POLL_RESUME, watchPollSaga);

const loadSearches = apiSagaHandleError(service.getSearches, LOAD_SEARCHES, { alwaysFetch: true });
const saveSearch = apiSagaHandleError(service.saveSearch, SAVE_SEARCH, { alwaysFetch: true });
const deleteSearch = apiSagaHandleError(service.deleteSearch, DELETE_SEARCH, { alwaysFetch: true });

function* handleSignInSuccess() {
	yield all([
		put({ type: reloadType(LOAD_PROFILE) }),
		put({ type: reloadType(LOAD_RESUMES) }),
		put({ type: reloadType(LOAD_COVER_LETTERS) }),
		put({ type: reloadType(LOAD_SEARCHES) })
	]);
}

const reloadAfterSignIn = takeEvery(successType(SIGN_IN), handleSignInSuccess);

function* validateRehydrated({ key, payload }) {
	if(key === 'signIn')
		yield put({ type: successType(SIGN_IN), result: payload.result });
}

const handleRehydrate = takeEvery(REHYDRATE, validateRehydrated);

const resetPassword = apiSagaHandleError(service.resetPassword, RESET_PASSWORD, { alwaysFetch: true });
const updatePassword = apiSagaHandleError(service.updatePassword, UPDATE_PASSWORD, { alwaysFetch: true });

const verifyEmail = apiSagaHandleError(service.verifyEmail, VERIFY_EMAIL, { alwaysFetch: true });
const resendVerificationEmail = apiSagaHandleError(service.resendVerificationEmail, RESEND_VERIFICATION_EMAIL, { alwaysFetch: true });

export default function* () {
	yield all([
		register,
		loadProfile,
		updateProfile,
		loadCoverLetters,
		addCoverLetter,
		setCoverLetterActive,
		updateCoverLetter,
		deleteCoverLetter,
		loadResumes,
		loadResume,
		pollResume,
		addResume,
		setResumeActive,
		setResumeSearchable,
		updateResume,
		deleteResume,
		loadSearches,
		saveSearch,
		deleteSearch,
		reloadAfterSignIn,
		handleRehydrate,
		resetPassword,
		updatePassword,
		verifyEmail,
		resendVerificationEmail
	]);
}