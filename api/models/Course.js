'use strict';

/**
 * Course
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    // One-to-many
    school: {
      model: 'School',
      index: true
    },

    name: {
      type: 'string',
      required: true
    },

    instructor: {
      type: 'string',
      required: true
    },

    code: {
      type: 'string',
      required: true,
      unique:true
    },

    opened: {
      type: 'boolean',
      required: true,
      defaultsTo: true
    },

    // One-to-many
    users: {
      collection: 'UserCourse',
      via: 'course'
    },

    studentsCount: {
      type: 'integer',
      required: true,
      defaultsTo: 0
    },

    information: {
      type: 'string'
    },

    beginDate: {
      type: 'date'
    },

    endDate: {
      type: 'date'
    },

    // One-to-many
    schedules: {
      collection: 'Schedule',
      via: 'course'
    },

    // One-to-many
    alarms: {
      collection: 'AttendanceAlarm',
      via: 'course'
    },

    // One-to-many
    clickerSets: {
      collection: 'ClickerSet',
      via: 'course'
    }

  }

};
