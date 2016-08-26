'use strict';

import gulp from 'gulp';
import sequence from 'run-sequence';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import gulpif       from 'gulp-if';
import source       from 'vinyl-source-stream';
import sourcemaps   from 'gulp-sourcemaps';
import buffer       from 'vinyl-buffer';
import streamify    from 'gulp-streamify';
import watchify     from 'watchify';
import browserify   from 'browserify';
import browserifyCss from 'browserify-css';
import babelify     from 'babelify';
import debowerify   from 'debowerify';
import ngAnnotate   from 'browserify-ngannotate';


let isProd = false;

let plugins = gulpLoadPlugins();

const DIRS = {
  src: 'app',
  dest: 'build',
  js: { app: 'js/app.js', libs: 'js/libs.js' }
};

const JS_DEPENDENCIES = [
  'node_modules/angular/angular.js',
  'node_modules/angular-ui-router/release/angular-ui-router.js',
  'node_modules/angular-animate/angular-animate.js',
  'node_modules/angular-aria/angular-aria.js',
  'node_modules/angular-material/angular-material.js',
  'node_modules/angular-local-storage/index.js',
  'node_modules/angular-formly/dist/formly.js',
  'node_modules/angular-formly-templates-bootstrap/dist/angular-formly-templates-bootstrap.js',
  'node_modules/modernizr/lib/build.js',
  'node_modules/moment/moment.js',
  'node_modules/angular-moment/angular-moment.js',
  'node_modules/tether/dist/js/tether.js',
  'node_modules/bootstrap/dist/js/bootstrap.js',
  'node_modules/angular-ui-bootstrap/index.js',
  'node_modules/jquery/dist/jquery.js',
  'node_modules/geocomplete/jquery.geocomplete.js',
  'node_modules/gmap3/dist/gmap3.js',
  'node_modules/owlcarousel/owl-carousel/owl.carousel.js',
  'node_modules/jstz/index.js',
  'node_modules/api-check/dist/api-check.js',
  'node_modules/jquery-datetimepicker/jquery.datetimepicker.js'
  // 'node_modules/php-date-formatter/js/php-date-formatter.js'
];

const CSS_DEPENDENCIES = [
  'node_modules/jquery-datetimepicker/jquery.datetimepicker.css',
  'app/assets/libraries/font-awesome/css/font-awesome.css',
  'app/assets/libraries/entypo/style.css',
  'app/assets/css/animate.min.css',
  'app/assets/libraries/owl-carousel/owl.carousel.min.css',
  'app/assets/libraries/owl-carousel/owl.carousel.default.css'
];

const PATHS = {
  sass: [`${DIRS.src}/scss/eve.scss`,],
  js: [`${DIRS.src}/js/*.js`, `${DIRS.src}/js/**/*.js`],
  html: [`${DIRS.src}/templates/*.html`, `${DIRS.src}/templates/**/*.html`]
};

// Handle sass changes.
gulp.task('sass', () => {
  return gulp.src(PATHS.sass)
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass())
    .pipe(plugins.concat('css/main.min.css'))
    .pipe(plugins.cleanCss())
    .pipe(plugins.sourcemaps.write(`../${DIRS.dest}`))
    .pipe(gulp.dest(DIRS.dest))
    .pipe(browserSync.stream({match: '**/*.css'}))
    .on('end', () => {
      gulp
        .src(CSS_DEPENDENCIES)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.cleanCss())
        .pipe(plugins.concat('css/libs.min.css'))
        .pipe(plugins.sourcemaps.write(`../${DIRS.dest}`))
        .pipe(gulp.dest(DIRS.dest))
        .pipe(browserSync.stream({match: '**/*.css'}));
    })
    .on('error', (error) => {
      console.log(error);
    });
});

// Handle html changes.
gulp.task('html', () => {
  return gulp.src(PATHS.html)
    .pipe(gulp.dest(`${DIRS.dest}/templates`))
    .pipe(browserSync.stream({match: '**/*.html'}));
});

// Handle assets changes.
gulp.task('assets', () => {
  return gulp.src(`${DIRS.src}/assets/**`)
    .pipe(gulp.dest(`${DIRS.dest}/assets`));
});

// Minify js
gulp.task('minifyJS', () => {
  return gulp
    .src(PATHS.js)
    .pipe(plugins.concat(DIRS.js.app))
    .pipe(plugins.babel())
    .pipe(plugins.uglify())
    .pipe(gulp.dest(DIRS.dest))
    .on('end', () => {
      gulp
        .src(JS_DEPENDENCIES)
        .pipe(plugins.concat(DIRS.js.libs))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(DIRS.dest))
        .on('error', (error) => {
          console.log(error);
        });
    }).on('error', (error) => {
      console.log(error);
    });
});

// Start the development sever task.
gulp.task('server', () => {
  browserSync({
    notify: false,
    server: DIRS.dest,
    tunnel: 'angularseedes6',
    browser: 'google-chrome',
    port: 8000
  });
});

// Task for watching file changes and livereloading the development server.
gulp.task('watch', cb => {
  sequence(['sass', 'browserify', 'html', 'assets'], 'revision', ['server', 'watching'], cb);
});

gulp.task('watching', () => {
  gulp.watch(PATHS.sass, ['sass']);
  gulp.watch(PATHS.html, ['html']);
});

// Gulp default task.
gulp.task('default', ['watch']);

gulp.task('revision', () => {
  return gulp.src(`${DIRS.src}/index.html`)
    .pipe(gulp.dest(DIRS.dest))
    .pipe(plugins.revAppend())
    .pipe(gulp.dest(DIRS.dest));
});

gulp.task('minifyHTML', function() {
  return gulp.src(PATHS.html)
    .pipe(plugins.htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(`${DIRS.dest}/templates`));
});

gulp.task('eslint', () => {
  return gulp.src(PATHS.js)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failAfterError());
});

gulp.task('test', () => {
  console.log('TODO test');
});

// Build command
gulp.task('build', cb => {
  isProd = true;
  sequence(['sass', 'browserify', 'minifyHTML', 'assets'], 'revision', cb);
});

// Based on: http://blog.avisi.nl/2014/04/25/how-to-keep-a-fast-build-with-browserify-and-reactjs/

function buildScript(file) {
  const shouldCreateSourcemap = true;
  let bundler = browserify({
    entries: ['./app/js/' + file],
    debug: shouldCreateSourcemap,
    cache: {},
    packageCache: {},
    fullPaths: true
  });

  if (!isProd) {
    bundler = watchify(bundler);

    bundler.on('update', rebundle);
  }

  const transforms = [
    {name: 'browserify-css', options: {}},
    { name: babelify, options: {}},
    { name: debowerify, options: {}},
    // { name: ngAnnotate, options: {}},
    { name: 'brfs', options: {}},
    { name: 'bulkify', options: {}}
  ];

  transforms.forEach(function(transform) {
    bundler.transform(transform.name, transform.options);
  });

  function rebundle() {
    const stream = bundler.bundle();
    const sourceMapLocation = '';

    function handleErrors(error) {
    	console.log("Error", error);
    }

    return stream
      .on('error', handleErrors)
      // .on('end', handleEnd)
      .pipe(source(file))
      .pipe(gulpif(shouldCreateSourcemap, buffer()))
      .pipe(gulpif(shouldCreateSourcemap, sourcemaps.init({ loadMaps: true })))
      .pipe(gulpif(isProd, streamify(plugins.uglify({
        compress: { drop_console: true } // eslint-disable-line camelcase
      }))))
      .pipe(gulpif(shouldCreateSourcemap, sourcemaps.write(sourceMapLocation)))
      .pipe(gulp.dest(DIRS.dest))
      .pipe(browserSync.stream());
  }

  return rebundle();
}

gulp.task('browserify', function() {
  return buildScript('app.js');
});
