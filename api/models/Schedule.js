/**
* Schedules.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    course: {
      model: 'Course',
      index: true
    },

    weekday: {
      type: 'string',
      required: true,
      enum: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    },

    time: {
      type: 'string',
      required: true
    },

    timezone: {
      type: 'string',
      required: true
    },

    alarms: {
      collection: 'AttendanceAlarm',
      via: 'schedule'
    },

    toJSON: function () {
      var obj = this.toObject();

      delete obj.createdAt;
      delete obj.updatedAt;
      delete obj.alarms;

      return obj;
    },

    toWholeObject: function () {
      var json = JSON.stringify(this),
          obj = JSON.parse(json);

      obj.createdAt = this.createdAt;
      obj.updatedAt = this.updatedAt;
      obj.alarms = this.alarms;

      return obj;
    }
  }
};
