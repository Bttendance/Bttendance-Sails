/**
 * Courses
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    // One to Many
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

    // One to Many
    managers: {
    	collection: 'SupervisingCourse',
    	via: 'course'
    },
    
    // One to Many
    students: {
    	collection: 'AttendingCourse',
    	via: 'course'
    },

    // One to Many
    posts: {
    	collection: 'Post',
    	via: 'course'
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

    schedules: {
      collection: 'Schedule',
      via: 'course'
    },

    alarms: {
      collection: 'AttendanceAlarm',
      via: 'course'
    },

    // One to Many
    questions: {
      collection: 'ClickerQuestion',
      via: 'course'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.createdAt;
      delete obj.updatedAt;
      delete obj.managers;
      delete obj.students;
      delete obj.posts;
      delete obj.questions;
      delete obj.information;
      delete obj.beginDate;
      delete obj.endDate;
      delete obj.schedules;
      delete obj.alarms;
      return obj;
    },

    toWholeObject: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      obj.createdAt = this.createdAt;
      obj.updatedAt = this.updatedAt;
      obj.managers = this.managers;
      obj.students_count = this.students.length;
      obj.posts_count = this.posts.length;
      obj.questions_count = this.questions.length;
      obj.information = this.information;
      obj.beginDate = this.beginDate;
      obj.endDate = this.endDate;
      obj.schedules = this.schedules;
      obj.alarms_count = this.alarms.length;
      return obj;
    }
    
  }

};
