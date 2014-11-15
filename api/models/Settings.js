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

    progress_time: {
      type: 'integer',
      defaultsTo: 60
    },

    show_info_on_select: {
      type: 'boolean',
      defaultsTo: true
    },

    detail_privacy: { //all, none, professor
      type: 'string',
      defaultsTo: 'professor'
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

  },

  beforeValidate: function(values, next) {
    next();
  },

  afterValidate: function(values, next) {
    next();
  },

  beforeCreate: function(values, next) {
    next();
  },

  afterCreate: function(values, next) {
    next();
  },

  beforeUpdate: function(values, next) {
    next();
  },

  afterUpdate: function(values, next) {
    next();
  },

  beforeDestroy: function(values, next) {
    next();
  },

  afterDestroy: function(values, next) {
    next();
  }
};

