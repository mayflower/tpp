module.exports = function(config) {
    config.set({
        // your config
        frameworks: ["jasmine"],
        files: [
            'app/bower_components/angular/angular.js',
            'app/bower_components/angular-mocks/angular-mocks.js',
            'app/bower_components/angular-resource/angular-resource.js',
            'app/bower_components/angular-route/angular-route.js',
            'app/bower_components/momentjs/moment.js',
            'app/bower_components/momentjs/min/lang/de.js',
            'app/bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls.js',
            'app/scripts/*.js',
            'app/scripts/**/*.js',
            'test/mock/**/*.js',
            'test/spec/**/*.js'
        ],
        preprocessors: {
            'app/scripts/**/*.js': 'coverage'
        },
        reporters: ['progress', 'coverage', 'junit'],
        coverageReporter: {
            type: 'html',
            dir: 'build/coverage/'
        },
        junitReporter: {
            outputFile: 'build/karma-unit.xml',
            suite: 'unit'
        },
        port: 8080,
        runnerPort: 9100,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['PhantomJS'],
        captureTimeout: 5000,
        reportSlowerThan: 500
    });
};

// base path, that will be used to resolve files and exclude
//basePath = '';

// list of files to exclude
//exclude = [];

//if (process.env.USER == 'jenkins') {
//    coverageReporter = {
//        type: 'cobertura',
//        dir: 'build'
//    };
//}

// Continuous Integration mode
// if true, it capture browsers, run tests and exit
//singleRun = true;
