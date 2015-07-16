'use strict';
module.exports = function(grunt) {

  grunt.initConfig({
    clean: {
      build: {
        src: ['documentation']
      }
    },
    jsdoc: {
      dist: {
        src: ['modules/*'],
        options: {
          destination: 'documentation'
        }
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'modules/**/*.js'],
      options: {
        reporter: require('jshint-stylish'),
        jshintrc:true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['jshint']);

  grunt.registerTask('doc', ['clean','jsdoc']);
};
