/* eslint no-console: "off" */
import sample from 'lodash/sample';
import sampleSize from 'lodash/sampleSize';
import moment from 'moment';
import uuidv4 from 'uuid/v4';
import intersectionWith from 'lodash/intersectionWith';
import { randomLatency } from './common';

const jobTitles = [
	'Accountant / Office Manager',
	'Car Detailer',
	'Sales Consultant',
	'Sub-Prime Representative',
	'Sales and Leasing Consultant',
	'Delivery Specialist'
];

const companyNames = [
	'Sloane Nissan',
	'The Supply Sergeant',
	'Bates RV Exchange',
	'Platinum Lincoln Mercury',
	'Riser Nissan',
	'Northeast Networks',
	'American Import Auto',
	'Bert Ogden Mc Allen Motors'
];

const locations = {
	'ON': [
		'Toronto',
		'Ottawa',
		'Mississauga',
		'Brampton',
		'Hamilton',
		'London',
		'Markham',
		'Vaughan',
		'Kitchener',
		'Windsor'
	],
	'QC': [
		'Montreal',
		'Quebec City',
		'Laval',
		'Gatineau',
		'Longueuil',
		'Sherbrooke',
		'Saguenay',
		'Levis'
	]
};

const localName = englishName => ({
	en: englishName,
	fr: englishName + ' fr'
});

const departments = [
	{ id: 'ACC', name: localName('Accounting') },
	{ id: 'ADM', name: localName('Administration') },
	{ id: 'BOD', name: localName('Body shop') },
	{ id: 'GEN', name: localName('General') },
	{ id: 'CUS', name: localName('Customer services') },
	{ id: 'SAL', name: localName('Sales') }
];

const positionTypes = [
	{ id: 'APP', name: localName('Apprentice') },
	{ id: 'COO', name: localName('Co-op student') },
	{ id: 'CON', name: localName('Contract') },
	{ id: 'FRE', name: localName('Freelance') },
	{ id: 'FUL', name: localName('Permanent - Full Time') },
	{ id: 'PAR', name: localName('Permanent - Part Time') }
];

const experiences = [
	{ id: '1T3', name: localName('1 to 3 years') },
	{ id: '3T5', name: localName('3 to 5 years') },
	{ id: '5T1', name: localName('5 to 10 years') },
	{ id: 'NON', name: localName('None') },
	{ id: 'OVR', name: localName('Over 10 years') },
	{ id: 'UND', name: localName('Under 1 year') }
];

const educations = [
	{ id: 'NA', name: localName('N/A') },
	{ id: 'ASS', name: localName('Associate degree') },
	{ id: 'BAC', name: localName('Bachelors degree') },
	{ id: 'COL', name: localName('College diploma') },
	{ id: 'DOC', name: localName('Doctorate') },
	{ id: 'HIG', name: localName('High school or equivalent') },
	{ id: 'MAS', name: localName('Masters degree') }
];

const salaries = [
	null,
	'TBD',
	'TBD + Performance bonus',
	'TBD + Benefits'
];

const description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eu feugiat pretium nibh ipsum consequat nisl. Aliquam vestibulum morbi blandit cursus risus at. At ultrices mi tempus imperdiet nulla malesuada pellentesque. Tortor consequat id porta nibh venenatis cras sed felis. Ut pharetra sit amet aliquam id diam maecenas ultricies mi. Aliquam etiam erat velit scelerisque in dictum non. Viverra tellus in hac habitasse platea dictumst. Elementum nibh tellus molestie nunc non. Habitant morbi tristique senectus et netus et. Quam quisque id diam vel. Condimentum vitae sapien pellentesque habitant morbi. Faucibus purus in massa tempor nec feugiat nisl pretium. Ut faucibus pulvinar elementum integer enim neque volutpat. Cras sed felis eget velit aliquet.

Duis at consectetur lorem donec massa sapien. Massa tincidunt nunc pulvinar sapien. Morbi non arcu risus quis varius quam quisque. Suscipit tellus mauris a diam maecenas sed enim. Et molestie ac feugiat sed lectus. Enim neque volutpat ac tincidunt vitae semper. Sed euismod nisi porta lorem mollis. Erat pellentesque adipiscing commodo elit at imperdiet. Mauris sit amet massa vitae tortor condimentum lacinia quis. Pellentesque id nibh tortor id aliquet lectus proin nibh. Sit amet massa vitae tortor condimentum. Orci a scelerisque purus semper eget duis at tellus at. Scelerisque purus semper eget duis at tellus at. Quam elementum pulvinar etiam non quam lacus suspendisse faucibus. Enim tortor at auctor urna nunc id cursus. Tellus orci ac auctor augue mauris. Eu facilisis sed odio morbi quis. Laoreet sit amet cursus sit amet dictum sit amet justo. Neque egestas congue quisque egestas. Ut sem viverra aliquet eget sit amet.

Cras sed felis eget velit aliquet sagittis id. Urna duis convallis convallis tellus id interdum velit laoreet id. Nisi est sit amet facilisis magna etiam tempor orci eu. Et netus et malesuada fames ac turpis egestas sed. Quam elementum pulvinar etiam non quam lacus suspendisse. Ut enim blandit volutpat maecenas. Aliquam eleifend mi in nulla posuere sollicitudin. Donec enim diam vulputate ut pharetra sit amet aliquam. Posuere sollicitudin aliquam ultrices sagittis. Bibendum arcu vitae elementum curabitur vitae nunc. Phasellus vestibulum lorem sed risus ultricies. Urna id volutpat lacus laoreet non curabitur. Etiam tempor orci eu lobortis elementum nibh. Vitae et leo duis ut diam. Mi eget mauris pharetra et ultrices. Dignissim suspendisse in est ante. Nisi lacus sed viverra tellus. Faucibus pulvinar elementum integer enim neque volutpat. Tempor commodo ullamcorper a lacus vestibulum sed arcu non. Bibendum est ultricies integer quis auctor elit sed vulputate.

Tortor at auctor urna nunc id cursus metus. Auctor neque vitae tempus quam pellentesque nec nam. Pharetra sit amet aliquam id diam maecenas ultricies mi eget. Dui ut ornare lectus sit amet est placerat in egestas. Lectus proin nibh nisl condimentum id. Sed egestas egestas fringilla phasellus faucibus scelerisque eleifend. Quam lacus suspendisse faucibus interdum. In hac habitasse platea dictumst vestibulum rhoncus est. Pellentesque diam volutpat commodo sed egestas egestas fringilla. Sagittis aliquam malesuada bibendum arcu vitae elementum curabitur.

Sodales neque sodales ut etiam sit amet nisl purus in. Eleifend quam adipiscing vitae proin sagittis. Ut pharetra sit amet aliquam id diam maecenas. Nibh sit amet commodo nulla. In fermentum posuere urna nec tincidunt. Bibendum at varius vel pharetra. Lacinia at quis risus sed. Tellus in hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Placerat in egestas erat imperdiet. A diam maecenas sed enim ut sem viverra aliquet eget. In hac habitasse platea dictumst vestibulum rhoncus est. Ullamcorper velit sed ullamcorper morbi tincidunt ornare massa eget egestas. Ultrices eros in cursus turpis. Diam phasellus vestibulum lorem sed. Senectus et netus et malesuada fames ac turpis egestas. Faucibus scelerisque eleifend donec pretium vulputate sapien nec.`;


export const createJobs = ({ count = 1000, extraFields } = {}) => {
	let jobs = [];

	for(let i = 0; i < count; ++i) {
		const province = sample(Object.keys(locations));
		const city = sample(locations[province]);

		let extra = {};
		if(extraFields)
			extra = extraFields();
	
		jobs.push({
			id: uuidv4(),
			title: sample(jobTitles),
			company: {
				name: sample(companyNames),
				logo: (Math.random() > .5) ? `https://picsum.photos/200/100/?random=${i % 5}` : null
			},
			department: sampleSize(departments.map(d => d.id), Math.ceil(Math.random() * 3)),
			positionType: sample(positionTypes.map(s => s.id)),
			experience: sample(experiences.map(e => e.id)),
			education: sample(educations.map(e => e.id)),
			salary: sample(salaries),
			city,
			province,
			closingDate: moment().add(Math.random() * 30, 'days').toDate(),
			postDate: moment().subtract(Math.random() * 100, 'days').toDate(),
			description,

			...extra
		});
	}

	return jobs;
};

let jobs = createJobs();
let savedJobs = [];

let resumes = [];
let applications = [];


/* eslint-disable no-unused-vars */
const getJobHeader = (service, { description, id, ...otherProps }) => {
	const application = applications.find(a => a.jobId === id);

	return {
		id,
		...otherProps,

		saved: savedJobs.includes(id),
		appliedDate: application ? application.appliedDate : null
	};
};
/* eslint-enable */

const transformApplication = application => ({
	...application,

	job: getJobHeader(null, jobs.find(job => job.id === application.jobId))
});

savedJobs.push(jobs[0].id);

applications.push(transformApplication({
	id: uuidv4(),
	jobId: jobs[1].id,
	firstName: 'Ben',
	lastName: 'Cotton',
	cellphone: '1234567890',
	email: 'ben.cotton@gnr8r.ca',
	coverLetter: 'Lorem ipsum',
	resumeId: null,
	appliedDate: moment().subtract(3, 'days').toDate()
}));

const filterJob = filter => job => {
	let match = true;

	const filterText = (fieldValue, filterValue) => {
		if(match && filterValue)
			match = fieldValue.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1;

		return match;
	};

	const filterExact = (fieldValue, filterValue) => {
		if(match && filterValue)
			match = fieldValue === filterValue;

		return match;
	};

	match = filterText(`${job.title} ${job.description}`, filter.keywords);

	if(match && filter.location) {
		match = filterText(job.city, filter.location.city);
		match = filterText(job.province, filter.location.province);
	}

	match = filterExact(job.department, filter.department);
	match = filterExact(job.positionType, filter.positionType);
	match = filterExact(job.experience, filter.experience);
	match = filterExact(job.education, filter.education);

	if(match && filter.age)
		match = moment(job.postDate).isAfter(moment().subtract(filter.age, 'days'));

	return match;
};

export const getJobs = async (service, { startIndex = 0, count, filter } = {}) => {
	console.log('getJobs', { startIndex, count, filter });

	let filteredJobs = jobs;
	if(filter) {
		filteredJobs = jobs.filter(filterJob(filter));
	}

	/* eslint-disable no-unused-vars */
	const jobsPage = 
		filteredJobs.slice(startIndex, (count == null) ? undefined : startIndex + count)
			.map(job => getJobHeader(null, job));
	/* eslint-enable */

	await randomLatency();
	return ({
		jobs: jobsPage,
		totalCount: filteredJobs.length
	});
};

export const getJobDetail = async (service, { id }) => {
	console.log('getJobDetail', { id });

	await randomLatency();

	let job = jobs.find(job => job.id === id);
	if(job) {
		const application = applications.find(a => a.jobId === id);

		job = {
			...job,
			
			saved: savedJobs.includes(job.id),
			appliedDate: application ? application.appliedDate : null
		};

		return job;
	}
	else
		throw new Error('Job not found');
};

const lookupValues = (name, array) => async () => {
	console.log(name);

	await randomLatency();
	return array.slice();
};

export const getDepartments = lookupValues('getDepartments', departments);
export const getPositionTypes = lookupValues('getPositionTypes', positionTypes);
export const getExperiences = lookupValues('getExperiences', experiences);
export const getEducations = lookupValues('getEducations', educations);

export const saveJob = async (service, { id }) => {
	console.log('saveJob', { id });

	await randomLatency();
	if(!savedJobs.includes(id))
		savedJobs.push(id);

	return getJobDetail({ id });
};

export const unsaveJob = async (service, { id }) => {
	console.log('unsaveJob', { id });

	await randomLatency();
	const index = savedJobs.indexOf(id);
	if(index !== -1)
		savedJobs.splice(index, 1);

	return getJobDetail({ id });
};

export const getSavedJobs = async () => {
	console.log('getSavedJobs');

	await randomLatency();
	
	const savedJobObjs = intersectionWith(jobs, savedJobs, (arrVal, othVal) => arrVal.id === othVal);
	return savedJobObjs.map(job => getJobHeader(null, job));
};

export const uploadResume = async (service, { file }) => {
	console.log('uploadResume');

	await randomLatency();

	const resume = {
		id: uuidv4(),
		file
	};
	resumes.push(resume);

	return resume.id;
};

export const apply = async (service, { jobId, firstName, lastName, cellphone, email, coverLetterText, resumeId }) => {
	console.log('apply');

	await randomLatency();

	if(!applications.find(a => a.jobId === jobId)) {
		const application = {
			id: uuidv4(),
			jobId,
			firstName,
			lastName,
			cellphone,
			email,
			coverLetterText,
			resumeId,
			appliedDate: new Date()
		};

		applications.push(application);

		return transformApplication(application);
	}
	else
		throw new Error('Job already applied for');
};

export const getApplicationHistory = async () => {
	console.log('getApplicationHistory');

	await randomLatency();

	return applications.map(transformApplication);
};