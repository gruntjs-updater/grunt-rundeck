module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                'tests/**/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        'rundeck': {
            options: {
              rundeck: 'http://127.0.0.1:8888',
              apiVersion: 12,
              token: 'E4rNvVRV378knO9dp3d73O0cs1kd0kCd'
            },
            'deploy': {
                options: {
                    job: 'succeed',
                    params: {
                      foo: 'bar'
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.registerTask('test', ['jshint', 'start-server', 'rundeck', 'kill-server']);
    grunt.registerTask('default', ['test']);
    grunt.loadTasks('tasks');
    grunt.loadTasks('tests/tasks');
};
