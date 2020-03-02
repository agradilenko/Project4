
import xhr from './xhr.js';

const block1 = document.querySelector('#block1');

const block1Edit = block1.querySelector('#edit');
const block1ShowHide = block1.querySelector('#show-hide');
const block1Cancel = block1.querySelector('#cancel');

const block1Tittle = block1.querySelector('#tittle');
const block1SubTittle = block1.querySelector('#sub-tittle');
const block1Date = block1.querySelector('#date');
const block1Counter = block1.querySelector('#counter');
const block1Description = block1.querySelector('#description');
const block1Hashtag = block1.querySelector('#hashtag');

const vars = window.siteInfo;

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
	block1Tittle.innerHTML = `${vars.person1Name} & ${vars.person2Name}`;
	block1SubTittle.innerHTML = vars.subTittle;
	pDate.setDate(vars.date);
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
		alert(data.message);
		diffBetweenDates();
		showCounter();
	};

	xhr.request = {
		metod: 'PUT',
		url: `site/${vars.site}/variables`,
		data: `subTittle=${block1SubTittle.innerHTML}&date=${pDate.getDate()}&description=${block1Description.innerHTML}&hashtag=${block1Hashtag.innerHTML}&counterShow=${!block1Counter.hidden}`,
		callbackSuccess
	};
};


const setEditable = (flag) => {
	block1Tittle.contentEditable = flag;
	block1SubTittle.contentEditable = flag;
	block1Date.contentEditable = flag;
	block1Counter.contentEditable = flag;
	block1Description.contentEditable = flag;
	block1Hashtag.contentEditable = flag;

	if (flag) {
		block1Tittle.classList.add('edit');
		block1SubTittle.classList.add('edit');
		block1Date.classList.add('edit');
		block1Counter.classList.add('edit');
		block1Description.classList.add('edit');
		block1Hashtag.classList.add('edit');
	} else {
		block1Tittle.classList.remove('edit');
		block1SubTittle.classList.remove('edit');
		block1Date.classList.remove('edit');
		block1Counter.classList.remove('edit');
		block1Description.classList.remove('edit');
		block1Hashtag.classList.remove('edit');
	}
};
