/**
 * Courses
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    name: {
      type: 'string',
      required: true
    },

    professor_name: {
      type: 'string',
      required: true
    },

    // One to Many
    school: {
    	model: 'Schools',
      index: true
    },

    // Many to Many
    managers: {
    	collection: 'Users',
    	via: 'supervising_courses'
    },
    
    // Many to Many
    students: {
    	collection: 'Users',
    	via: 'attending_courses'
    },

    // One to Many
    posts: {
    	collection: 'Posts',
    	via: 'course'
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

    // Many to One
    questions: {
      collection: 'ClickerQuestions',
      via: 'course'
    },

    beginDate: {
      type: 'date'
    },

    endDate: {
      type: 'date'
    },

    schedules: {
      collection: 'Schedules',
      via: 'course'
    },

    alarms: {
      collection: 'AttendanceAlarms',
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
      obj.beginDate = this.beginDate;
      obj.endDate = this.endDate;
      obj.schedules = this.schedules;
      obj.alarms_count = this.alarms.length;
      return obj;
    }
    
  }

};
