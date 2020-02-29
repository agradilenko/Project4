
const apiPath = 'http://project4.bidone.ru/api/v1/';

export default {
	set request(params) {
		let xhr;

		const setError = (msg) => {
			console.log(msg);

			if (params.callbackError && typeof params.callbackError === 'function')
				params.callbackError();
		};

		const xhrLoadHandler = () => {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					let response = '';

					try {
						response = JSON.parse(xhr.response);
					} catch (error) {
						setError('messages.xhrJsonError');
					}
					params.callbackSuccess(response);
				} else
					setError('server error');
			}
		};

		const xhrErrorHandler = () => {
			setError('server error');
		};

		const xhrTimeoutHandler = () => {
			setError('messages.xhrTimeoutError');
		};

		xhr = new XMLHttpRequest();

		xhr.addEventListener('load', xhrLoadHandler);
		xhr.addEventListener('error', xhrErrorHandler);
		xhr.addEventListener('timeout', xhrTimeoutHandler);

		xhr.timeout = 10000;

		xhr.open(params.metod, apiPath + params.url, true);

		if (!(params.data instanceof File))
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

		xhr.send(params.data);
	}
};
