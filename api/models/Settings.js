/**
* Settings.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    attendance: {
      type: 'boolean',
      required: true,
      defaultsTo: true
    },

    clicker: {
      type: 'boolean',
      required: true,
      defaultsTo: true
    },

    notice: {
      type: 'boolean',
      required: true,
      defaultsTo: true
    },

    curious: {
      type: 'boolean',
      required: true,
      defaultsTo: true
    },

    progress_time: {
      type: 'integer',
      defaultsTo: 60,
      required: true
    },

    show_info_on_select: {
      type: 'boolean',
      defaultsTo: true,
      required: true
    },

    detail_privacy: {
      type: 'string',
      enum: ['all', 'none', 'professor'],
      defaultsTo: 'professor',
      required: true
    },

    // One to One
    owner: {
    	model: 'Users'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.createdAt;
      delete obj.updatedAt;
      delete obj.owner;
      return obj;
    },

    toWholeObject: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      obj.createdAt = this.createdAt;
      obj.updatedAt = this.updatedAt;
      obj.owner = this.owner;
      return obj;
    }

  }
};

