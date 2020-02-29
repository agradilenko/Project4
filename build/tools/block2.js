
import xhr from './xhr.js';

const block2 = document.querySelector('#block2');

const edit = block2.querySelector('#edit');

const person1Photo = block2.querySelector('#person1-photo');
const person1PhotoUploader = block2.querySelector('#person1-photo-uploader');
const person1Name = block2.querySelector('#person1-name');
const person1Description = block2.querySelector('#person1-description');

const person2Photo = block2.querySelector('#person2-photo');
const person2Name = block2.querySelector('#person2-name');
const person2Description = block2.querySelector('#person2-description');

const vars = window.siteInfo;

const init = () => {
	setValues();

	edit.addEventListener('click', () => {
		alert('editor is loading... almost');
	});

	person1PhotoUploader.addEventListener('change', (evt) => {
		uploadPhoto('person1Photo', evt.target.files[0]);
	});
};

const setValues = () => {
	person1Photo.src = vars.person1Photo;
	person1Name.innerHTML = vars.person1Name;
	person1Description.innerHTML = vars.person1Description;

	person2Photo.src = vars.person2Photo;
	person2Name.innerHTML = vars.person2Name;
	person2Description.innerHTML = vars.person2Description;
};

const uploadPhoto = (field, file) => {
	const callbackSuccess = () => {
		person1Photo.src = `${vars.person1Photo}?${Math.floor(new Date().getTime() / 1000)}`;
	};

	xhr.request = {
		metod: 'PUT',
		url: `site/${vars.site}/variables/${field}`,
		data: file,
		callbackSuccess
	};
};

init();
