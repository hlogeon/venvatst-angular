'use strict';

import gulp from 'gulp';
import babel from 'gulp-babel';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import rename from 'gulp-rename';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import minifyCss from 'gulp-clean-css';
import webserver from 'gulp-webserver';
import livereload from 'gulp-livereload';
import rev from 'gulp-rev-append';
import sequence from 'run-sequence';
// import ngAnnotate from 'gulp-ng-annotate';

const dirs = {
  src: 'app',
  dest: 'build'
  // dest: 'dist'
};

// add browserify to use import *.

let JS_DEPENDENCIES = [
  'node_modules/angular/angular.min.js',
  'node_modules/angular-ui-router/release/angular-ui-router.min.js'
];

let PATHS = {
  sass: [`${dirs.src}/scss/*.scss`, `${dirs.src}/scss/**/*.scss`],
  js: [`${dirs.src}/js/*.js`, `${dirs.src}/js/**/*.js`],
  html: [`${dirs.src}/templates/*.html`, `${dirs.src}/templates/**/*.html`]
};

// Handle sass changes.
gulp.task('sass', done => {
  return gulp.src(PATHS.sass)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(rename({ extname: '.min.css' }))
    .pipe(minifyCss())
    .pipe(sourcemaps.write(`../${dirs.dest}`))
    .pipe(gulp.dest(dirs.dest))
    .pipe(livereload());
});

// Handle html changes.
gulp.task('html', done => {
  return gulp.src(PATHS.html)
    .pipe(gulp.dest(`${dirs.dest}/templates`))
    .pipe(livereload());
});

// gulp.task('annotate', () => {
//   return gulp.src(PATHS.js)
//     // jscs:disable
//     .pipe(ngAnnotate({ single_quotes: true }))
//     // jscs:enable
//     .pipe(gulp.dest('./app/js'));
// });

// Handle js changes.
gulp.task('js', done => {
  return gulp.src(PATHS.js)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concat('app.js'))
  	// .pipe(ngAnnotate())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dirs.dest))
    .pipe(livereload())
    .on('end', () => {
      gulp
        .src(JS_DEPENDENCIES)
        .pipe(concat('libs.js'))
        .pipe(gulp.dest(dirs.dest));
    });
});

// Minify js
gulp.task('minjs', done => {
  return gulp
    .src(PATHS.js)
    .pipe(concat('app.js'))
    .pipe(babel())
    // .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest(dirs.dest))
    .pipe(livereload())
    .on('end', () => {
      gulp
        .src(JS_DEPENDENCIES)
        .pipe(concat('libs.js'))
        .pipe(gulp.dest(dirs.dest));
    });
});

// Start the development sever task.
gulp.task('server', () => {
  gulp
    .src(dirs.dest)
    .pipe(webserver({
      livereload: false,
      host: null,
      open: false,
      port: process.env.PORT || 8000,
    }));
});

// Task for watching file changes and livereloading the development server.
gulp.task('watch', cb => {
  // sequence(['sass', 'js', 'html'], 'revision', 'server', cb);
  sequence(['sass', 'js', 'html'], 'revision', 'server', 'watching', cb);
  // livereload.listen();
  // gulp.watch(PATHS.js, { interval: 1000 }, ['js']);
  // gulp.watch(PATHS.sass, { interval: 1000 }, ['sass']);
  // gulp.watch(PATHS.html, { interval: 1000 }, ['html']);
});

gulp.task('watching', () => {
  livereload.listen();
  gulp.watch(PATHS.js, { interval: 1000 }, ['js']);
  gulp.watch(PATHS.sass, { interval: 1000 }, ['sass']);
  gulp.watch(PATHS.html, { interval: 1000 }, ['html']);
});

// Gulp default task.
gulp.task('default', ['watch']);

gulp.task('revision', () => {
  return gulp.src(`${dirs.src}/index.html`)
    .pipe(gulp.dest(dirs.dest))
    .pipe(rev())
    .pipe(gulp.dest(dirs.dest));
});

// Build command
gulp.task('build', cb => sequence(['sass', 'minjs', 'html'], 'revision', cb));
