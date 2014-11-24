'use strict';

/**
* Runs the JSHint linter against project JavaScript files
*
* ---------------------------------------------------------------
*
* For usage docs see:
* 		https://github.com/gruntjs/grunt-contrib-hint
*
*/

module.exports = function (grunt) {

  // Make sure code styles are up to par and there are no obvious mistakes
  grunt.config.set('jshint', {
    options: {
      jshintrc: '.jshintrc',
      reporter: require('jshint-stylish')
    },
    dev: {
      src: [
      'Gruntfile.js',
      'api/**/*.js',
      'test/**/*.js'
      ]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
};
