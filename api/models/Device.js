/**
 * Devices
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    //iphone, android, window, blackberry, etc
    type: {
      type: 'string',
      required: true
    },

    // uuid for iphone, mac address for android
    uuid: {
      type: 'string',
      required: true,
      unique: true
    },

    // mac address
    mac_address: {
      type: 'string'
    },

    notification_key: {
      type: 'string'
    },

    // One to One
    owner: {
    	model: 'User'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.createdAt;
      delete obj.updatedAt;
      delete obj.mac_address;
      delete obj.owner;
      return obj;
    },

    toWholeObject: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      obj.createdAt = this.createdAt;
      obj.updatedAt = this.updatedAt;
      obj.mac_address = this.mac_address;
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
    if (values.type == 'android')
      values.mac_address = values.uuid;
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
