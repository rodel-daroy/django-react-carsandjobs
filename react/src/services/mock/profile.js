/* eslint no-console: "off" */
import uuidv4 from 'uuid/v4';
import * as jsPDF from 'jspdf';
import { randomLatency } from './common';

const description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eu feugiat pretium nibh ipsum consequat nisl. Aliquam vestibulum morbi blandit cursus risus at. At ultrices mi tempus imperdiet nulla malesuada pellentesque. Tortor consequat id porta nibh venenatis cras sed felis. Ut pharetra sit amet aliquam id diam maecenas ultricies mi. Aliquam etiam erat velit scelerisque in dictum non. Viverra tellus in hac habitasse platea dictumst. Elementum nibh tellus molestie nunc non. Habitant morbi tristique senectus et netus et. Quam quisque id diam vel. Condimentum vitae sapien pellentesque habitant morbi. Faucibus purus in massa tempor nec feugiat nisl pretium. Ut faucibus pulvinar elementum integer enim neque volutpat. Cras sed felis eget velit aliquet.

Duis at consectetur lorem donec massa sapien. Massa tincidunt nunc pulvinar sapien. Morbi non arcu risus quis varius quam quisque. Suscipit tellus mauris a diam maecenas sed enim. Et molestie ac feugiat sed lectus. Enim neque volutpat ac tincidunt vitae semper. Sed euismod nisi porta lorem mollis. Erat pellentesque adipiscing commodo elit at imperdiet. Mauris sit amet massa vitae tortor condimentum lacinia quis. Pellentesque id nibh tortor id aliquet lectus proin nibh. Sit amet massa vitae tortor condimentum. Orci a scelerisque purus semper eget duis at tellus at. Scelerisque purus semper eget duis at tellus at. Quam elementum pulvinar etiam non quam lacus suspendisse faucibus. Enim tortor at auctor urna nunc id cursus. Tellus orci ac auctor augue mauris. Eu facilisis sed odio morbi quis. Laoreet sit amet cursus sit amet dictum sit amet justo. Neque egestas congue quisque egestas. Ut sem viverra aliquet eget sit amet.

Cras sed felis eget velit aliquet sagittis id. Urna duis convallis convallis tellus id interdum velit laoreet id. Nisi est sit amet facilisis magna etiam tempor orci eu. Et netus et malesuada fames ac turpis egestas sed. Quam elementum pulvinar etiam non quam lacus suspendisse. Ut enim blandit volutpat maecenas. Aliquam eleifend mi in nulla posuere sollicitudin. Donec enim diam vulputate ut pharetra sit amet aliquam. Posuere sollicitudin aliquam ultrices sagittis. Bibendum arcu vitae elementum curabitur vitae nunc. Phasellus vestibulum lorem sed risus ultricies. Urna id volutpat lacus laoreet non curabitur. Etiam tempor orci eu lobortis elementum nibh. Vitae et leo duis ut diam. Mi eget mauris pharetra et ultrices. Dignissim suspendisse in est ante. Nisi lacus sed viverra tellus. Faucibus pulvinar elementum integer enim neque volutpat. Tempor commodo ullamcorper a lacus vestibulum sed arcu non. Bibendum est ultricies integer quis auctor elit sed vulputate.

Tortor at auctor urna nunc id cursus metus. Auctor neque vitae tempus quam pellentesque nec nam. Pharetra sit amet aliquam id diam maecenas ultricies mi eget. Dui ut ornare lectus sit amet est placerat in egestas. Lectus proin nibh nisl condimentum id. Sed egestas egestas fringilla phasellus faucibus scelerisque eleifend. Quam lacus suspendisse faucibus interdum. In hac habitasse platea dictumst vestibulum rhoncus est. Pellentesque diam volutpat commodo sed egestas egestas fringilla. Sagittis aliquam malesuada bibendum arcu vitae elementum curabitur.

Sodales neque sodales ut etiam sit amet nisl purus in. Eleifend quam adipiscing vitae proin sagittis. Ut pharetra sit amet aliquam id diam maecenas. Nibh sit amet commodo nulla. In fermentum posuere urna nec tincidunt. Bibendum at varius vel pharetra. Lacinia at quis risus sed. Tellus in hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Placerat in egestas erat imperdiet. A diam maecenas sed enim ut sem viverra aliquet eget. In hac habitasse platea dictumst vestibulum rhoncus est. Ullamcorper velit sed ullamcorper morbi tincidunt ornare massa eget egestas. Ultrices eros in cursus turpis. Diam phasellus vestibulum lorem sed. Senectus et netus et malesuada fames ac turpis egestas. Faucibus scelerisque eleifend donec pretium vulputate sapien nec.`;

let users = [];

users.push({
	id: uuidv4(),
	firstName: 'Ben',
	lastName: 'Cotton',
	email: 'ben.cotton@gnr8r.ca',
	province: 'ON',
	password: 'password'
});

export const register = async (service, profile) => {
	console.log('register');

	await randomLatency();

	if(users.find(u => u.email === profile.email))
		throw new Error('User already exists');

	const user = {
		...profile,
		id: uuidv4()
	};

	users.push(user);
	
	/* eslint-disable no-unused-vars */
	const { password, ...otherProps } = user;
	/* eslint-enable */
	return otherProps;
};

export const getProfile = async () => {
	console.log('getProfile');

	await randomLatency();

	if(users.length === 0)
		throw new Error('Not logged in');
	else
		return {...users[users.length - 1]};
};

export const updateProfile = async (service, profile) => {
	console.log('updateProfile');

	await randomLatency();

	const index = users.findIndex(u => u.email === profile.email);
	if(index === -1)
		throw new Error('User doesn\'t exist');

	users[index] = {
		...users[index],
		...profile
	};

	/* eslint-disable no-unused-vars */
	const { password, ...otherProps } = users[index];
	/* eslint-enable */

	return otherProps;
};

let coverLetters = [];

for(let i = 0; i < 20; ++i) {
	coverLetters.push({
		id: uuidv4(),
		name: `Test cover letter ${i}`,
		description: 'Test cover letter description',
		text: description,
		active: true,
		modifiedDate: new Date()
	});
}

export const getCoverLetters = async () => {
	console.log('getCoverLetters');

	await randomLatency();

	return coverLetters.slice();
};

export const addCoverLetter = async (service, coverLetter) => {
	console.log('addCoverLetter');

	await randomLatency();

	const addCoverLetter = {
		...coverLetter,

		id: uuidv4(),
		modifiedDate: new Date(),
		active: true
	};

	coverLetters.push(addCoverLetter);

	return {...addCoverLetter};
};

export const setCoverLetterActive = async (service, { id, active }) => {
	console.log('setCoverLetterActive');

	await randomLatency();

	let coverLetter = coverLetters.find(c => c.id === id);
	if(!coverLetter)
		throw new Error('Cover letter not found');

	coverLetter.active = active;
	coverLetter.modifiedDate = new Date();

	return {...coverLetter};
};

export const updateCoverLetter = async (service, { id, name, description, text, active }) => {
	console.log('updateCoverLetter');

	await randomLatency();

	const index = coverLetters.findIndex(c => c.id === id);
	if(index === -1)
		throw new Error('Cover letter not found');

	const coverLetter = {
		...coverLetters[index],

		name,
		description,
		text,
		active,
		modifiedDate: new Date()
	};
	coverLetters[index] = coverLetter;

	return {...coverLetter};
};

export const deleteCoverLetter = async (service, { id }) => {
	console.log('deleteCoverLetter');

	await randomLatency();

	const index = coverLetters.findIndex(c => c.id === id);
	if(index === -1)
		throw new Error('Cover letter not found');

	const result = coverLetters.splice(index, 1)[0];
	return result;
};

let resumeFiles = [];

const sampleResume = new jsPDF();
sampleResume.text('Lorem ipsum', 10, 10);
const url = sampleResume.output('datauristring');

resumeFiles.push({
	id: 1,
	url
});

export const uploadResume = async (service, { file }) => {
	console.log('uploadResume');

	await randomLatency();

	const resumeFile = {
		id: uuidv4(),
		url: URL.createObjectURL(file)
	};

	resumeFiles.push(resumeFile);

	return resumeFile;
};

let resumes = [];

for(let i = 0; i < 20; ++i) {
	resumes.push({
		id: uuidv4(),
		name: `Test resume ${i}`,
		description: 'Test description',
		fileId: resumeFiles[0].id,
		text: 'Lorem ipsum',
		active: true,
		searchable: i === 2,
		processing: false,
		modifiedDate: new Date()
	});
}

export const getResumes = async () => {
	console.log('getResumes');

	await randomLatency();

	return resumes.map(r => ({
		...r, 
		url: (resumeFiles.find(f => f.id === r.fileId) || {}).url
	}));
};

export const getResume = async (service, { id }) => {
	console.log('getResume');

	await randomLatency();

	const resume = resumes.find(r => r.id === id);
	if(!resume)
		throw new Error('Resume not found');

	return {
		...resume,
		url: (resumeFiles.find(f => f.id === resume.fileId) || {}).url
	};
};

export const addResume = async (service, { name, description, fileId, active, searchable }) => {
	console.log('addResume');

	await randomLatency();

	if(!resumeFiles.find(f => f.id === fileId))
		throw new Error('Resume file not found');

	const resume = {
		id: uuidv4(),
		name,
		description,
		fileId,
		active,
		searchable,
		processing: true,
		modifiedDate: new Date()
	};
	resumes.push(resume);

	const index = resumes.length - 1;

	setTimeout(() => {
		resumes[index] = {
			...resumes[index],

			processing: false,
			text: 'Lorem ipsum'
		};
	}, 5000);

	return resume;
};

const findResume = id => {
	const index = resumes.findIndex(r => r.id === id);
	if(index === -1)
		throw new Error('Resume not found');
	else
		return index;
};

export const setResumeActive = async (service, { id, active }) => {
	console.log('setResumeActive');

	await randomLatency();

	const index = findResume(id);

	resumes[index] = {
		...resumes[index],

		active,
		modifiedDate: new Date()
	};

	return resumes[index];
};

export const setResumeSearchable = async (service, { id, searchable }) => {
	console.log('setResumeSearchable');

	await randomLatency();

	const index = findResume(id);

	resumes[index] = {
		...resumes[index],

		searchable,
		modifiedDate: new Date()
	};

	return resumes[index];
};

export const updateResume = async (service, { id, name, description, fileId, active, searchable }) => {
	console.log('updateResume');

	await randomLatency();

	const index = findResume(id);

	let processing = resumes[index].processing;
	if(fileId !== resumes[index].fileId) {
		processing = true;

		setTimeout(() => {
			resumes[index] = {
				...resumes[index],

				processing: false,
				text: 'Lorem ipsum'
			};
		}, 5000);
	}

	resumes[index] = {
		...resumes[index],

		name,
		description,
		fileId,
		active,
		searchable,
		processing,
		modifiedDate: new Date()
	};

	return resumes[index];
};

export const deleteResume = async (service, { id }) => {
	console.log('deleteResume');

	await randomLatency();

	const index = findResume(id);

	return resumes.splice(index, 1)[0];
};

let searches = [];

export const saveSearch = async (service, { name, filter }) => {
	console.log('saveSearch');

	await randomLatency();

	const search = {
		name,
		filter,

		id: uuidv4(),
		createdDate: new Date()
	};

	searches.push(search);

	return { ...search };
};

saveSearch(null, {
	name: 'test search',
	filter: {
		keywords: 'detail',
		location: {
			city: 'Toronto',
			province: 'ON'
		}
	}
});

export const getSearches = async () => {
	console.log('getSearches');

	await randomLatency();

	return searches.slice();
};

export const deleteSearch = async (service, { id }) => {
	console.log('deleteSearch');

	await randomLatency();

	const index = searches.findIndex(s => s.id === id);
	if(index === -1)
		throw new Error('Search not found');

	return searches.splice(index, 1)[0];
};

export const signIn = async (service, { email, password }) => {
	console.log('signIn');

	await randomLatency();

	const user = users.find(u => u.email === email && u.password === password);
	if(!user)
		throw new Error('Invalid email or password');

	return {
		signedIn: true
	};
};

export const resetPassword = async (service, { email }) => {
	console.log('resetPassword');

	await randomLatency();

	if(email === 'ben.cotton@gnr8r.ca')
		return true;
	else
		throw new Error('Invalid email');
};

export const updatePassword = async (service, { password, token, email }) => {
	console.log('updatePassword', { password, token, email });

	await randomLatency();

	if(password === 'password')
		return true;
	else
		throw new Error('Invalid password');
};