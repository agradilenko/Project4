
const gulp = require('gulp');
const {src, dest} = require('gulp');
const {series, parallel} = require('gulp');

const server = require('browser-sync').create();
const del = require('del');

const SRC_HTML = 'src/**/*.html';
const SRC_CSS = 'src/**/*.css';
const SRC_JS = 'src/**/*.js';
const SRC_IMG = 'src/img/*.{png,jpg,gif,ico}';
const SRC_FONT = 'src/fonts/**/*.woff';

const DST_HTML = 'build/';
const DST_CSS = 'build/';
const DST_JS = 'build/';
const DST_IMG = 'build/img/';
const DST_FONT = 'build/fonts/';

const WATCH_HTML = 'src/*.html';
const WATCH_CSS = 'src/**/*.css';
const WATCH_JS = 'src/**/*.js';
const WATCH_IMG = 'src/img/*';
const WATCH_FONT = 'src/fonts/**/*';

const clear = (done) => {
	del(DST_HTML);
	done();
};

const html = () => {
	return src(SRC_HTML)
		.pipe(dest(DST_HTML));
};

const css = () => {
	return src(SRC_CSS)
		.pipe(dest(DST_CSS));
};

const js = () => {
	return src(SRC_JS)
		.pipe(dest(DST_JS));
};

const img = () => {
	return src(SRC_IMG)
		.pipe(dest(DST_IMG));
};

const font = () => {
	return src(SRC_FONT)
		.pipe(dest(DST_FONT));
};

const startServer = (done) => {
	server.init({
		server: DST_HTML,
		port: 3502
	});

	gulp.watch(WATCH_HTML, series(html, reloadServer.bind(null, DST_HTML)));
	gulp.watch(WATCH_CSS, series(css, reloadServer.bind(null, DST_CSS)));
	gulp.watch(WATCH_JS, series(js, reloadServer.bind(null, DST_JS)));
	gulp.watch(WATCH_IMG, series(img, reloadServer.bind(null, DST_IMG)));
	gulp.watch(WATCH_FONT, series(font, reloadServer.bind(null, DST_FONT)));

	done();
};

const reloadServer = (source) => {
	return src(source)
		.pipe(server.stream());
};

exports.start = series(clear, html, css, js, startServer);
