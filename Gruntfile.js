module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        babel: {
            options: {
                sourceMap: false,
                modules: "common"
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: ['**/*.js'],
                    dest: 'build/src',
                    ext: '.js'
                }]
            }
        },

        jshint: {
            files: ["*.js", "libs/*.js", "test/*.js"],
            options: {
                esnext: true,
                globals: {
                    jQuery: true
                }
            }
        },

        watch: {
            scripts: {
                files: ["*.js", "libs/*.js", "test/*.js"],
                tasks: ["jshint"]
            }
        }
    });

    grunt.registerTask('default', ['jshint']);
};
