/**
 * Devices
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    type: {
      type: 'string',
      enum: ['iphone', 'android', 'xiaomi'],
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
    	model: 'Users'
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

  beforeCreate: function(values, next) {
    if (values.type == 'android')
      values.mac_address = values.uuid;
    next();
  },

};
