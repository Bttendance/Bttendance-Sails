/**
 * Serials
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var Random = require('../utils/random');

module.exports = {

  attributes: {

    key: {
      type: 'string'
    },

    school: {
    	model: 'Schools'
    },

    owners: {
      collection: 'Users',
      via: 'serials'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.createdAt;
      delete obj.updatedAt;
      delete obj.owners;
      return obj;
    },

    toWholeObject: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      obj.createdAt = this.createdAt;
      obj.updatedAt = this.updatedAt;
      obj.owners = this.owners;
      return obj;
    }
    
  },

  beforeValidate: function(values, next) {
    if (values.school_id)
      values.school = values.school_id;
    next();
  },

  afterValidate: function(values, next) {
    next();
  },

  beforeCreate: function(values, next) {
    if (!values.key)
      values.key = Random.string(7);
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