/**
* AttendingCourse.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    // One to Many
  	user: {
      model: 'User',
      required: true,
      index: true
  	},

    // One to Many
    course: {
      model: 'Course',
      required: true,
      index: true
    },

    state: {
    	type: 'string',
      required: true,
      enum: ['attending', 'droped', 'removed']
    }

  }
};

