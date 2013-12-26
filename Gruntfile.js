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
                tasks: 'uglify:dist'
            },
            img: {
                files: 'images/*.{png, jpg, jpeg, gif}',
                tasks: 'imagemin:dist'
            }
        },

        imagemin: {
            dist: {
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
            dist: {
                options: {
                    browsers:['last 2 versions', 'ie 8', 'ie 7']  
                },
                files: {
                    'style.css': ['style.css']
                }
            }
        },

        uglify: {
            dist: {
                options: {
                    mangle: true,
                    compress: true,
                    report: 'gzip'
                },
                files: {
                    'js/script.min.js': 'js/script.js'
                }
            }
        },

        less: {
            dist: { 
                options: {
                    syncImport: true,
                    report: 'gzip'
                },
                files: {
                    'style.css': 'less/style.less'
                }
            }
        },

        cssmin: {
            dist: {
                options: {
                    keepSpecialComments: "*",
                    report: 'gzip',
                },
                files: {
                    'style.css': 'style.css'    
                }
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
            'imagemin:dist',
            'rsync'
        ]); 
    });

    // deploy to ftp :D !
    grunt.registerTask('ftp', function() {
        grunt.task.run([
            'ftp-deploy:build'
        ]);
    });



};
