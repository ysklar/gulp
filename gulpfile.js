const { src, dest, parallel, series, watch } = require('gulp');

const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const clean = require('gulp-clean');

const paths = {
	html: {
		src: './src/**/*.html',
		dest: './dist/'
	},
	styles: {
		src: './src/styles/**/*.scss',
		dest: './dist/css/'
	},
	scripts: {
		src: './src/scripts/**/*.js',
		dest: './dist/js/'
	},
	images: {
		src: './src/images/**/*',
		dest: './dist/images/'
	}
};

function html() {
	return src(paths.html.src)
		.pipe(htmlmin({
			collapseWhitespace: true
		}))
		.pipe(dest(paths.html.dest))
		.pipe(browserSync.stream());
}

function styles() {
	return src(paths.styles.src)
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 10 version']
		}))
		.pipe(concat('style.min.css'))
		.pipe(sass({
			outputStyle: 'compressed'
		}).on('error', sass.logError))
		.pipe(dest(paths.styles.dest))
		.pipe(browserSync.stream());
}

function scripts() {
	return src(paths.scripts.src)
		.pipe(concat('script.min.js'))
		.pipe(uglify())
		.pipe(dest(paths.scripts.dest))
		.pipe(browserSync.stream());
}

function images() {
	return src(paths.images.src)
		.pipe(imagemin({
			progressive: true
		}))
		.pipe(dest(paths.images.dest));
}

function watching() {
	browserSync.init({
		server: {
			baseDir: "./dist/"
		},
		notify: false
	});

	watch(paths.html.src, html);
	watch(paths.styles.src, styles);
	watch(paths.scripts.src, scripts);
	watch(paths.images.src, images);
}

function clear() {
	return src('./dist/*')
		.pipe(clean());
}

exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;

exports.clear = clear;

exports.default = series(clear, html, parallel(styles, scripts, images), watching);