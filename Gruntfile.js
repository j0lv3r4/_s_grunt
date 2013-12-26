module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            options: {
                livereload: true,
                files: '*/*'
            },
            css: {
                files: 'less/*.less',
                tasks: ['less', 'autoprefixer', 'cssmin']
            },
            js: {
                files: 'js/script.js',
                tasks: 'uglify'
            },
            img: {
                files: 'images/*.{png, jpg, jpeg, gif}',
                tasks: 'imagemin'
            }
        },

        imagemin: {
            target: {
                options: {
                    optimizationLevel: 7,
                    progressive: true
                },
                files: [{
                    expand: true,
                    cwd: 'images/',
                    src: '*.{png,jpg,jpeg,gif}',
                    dest: 'theme/images'
                }]
            }
        },

        autoprefixer: {
            options: {
                browsers:['last 2 versions', 'ie 8', 'ie 7']
            },
            target: {
                src: 'style.css',
                dest: 'style.css'
            }
        },

        uglify: {
            options: {
                mangle: true,
                compress: true,
                report: 'gzip'
            },
            target: {
                src: 'js/script.js',
                dest: 'js/script.min.js'
            }
        },

        less: {
            options: {
                syncImport: true,
                report: 'gzip'
            },
            target: {
                src: 'less/style.less',
                dest: 'style.css'
            }
        },

        cssmin: {
            options: {
                keepSpecialComments: "*",
                report: 'gzip',
            },
            target: {
                src: 'style.css',
                dest: 'style.css'
            }
        },
        
        rsync: {
            options: {
                args: ["--verbose"],
                exclude: [".git*", "node_modules", "less", "*.less", "*.md", "*~", "*.swp", "theme", ".*", "package.json", "Gruntfile.js"],
                recursive: true
            },

            dist: {
                options: {
                    src: "./",
                    dest: "../theme"
                }
            }
        },
        'ftp-deploy': {
            build: {
                auth: {
                    host: '',
                    port: '',
                    authKey: 'key1'
                },
                src: 'theme',
                dest: 'public_html/',
                exclusions: ['theme/admin']
            }
        }
    });

    // load plugins
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // default task(s)
    grunt.registerTask('default', function() {
        grunt.task.run([
            'watch'
        ]);
    });

    grunt.registerTask('build', function() {
        grunt.task.run([
            'rsync',
            'imagemin:dist'
        ]);
    });

    // deploy to ftp :D !
    grunt.registerTask('ftp', function() {
        grunt.task.run([
            'ftp-deploy:build'
        ]);
    });
};
