/**
* AttendanceAlarms.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    // One to Many
    course: {
      model: 'Course',
      index: true
    },

    // One to Many
    schedule: {
      model: 'Schedule',
      index: true
    },

    // One Way
    author: {
      model: 'User'
    },

    type: {
      type: 'string',
      enum: ['schedule', 'manual'],
      required: true
    },

    scheduledAt: {
      type: 'date',
      required: true
    },

    on: {
      type: 'boolean',
      required: true,
      defaultsTo: true
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.createdAt;
      delete obj.updatedAt;
      delete obj.course;
      delete obj.schedule;
      return obj;
    },

    toWholeObject: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      obj.createdAt = this.createdAt;
      obj.updatedAt = this.updatedAt;
      obj.course = this.course;
      obj.schedule = this.schedule;
      return obj;
    }
  }
};

