
import xhr from './tools/xhr.js';

const adminBar = document.querySelector('#admin-bar');
const adminLogout = adminBar.querySelector('button[type=logout]');

const modalWrapper = document.querySelector('#modal-wrapper');
const modalContent = document.querySelector('#modal-content');
const modaForm = modalContent.querySelector('form');
// const modaInput = modalContent.querySelector('input[type=text]');

const init = () => {
	modalWrapper.addEventListener('click', (evt) => {
		if (evt.target === '')
			modalWrapper.hidden = true;
	});

	modaForm.addEventListener('submit', () => {
		const callbackSuccess = () => {
			alert('Значение поменяно, плата уплачена...');
		};

		xhr({
			metod: 'PUT',
			url: `site/${window.siteInfo.site}/variables/subtittle`,
			data: 'value=modaInput.value',
			callbackSuccess
		});
	});

	adminLogout.addEventListener('click', () => logout());

	isAdminUser();
};

const logout = () => {
	document.cookie = 'name = token; expires = Thu, 01 Jan 1970 00:00:00 GMT; path = /; domain = project4.bidone.ru';
	window.location.replace('http://project4.bidone.ru/');
};

const isAdminUser = () => {
	const callbackSuccess = () => {
		adminBar.hidden = false;
		document.querySelector('#edit').hidden = false;
	};

	xhr.request = {
		metod: 'GET',
		url: `site/${window.siteInfo.site}/auth`,
		data: false,
		callbackSuccess
	};
};


init();
