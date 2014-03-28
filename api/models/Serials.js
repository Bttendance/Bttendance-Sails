/**
 * Serials
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    key: {
      type: 'string',
    	required: true
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
      values.key = randomKey();
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

  afterDestroy: function(next) {
    next();
  }

};

function randomKey() {
  var text = "";
  var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

  for(var i=0; i < 7; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}