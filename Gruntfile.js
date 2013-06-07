module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            server: {
                options: {
                    port: 8000,
                    base: '.'
                }
            }
        },
        karma: {
            options: {
                basePath: '.',
                proxies: {
                    '/src': 'http://localhost:8000/src',
                    '/components': 'http://localhost:8000/components',
                    'src': 'http://localhost:8000/src',
                    'components': 'http://localhost:8000/components'
                },
                singleRun: true,
                autoWatch: false,
                logLevel: 'info'
            },
            "e2e-dev": {
                options: {
                    files: [
                        'node_modules/karma/adapter/lib/angular-scenario.js',
                        'node_modules/karma/adapter/angular-scenario.js',
                        //watch for reload but do not include into html
                        {pattern: 'components/**/*.js', included: false},
                        {pattern: 'src/**/*.html', included: false},
                        'src/**/*.js',
                        'test/e2e/**/*.js'
                    ],
                    browsers: ['PhantomJS', 'Chrome'],
                    singleRun: false,
                    autoWatch: true
                }
            },
            "unit-dev": {
                options: {
                    files: [
                        'node_modules/karma/adapter/lib/jasmine.js',
                        'node_modules/karma/adapter/jasmine.js',
                        //watch for reload but do not include into html
                        {pattern: 'components/**/*', included: false},
                        {pattern: 'src/**/*.html', included: false},
                        'src/**/*.js',
                        'test/unit/**/*.js'
                    ],
                    browsers: ['PhantomJS'],
                    singleRun: false,
                    autoWatch: true
                }
            }
        },
        mkdir: {
            all: { options: { create: ['src', 'test/e2e', 'test/unit'] } }
        }
    });


    // Default task(s).
    grunt.registerTask('test:unit-dev', ['connect:server', 'karma:unit-dev']);
    grunt.registerTask('test:e2e-dev',  ['connect:server', 'karma:e2e-dev']);

    grunt.registerTask('setup', ['mkdir:all']);


    // Load the plugins provided by npm
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-mkdir');
    grunt.loadNpmTasks('grunt-contrib-connect');
};