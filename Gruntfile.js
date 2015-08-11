module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    develop: {
      server: {
        file: 'app.js'
      }
    },
    watch: {
      options: {
        nospawn: true
      },
      js : {
        files: [
          'app.js',
          'app/**/*.js',
          'config/*.js',
          'build/**/*.js'
        ]
      },
      css: {
        files: [
          'public/css/*/css',
          'build/**/*.css'
        ]
      },
      views: {
        files: [
          'app/views/*.jade',
          'app/views/**/*.jade'
        ]
      }
    },
    copy: {
      build: {
        cwd: 'public',
        src: [
          'js/*.js',
          'css/*.css',
          'img/*.png'
        ],
        dest: 'build',
        expand: true
      },
      bower: {
        cwd: 'public/components/',
        src: ['**'],
        dest: 'build',
        expand: true
      },
    },
    clean: {
      build: {
        src: ['build']
      },
    },
    uglify: {
      build: {
        options: {
          mangle: false,
          compress: {
            drop_console: true
          }
        },
        files: {
          'build/js/app.min.js': ['build/js/*.js']
        }
      }
    },
    cssmin: {
      build: {
        files: {
          'build/css/style.min.css': ['build/css/*.css']
        }
      }
    },
    jshint: {
      files: ['public/js/*.js'],
      options: {
        scripturl: true
      }
    },
    csslint: {
      src: ['public/css/*.css'],
      options: {

      }
    },
  });

  grunt.registerTask('default', [
    'develop',
    'watch'
  ]);

  grunt.registerTask('build', ['clean', 'copy']);
  grunt.registerTask('lint', ['jshint', 'csslint']);
};
