/**
* AttendanceAlarms.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    // One Way
    author: {
    	model: 'Users'
    },

    scheduledAt: {
      type: 'date',
    },

    on: {
      type: 'boolean',
      required: true,
      defaultsTo: true
    },

    // One Way
		course: {
			model: 'Courses'
		},

    toJSON: function() {
      var obj = this.toObject();
      delete obj.createdAt;
      delete obj.updatedAt;
      delete obj.course;
      return obj;
    },

    toWholeObject: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      obj.createdAt = this.createdAt;
      obj.updatedAt = this.updatedAt;
      obj.course = this.course;
      return obj;
    }
  }
};

