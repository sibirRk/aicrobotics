var gulp = require('gulp'),
		sass = require('gulp-sass'),
		plumber = require('gulp-plumber'),
		browserSync = require('browser-sync').create(),
		sourcemaps = require('gulp-sourcemaps');

var conf = {
	sass: {
		src: './src/*.scss',
		dest: './css/'
	}
}

gulp.task('serve', function () {
	browserSync.init({
		server: {
			baseDir: "./"
		},
		open: false
	});

	gulp.watch('./*.html').on('change', browserSync.reload);
	gulp.watch('./js/*.js').on('change', browserSync.reload);
	gulp.watch(conf.sass.src).on('change', gulp.task('sass'));
});

gulp.task('sass', function () {
	return gulp.src(conf.sass.src)
		.pipe(sourcemaps.init())
		.pipe(plumber())
		.pipe(sass().on('error', sass.logError))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(conf.sass.dest))
		.pipe(browserSync.stream());
});

gulp.task('default', gulp.task('serve'));