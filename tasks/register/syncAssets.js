'use strict';

module.exports = function (grunt) {
  grunt.registerTask('syncAssets', [
    'jshint:dev',
    'jst:dev',
    'less:dev',
    'sync:dev',
    'coffee:dev'
  ]);
};
