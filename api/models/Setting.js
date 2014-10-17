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

    attendance_noti: {
      type: 'boolean',
      required: true,
      defaultsTo: true
    },

    clicker_noti: {
      type: 'boolean',
      required: true,
      defaultsTo: true
    },

    notice_noti: {
      type: 'boolean',
      required: true,
      defaultsTo: true
    },

    curious_noti: {
      type: 'boolean',
      required: true,
      defaultsTo: true
    },

    locale: {
      type: 'string',
      required: true,
      defaultsTo: 'en'
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

