
import xhr from './xhr.js';

const block2 = document.querySelector('#block2');

const block2Edit = block2.querySelector('#edit');
const block2Cancel = block2.querySelector('#cancel');

const person1Photo = block2.querySelector('#person1-photo');
const person1PhotoUploader = block2.querySelector('#person1-photo-uploader');
const person1Name = block2.querySelector('#person1-name');
const person1Description = block2.querySelector('#person1-description');

const person2Photo = block2.querySelector('#person2-photo');
const person2Name = block2.querySelector('#person2-name');
const person2Description = block2.querySelector('#person2-description');
const person2PhotoUploader = block2.querySelector('#person2-photo-uploader');

let vars = window.siteInfo;

const init = () => {
	setValues();
	person1PhotoUploader.addEventListener('change', (evt) => {
		uploadPhoto('person1Photo', evt.target.files[0]);
	});
	person2PhotoUploader.addEventListener('change', (evt) => {
		uploadPhoto('person2Photo', evt.target.files[1]);
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
		person2Photo.src = `${vars.person2Photo}?${Math.floor(new Date().getTime() / 1000)}`;
	};

	xhr.request = {
		metod: 'PUT',
		url: `site/${vars.site}/variables/${field}`,
		data: file,
		callbackSuccess
	};
};

// eslint-disable-next-line no-unused-vars
const saveChanges = () => {
	const callbackSuccess = (data) => {
		console.log(data.message);
		changesMap.forEach((value, key) => {
			window.siteInfo[key] = value;
		});
		vars = window.siteInfo;
	};
	let data = '';
	const changesMap = new Map();
	if (person1Name.innerHTML !== vars.person1Name) {
		data += `${(data.length === 0 ? '' : '&')}person1Name=${person1Name.innerHTML}`;
		changesMap.set('person1Name', person1Name.innerHTML);
	}
	if (person2Name.innerHTML !== vars.person2Name) {
		data += `${(data.length === 0 ? '' : '&')}person2Name=${person2Name.innerHTML}`;
		changesMap.set(' person2Name', person2Name.innerHTML);
	}
	if (person1Description.innerHTML !== vars.person1Description) {
		data += `${(data.length === 0 ? '' : '&')}person1Description=${person1Description.innerHTML}`;
		changesMap.set('person1Description', person1Description.innerHTML);
	}
	if (person2Description.innerHTML !== vars.person2Description) {
		data += `${(data.length === 0 ? '' : '&')}person2Description=${person2Description.innerHTML}`;
		changesMap.set('person2Description', person2Description.innerHTML);
	}
	//  if (person1Photo.src !== vars.person1Photo) {
	// data += `${(data.length === 0 ? '' : '&')}person1Photo=${person2Photo.src}`;
	// changesMap.set('person1Photo', person1Photo.src);
	// }
	//  if (person2Photo.src !== vars.person2Photo) {
	// data += `${(data.length === 0 ? '' : '&')}person2Photo=${person2Photo.src}`;
	// changesMap.set('person2Photo', person2Photo.src);
	// }
	alert(data);
	if (data.length !== 0) {
		xhr.request = {
			metod: 'PUT',
			url: `site/${vars.site}/variables`,
			data: `${data}`,
			callbackSuccess
		};
	}
};

// eslint-disable-next-line no-unused-vars
const setEditable = (flag) => {
	person1Photo.contentEditable = flag;
	person2Photo.contentEditable = flag;
	person1Name.contentEditable = flag;
	person2Name.contentEditable = flag;
	person1Description.contentEditable = flag;
	person2Description.contentEditable = flag;

	if (flag) {
		person1Photo.classList.add('edit');
		person2Photo.classList.add('edit');
		person1Name.classList.add('edit');
		person2Name.classList.add('edit');
		person1Description.classList.add('edit');
		person2Description.classList.add('edit');
	} else {
		person1Photo.classList.remove('edit');
		person2Photo.classList.remove('edit');
		person1Name.classList.remove('edit');
		person2Name.classList.remove('edit');
		person1Description.classList.remove('edit');
		person2Description.classList.remove('edit');
	}
};

init();

block2Edit.addEventListener('click', () => {
	if (block2Edit.dataset.type === 'edit') {
		setEditable(true);
		block2Cancel.hidden = false;
		block2Edit.dataset.type = 'save';
		block2Edit.classList.add('btn-save');
	} else {
		setEditable(false);
		block2Edit.dataset.type = 'edit';
		block2Edit.classList.remove('btn-save');
		block2Cancel.hidden = true;
		saveChanges();
	}
});

block2Cancel.addEventListener('click', () => {
	setEditable(false);
	setValues();

	block2Edit.dataset.type = 'edit';
	block2Edit.classList.remove('btn-save');
	block2Cancel.hidden = true;
});
