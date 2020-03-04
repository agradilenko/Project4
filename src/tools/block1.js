
import xhr from './xhr.js';

const block1 = document.querySelector('#block1');

const block1Edit = block1.querySelector('#edit');
const block1ShowHide = block1.querySelector('#show-hide');
const block1Cancel = block1.querySelector('#cancel');

const block1Person1 = block1.querySelector('#name1');
const block1Person2 = block1.querySelector('#name2');
const block1subTitle = block1.querySelector('#sub-tittle');
const block1Date = block1.querySelector('#date');
const block1Counter = block1.querySelector('#counter');
const block1Description = block1.querySelector('#description');
const block1Hashtag = block1.querySelector('#hashtag');

let vars = window.siteInfo;

// eslint-disable-next-line no-undef
const pDate = new Datepicker('#date');
// eslint-disable-next-line no-underscore-dangle
pDate._opts.onChange = () => {
	diffBetweenDates(pDate.getDate());
	block1Date.innerHTML = block1Date.dataset.value;
};

const sklonenie = (number, txt, cases = [2, 0, 1, 1, 1, 2]) => txt[(number % 100 > 4
	&& number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];

const diffBetweenDates = (date) => {
	const currentDate = new Date();
	const difference = Math.ceil((date.getTime() - currentDate.getTime())
		/ (1000 * 3600 * 24));
	const varia = ['день', 'дня', 'дней'];
	const vari2 = ['Остался', 'Осталось', 'Осталось'];
	if (difference === 0 && vars.counterShow === true)
		block1Counter.innerHTML = 'Событие сегодня';
	else if (difference > 0 && vars.counterShow === true) {
		block1Counter.hidden = false;
		block1Counter.innerHTML = `${sklonenie(difference, vari2)} ${difference} ${sklonenie(difference, varia)}`;
	} else if (difference < 0 || vars.counterShow === false)
		block1Counter.hidden = true;
};

const setValues = () => {
	block1Person1.innerHTML = `${vars.person1Name}`;
	block1Person2.innerHTML = `${vars.person2Name}`;
	block1subTitle.innerHTML = vars.subTitle;
	const date = new Date(vars.date.replace(/(\d+)\.(\d+)\.(\d+)/, '$2/$1/$3'));
	pDate.setDate(date);
	if (vars.counterShow === true) {
		block1ShowHide.classList.remove('btn-show');
		block1ShowHide.classList.add('btn-hide');
	} else {
		block1ShowHide.classList.remove('btn-remove');
		block1ShowHide.classList.add('btn-show');
	}
	block1Description.innerHTML = vars.description;
	block1Hashtag.innerHTML = vars.hashtag;
};

setValues();

block1Edit.addEventListener('click', () => {
	if (block1Edit.dataset.type === 'edit') {
		setEditable(true);
		block1ShowHide.hidden = false;
		block1Cancel.hidden = false;
		block1Edit.dataset.type = 'save';
		block1Edit.classList.add('btn-save');
	} else {
		setEditable(false);
		block1Edit.dataset.type = 'edit';
		block1Edit.classList.remove('btn-save');
		block1ShowHide.hidden = true;
		block1Cancel.hidden = true;
		saveChanges();
	}
});

block1ShowHide.addEventListener('click', () => {
	if (block1Counter.hidden) {
		block1ShowHide.classList.remove('btn-show');
		block1ShowHide.classList.add('btn-hide');
		block1Counter.hidden = false;
		vars.counterShow = true;
		diffBetweenDates(pDate.getDate());
	} else {
		block1ShowHide.classList.remove('btn-hide');
		block1ShowHide.classList.add('btn-show');
		block1Counter.hidden = true;
		vars.counterShow = false;
	}
});

// eslint-disable-next-line no-unused-vars
const showCounter = () => {
	const counter = block1Counter;
	if (counter.hidden)
		counter.hidden = false;
	else
		counter.hidden = true;
};

block1Cancel.addEventListener('click', () => {
	setEditable(false);
	setValues();

	block1Edit.dataset.type = 'edit';
	block1Edit.classList.remove('btn-save');
	block1ShowHide.hidden = true;
	block1Cancel.hidden = true;
});

const saveChanges = () => {
	const callbackSuccess = (data) => {
		console.log(data.message);
		// showCounter();
		changesMap.forEach((value, key) => {
			window.siteInfo[key] = value;
		});
		vars = window.siteInfo;
	};
	let data = '';
	const changesMap = new Map();
	if (block1subTitle.innerHTML !== vars.subTitle) {
		data += `${(data.length === 0 ? '' : '&')}subTitle=${block1subTitle.innerHTML}`;
		changesMap.set('subTitle', block1subTitle.innerHTML);
	}
	if (pDate.getValue() !== vars.date) {
		data += `${(data.length === 0 ? '' : '&')}date=${pDate.getValue()}`;
		changesMap.set('date', pDate.getValue());
	}
	if (block1Description.innerHTML !== vars.description) {
		data += `${(data.length === 0 ? '' : '&')}description=${block1Description.innerHTML}`;
		changesMap.set('description', block1Description.innerHTML);
	}
	if (block1Hashtag.innerHTML !== vars.hashtag) {
		data += `${(data.length === 0 ? '' : '&')}hashtag=${block1Hashtag.innerHTML}`;
		changesMap.set('hashtag', block1Hashtag.innerHTML);
	}
	if (block1Counter.hidden !== vars.counterShow) {
		data += `${(data.length === 0 ? '' : '&')}counterShow=${!block1Counter.hidden}`;
		changesMap.set('counterShow', !block1Counter.hidden);
	}
	if (block1Person1.innerHTML !== vars.person1Name) {
		data += `${(data.length === 0 ? '' : '&')}person1Name=${block1Person1.innerHTML}`;
		changesMap.set('person1Name', block1Person1.innerHTML);
	}
	if (block1Person2.innerHTML !== vars.person2Name) {
		data += `${(data.length === 0 ? '' : '&')}person2Name=${block1Person2.innerHTML}`;
		changesMap.set('person2Name', block1Person2.innerHTML);
	}
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


const setEditable = (flag) => {
	block1Person1.contentEditable = flag;
	block1Person2.contentEditable = flag;
	block1subTitle.contentEditable = flag;
	block1Date.contentEditable = flag;
	block1Counter.contentEditable = flag;
	block1Description.contentEditable = flag;
	block1Hashtag.contentEditable = flag;

	if (flag) {
		block1Person1.classList.add('edit');
		block1Person2.classList.add('edit');
		block1subTitle.classList.add('edit');
		block1Date.classList.add('edit');
		block1Counter.classList.add('edit');
		block1Description.classList.add('edit');
		block1Hashtag.classList.add('edit');
	} else {
		block1Person1.classList.remove('edit');
		block1Person2.classList.remove('edit');
		block1subTitle.classList.remove('edit');
		block1Date.classList.remove('edit');
		block1Counter.classList.remove('edit');
		block1Description.classList.remove('edit');
		block1Hashtag.classList.remove('edit');
	}
};
