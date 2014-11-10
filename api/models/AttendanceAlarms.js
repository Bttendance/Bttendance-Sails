/**
* AttendanceAlarms.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

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

    // One Way
    author: {
      model: 'Users'
    },

    // One to Many
		course: {
      model: 'Courses',
      index: true
		},

    schedule: {
      model: 'Schedules',
      index: true
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

