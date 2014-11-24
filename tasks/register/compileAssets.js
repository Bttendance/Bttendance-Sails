'use strict';

module.exports = function (grunt) {
  grunt.registerTask('compileAssets', [
    'clean:dev',
    'jshint:dev',
    'jst:dev',
    'less:dev',
    'copy:dev',
    'coffee:dev'
  ]);
};
