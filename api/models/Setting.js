/**
* Setting.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    // One to One
    owner: {
      model: 'User'
    },

    attendanceNoti: {
      type: 'boolean',
      required: true,
      defaultsTo: true
    },

    clickerNoti: {
      type: 'boolean',
      required: true,
      defaultsTo: true
    },

    noticeNoti: {
      type: 'boolean',
      required: true,
      defaultsTo: true
    },

    locale: {
      type: 'string',
      required: true,
      defaultsTo: 'en'
    },

    clickerProgressTime: {
      type: 'integer',
      required: true,
      defaultsTo: 90
    },

    clickerDetailPrivacy: {
      type: 'string',
      enum: ['all', 'professor', 'none'],
      required: true,
      defaultsTo: 'professor'
    },

    clickerShowInfoOnSelect: {
      type: 'boolean',
      required: true,
      defaultsTo: true
    },

    toSimpleJSON: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      delete obj.createdAt;
      delete obj.updatedAt;
      delete obj.owner;
      return obj;
    },

    toWholeJSON: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      if (this.owner)
        obj.owner = this.owner.toSimpleJSON();
      return obj;
    }

  }
};

