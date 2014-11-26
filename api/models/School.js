'use strict';

/**
 * Schools
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    // This has to be English
    name: {
      type: 'string',
      required: true
    },

    type: {
      type: 'string',
      enum: ['university', 'school', 'institute', 'etc'],
      required: true
    },

    // One-to-many
    courses: {
      collection: 'Course',
      via: 'school'
    },

    // One-to-many
    users: {
      collection: 'UserSchool',
      via: 'school'
    }
  }
};
