'use strict';

/**
* ClickerSet.js
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

    // One-Way
    author: {
      model: 'User',
      required: true
    },

    type: {
      type: 'string',
      required: true,
      enum: ['ox', 'star', 'mult2', 'mult3', 'mult4', 'mult5', 'essay'],
      defaultsTo: 'mult4'
    },

    message: {
      type: 'string',
      required: true,
      defaultsTo: ''
    },

    time: {
      type: 'integer',
      required: true,
      defaultsTo: 45
    },

    cheating: {
      type: 'boolean',
      required: true,
      defaultsTo: true
    },

    privacy: {
      type: 'string',
      enum: ['all', 'none', 'professor'],
      required: true,
      defaultsTo: 'professor'
    },

    toJSON: function () {
      var obj = this.toObject();

      delete obj.createdAt;
      delete obj.updatedAt;
      delete obj.course;

      return obj;
    },

    toWholeObject: function () {
      var json = JSON.stringify(this),
          obj = JSON.parse(json);

      obj.createdAt = this.createdAt;
      obj.updatedAt = this.updatedAt;
      obj.course = this.course;

      return obj;
    }
  }
};
