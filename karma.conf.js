// Karma configuration

module.exports = function(config) {
    var APP_ROOT_PATH = 'app/';
    var NODE_MODULES_ROOT_PATH = 'node_modules/';

    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            /* External dependencies */
            NODE_MODULES_ROOT_PATH + 'angular/angular.min.js',
            NODE_MODULES_ROOT_PATH + 'angular-animate/angular-animate.min.js',
            NODE_MODULES_ROOT_PATH + 'angular-aria/angular-aria.min.js',
            NODE_MODULES_ROOT_PATH + 'angular-bind-html-compile-ci-dev/angular-bind-html-compile.js',
            NODE_MODULES_ROOT_PATH + 'angular-material/angular-material.min.js',
            NODE_MODULES_ROOT_PATH + 'angular-messages/angular-messages.min.js',
            NODE_MODULES_ROOT_PATH + 'angular-mocks/angular-mocks.js',
            NODE_MODULES_ROOT_PATH + 'angular-ui-router/release/angular-ui-router.min.js',
            NODE_MODULES_ROOT_PATH + 'otus-model-js/dist/otus-model-min.js',
            NODE_MODULES_ROOT_PATH + 'otus-model-js/dist/st-utils-min.js',

            APP_ROOT_PATH + 'app.js',
            APP_ROOT_PATH + '**/*-module.js',
            APP_ROOT_PATH + '**/*.js', {
                pattern: 'tests/unit/**/*-spec.js',
                included: true
            }
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {},

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'html'],

        htmlReporter: {
            outputFile: 'unit-result.report.html',
            //Optional
            pageTitle: 'Unit Tests'
        },
        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    });

};
