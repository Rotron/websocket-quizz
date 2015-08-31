module.exports = function (grunt) {
    'use strict';

    // var path = require("path");

    // Load NPM tasks
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks("grunt-bower-install-simple");

    // Init GRUNT configuraton
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        'bower-install-simple': {
            options: {
                color:       true,
                production:  false,
                directory:   "bower_components"
            }
        },
        less: {
            development: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2
                },
                files: {
                    "client_mobile/prod/styles.css": "client_mobile/dev/less/**/*.less",
                    "client_display/prod/styles.css": "client_display/prod/less/**/*.less",
                }
            }
        },
        requirejs: {
            compile_mobile: {
                options: {
                    name: 'app',
                    baseUrl: "client_mobile/dev/js",
                    out: "client_mobile/prod/app.js",
                    preserveLicenseComments: false,
                    optimize: "uglify", //"uglify",
                    include: ["requireLib"],
                    paths: {
                        "requireLib": '../../../bower_components/requirejs/require',
                        "text": '../../../bower_components/requirejs-text/text',
                        "domReady": '../../../bower_components/domReady/domReady',
                        "domManager": '../../../commons/domManager/domManager',
                        "utils": '../../../commons/utils'
                    },
                }
            }/*,
            compile_display: {
                options: {
                    name: 'app',
                    baseUrl: "client_display/dev/js",
                    out: "client_display/prod/app.js",
                    preserveLicenseComments: false,
                    optimize: "uglify", //"uglify",
                    include: ["requireLib"],
                    paths: {
                        "requireLib": '../../../bower_components/requirejs/require',
                        "text": '../../../bower_components/requirejs-text/text'
                    },
                }
            }
*/        },
        watch: {
            scripts: {
                files: ['client_mobile/dev/**/*.*'/*, 'client_display/dev/** /*.*'*/],
                tasks: ['build'],
            },
        }
    });

    grunt.registerTask("bower-install", [ "bower-install-simple" ]);

    // Build
    grunt.registerTask('build', [
        'bower-install',
        'less',
        'requirejs'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);
};