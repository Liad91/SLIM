'use strict';

/** Gulp and gulp plugins */
const gulp = require('gulp');
const sass = require('gulp-sass');
const image = require('gulp-image');
const uglify = require('gulp-uglify');
const eslint = require('gulp-eslint');
const gulpif = require('gulp-if');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const del = require('del');

/** Settings and paths */
const settings = new class Settings {
  constructor() {
    this.src = 'src/';
    this.bower = 'bower_components/';
    this.dist = 'dist/';

    this.env = process.env.NODE_ENV || 'development';

    this.dest = {
      scripts: this.dist + 'js',
      styles: this.dist + 'css',
      fonts: this.dist + 'fonts',
      images: this.dist + 'images'
    };

    this.libraries = {
      angular: this.bower + 'angular/',
      ngCookies: this.bower + 'angular-cookies/',
      ngRoute: this.bower + 'angular-route/',
      ngAnimate: this.bower + 'angular-animate/',
      ngMessages: this.bower + 'angular-messages/',
      jquery: this.bower + 'jquery/',
      tether: this.bower + 'tether/',
      noty: this.bower + 'noty/',
      bootstrap: this.bower + 'bootstrap/',
      fontAwesome: this.bower + 'font-awesome/',
      animate: this.bower + 'animate.css/'
    };

    this.js = {
      libs: {
        angular: this.libraries.angular + 'angular.js',
        ngCookies: this.libraries.ngCookies + 'angular-cookies.js',
        ngRoute: this.libraries.ngRoute + 'angular-route.js',
        ngAnimate: this.libraries.ngAnimate + 'angular-animate.js',
        ngMessages: this.libraries.ngMessages + 'angular-messages.js',
        jquery: this.libraries.jquery + 'dist/jquery.min.js',
        bootstrap: {
          util: this.libraries.bootstrap + 'js/dist/util.js',
          dropdown: this.libraries.bootstrap + 'js/dist/dropdown.js'
        },
        noty: this.libraries.noty + 'js/noty/jquery.noty.js',
      },
      app: {
        files: this.src + 'javascripts/**/*.js',
        main: this.src + 'javascripts/app.js',
        routes: this.src + 'javascripts/routes.js',
        init: this.src + 'javascripts/init.js',
        animation: this.src + 'javascripts/animation.js',
        controllers: this.src + 'javascripts/controllers/*.js',
        services: this.src + 'javascripts/services/*.js',
        directives: this.src + 'javascripts/directives/**/*.js',
        filters: this.src + 'javascripts/filters/*.js'
      }
    };

    this.styles = {
      files: this.src + 'scss/**/*.scss',
      bootstrap: this.libraries.bootstrap + 'scss',
      fontAwesome: this.libraries.fontAwesome + 'scss',
      app: this.src + 'scss/app.scss'
    };

    this.fonts = {
      fontAwesome: this.libraries.fontAwesome + 'fonts/*'
    };
  }
};

/** Concat all the styles into one file */
gulp.task('dist-css', () => {
  const config = {
    includePaths: [settings.styles.bootstrap, settings.styles.fontAwesome]
  };

  if (settings.env === 'production') {
    config.outputStyle = 'compressed';
  }

  return gulp.src(settings.styles.app)
    .pipe(gulpif(settings.env === 'development', sourcemaps.init()))
    .pipe(sass(config).on('error', sass.logError))
    .pipe(gulpif(settings.env === 'development', sourcemaps.write('.')))
    .pipe(gulp.dest(settings.dest.styles));
});

/** Concat all the scripts into one file */
gulp.task('dist-libs-js', () => {
  return gulp.src([
    settings.js.libs.angular,
    settings.js.libs.ngRoute,
    settings.js.libs.ngCookies,
    settings.js.libs.ngAnimate,
    settings.js.libs.ngMessages,
    settings.js.libs.jquery,
    settings.js.libs.bootstrap.util,
    settings.js.libs.bootstrap.dropdown,
    settings.js.libs.noty
  ])
    .pipe(gulpif(settings.env === 'development', sourcemaps.init()))
    .pipe(concat('libs.min.js'))
    .pipe(gulpif(settings.env === 'production', uglify()))
    .pipe(gulpif(settings.env === 'development', sourcemaps.write('.')))
    .pipe(gulp.dest(settings.dest.scripts));
});

/** Concat all the scripts into one file */
gulp.task('dist-app-js', () => {
  return gulp.src([
    settings.js.app.main,
    settings.js.app.routes,
    settings.js.app.init,
    settings.js.app.animation,
    settings.js.app.controllers,
    settings.js.app.services,
    settings.js.app.directives,
    settings.js.app.filters
  ])
    .pipe(eslint())
    .pipe(eslint.format())
		.pipe(eslint.failAfterError())
    .pipe(gulpif(settings.env === 'development', sourcemaps.init()))
    .pipe(babel({
      "presets": [
        ["env", {
          "targets": {
            "browsers": ["last 2 versions", "safari >= 7"]
          }
        }]
      ]
    }))
    .on('error', function(err) {
      console.log(err.fileName + ( err.loc ? `( ${err.loc.line}, ${err.loc.column} ): ` : ': '));
      console.log(`Babel error: ${err.message} \n`);
      console.log(err.codeFrame);

      this.emit('end');
    })
    .pipe(concat('app.min.js'))
    .pipe(gulpif(settings.env === 'production', uglify()))
    .pipe(gulpif(settings.env === 'development', sourcemaps.write('.')))
    .pipe(gulp.dest(settings.dest.scripts));
});

/** Move the font awesome fonts to dist directory */
gulp.task('dist-icons', () => {
  return gulp.src(settings.fonts.fontAwesome)
    .pipe(gulp.dest(settings.dest.fonts));
});

/** Optimize all images and move them to dist directory */
gulp.task('dist-images', () => {
  return gulp.src(settings.src + 'images/*')
    .pipe(image({
      svgo: false,
      pngquant: false
    }))
    .pipe(gulp.dest(settings.dest.images));
});

/** Watch for changes in .js and .scss files */
gulp.task('watch', () => {
  gulp.watch(settings.js.app.files, ['dist-app-js']);
  gulp.watch(settings.styles.files, ['dist-css']);
});

/** Delete dist directory */
gulp.task('clean:dist', () => {
  return del('dist');
});

/** Run all build tasks after the clean task */
gulp.task('build', ['clean:dist'], () => {
  return gulp.start('dist-css', 'dist-libs-js', 'dist-app-js', 'dist-icons', 'dist-images');
});

/** Set buil task as a default task */
gulp.task('default', ['build']);

module.exports = gulp;