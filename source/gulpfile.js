(function () {
  //
  // var baseDir = __dirname + '/app/index.html';

  var gulp = require('gulp');
  var browserSync = require('browser-sync').create();
  var browserSyncSpa = require('browser-sync-middleware-spa');
  var sonar = require('gulp-sonar');
  var bump = require('gulp-bump');
  var replace = require('gulp-replace');
  var packageJson = require('./package.json');
  var useref = require('gulp-useref');
  var gulpif = require('gulp-if');
  var uglify = require("gulp-uglify");
  var minifyCss = require('gulp-minify-css');
  var embedTemplates = require('gulp-angular-embed-templates');
  var babel = require('gulp-babel');
  var runSequence = require('run-sequence');
  var gulp_if = require('gulp-if');
  var clean = require('gulp-clean');
  var uncache = require('gulp-uncache');
  var jeditor = require('gulp-json-editor');

  gulp.task('compress', function () {
    runSequence('clean_dist', 'copy_code','copy_manifest', 'copy_sw', 'embeded_template', 'copy_node_modules', 'compress-hash');
  });

  gulp.task('copy_code', function () {
    return gulp.src('./app/**/*')
      .pipe(gulp_if('*.html', replace('src="app/', 'src="')))
      .pipe(gulp_if('*.html', replace('href="app/', 'href="')))
      .pipe(gulp.dest('dist/survey-player'));
  });

  gulp.task('copy_manifest', function () {
    return gulp.src('./manifest.json')
      .pipe(replace('app/', ''))
      .pipe(jeditor(function (json) {
        json.start_url =String(process.env.URL || '/');
        return json;
      }))
      .pipe(gulp.dest('dist/survey-player'));
  });

  gulp.task('copy_sw', function () {
    return gulp.src('./sw.js')
      .pipe(replace('/app/', '/'))
      .pipe(gulp.dest('dist/survey-player'));
  });

  gulp.task('compress-hash', function () {
    return gulp.src('dist/survey-player/index.html')
      .pipe(uncache({
        append: 'hash',
        rename: true,
        srcDir: 'dist/survey-player',
        distDir: 'dist/survey-player'
      }))
      .pipe(gulp.dest('dist/survey-player'));
  });

  gulp.task('embeded_template', function () {
    return gulp.src('./dist/survey-player/**/*')
      .pipe(gulp_if('*.js', embedTemplates({
        basePath: '.'
      })))
      .pipe(gulp.dest('dist/survey-player'));
  });

  gulp.task('copy_node_modules', function () {
    return gulp.src('./node_modules/**/*')
      .pipe(gulp.dest('dist/survey-player/node_modules'));
  });

  gulp.task('clean_dist', function () {
    return gulp.src('dist/', {read: false})
      .pipe(clean());
  });


  gulp.task('compress-compress', function () {
    return gulp.src('app/index.html', {allowEmpty: true})
      .pipe(useref({
        transformPath: function (filePath) {
          return filePath.replace('app/', '');
        }
      }))
      .pipe(gulpif('*.js',
        babel({
          presets: ['es2015']
        })
      ))
      // .pipe(gulpif('*.js', embedTemplates({
      //   basePath: __dirname + '/'
      // })))
      .pipe(gulpif('*.js', uglify()))
      .pipe(gulpif('*.css', minifyCss()))
      .pipe(gulp.dest('dist/survey-player/'));
  });

  gulp.task('browser-sync', function () {
    var activityUrl = process.env.ACTIVITY_URL || "http://localhost:51002/otus-rest/v01/activities";
    var datasourceUrl = process.env.DATASOURCE_URL || "http://localhost:51002/otus-rest/v01/configuration/datasources";
    var fileuploadUrl = process.env.FILEUPLOAD_URL || "http://localhost:51002/otus-rest/v01/upload";
    var staticvariableUrl = process.env.STATICVARIABLE_URL || "http://localhost:51002/otus-rest/v01/static-variable";
    var loginUrl = process.env.LOGIN_URL || "http://localhost:51002/otus-rest/v01/authentication";
    var surveyUrl = process.env.SURVEY_URL || "http://localhost:51002/otus-rest/v01/configuration/surveys";
    var collectUrl = process.env.COLLECT_URL || "http://localhost:51002/otus-rest/v01/offline/activities/collection";
    browserSync.init({
      server: {
        open: 'external',
        baseDir: ['./app', './'],
        middleware: [
          //browserSyncSpa(/^[^\.]+$/, baseDir),

          function (req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', '*');
            res.setHeader('Set-Cookie', ['Activity-Address=' + activityUrl + ';path=/',
              'Datasource-Address=' + datasourceUrl + ';path=/',
              'FileUpload-Address=' + fileuploadUrl + ';path=/',
              'Login-Address=' + loginUrl + ';path=/',
              'Survey-Address=' + surveyUrl + ';path=/',
              'Collect-Address=' + collectUrl + ';path=/',
              'StaticVariable-Address=' + staticvariableUrl + ';path=/']);
            next();
          }
        ]
      },
      port: process.env.PORT || 51001
    });

    gulp.watch([
      'app/**/*.html',
      'app/**/*.js',
      'app/**/*.json',
      'app/**/*.css'
    ]).on('change', browserSync.reload);
  });

  gulp.task('upgrade-version', function (value) {
    gulp.src('./package.json')
      .pipe(bump({
        version: process.env.npm_config_value
      }))
      .pipe(gulp.dest('./'));
  });

  gulp.task('sonar', function () {
    var options = {
      sonar: {
        host: {
          url: process.env.npm_config_sonarUrl,
        },
        login: process.env.npm_config_sonarDatabaseUsername,
        password: process.env.npm_config_sonarDatabasePassword,
        projectKey: 'sonar:survey-player',
        projectName: 'survey-player',
        projectVersion: packageJson.version,
        sources: 'app',
        language: 'js',
        sourceEncoding: 'UTF-8',
        exec: {
          maxBuffer: 1024 * 1024
        },
        javascript: {
          lcov: {
            reportPath: 'target/test-coverage/report-lcov/lcov.info'
          }
        }
      }
    };

    return gulp.src('thisFileDoesNotExist.js', {
      read: false
    })
      .pipe(sonar(options));
  });


}());
