/**
 * Devices
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    // One to One
    owner: {
      model: 'User'
    },

    //iOS, Android, MIUI, etc
    os: {
      type: 'string',
      required: true
    },

    // uuid for iphone, Pseudo-Unique ID for android
    unique_id: {
      type: 'string',
      required: true,
      unique: true
    },

    // uuid for iphone, bluetooth mac address for android => use for bluetooth scanning
    uuid: {
      type: 'string',
      required: true,
      unique: true
    },

    // bluetooth mac address
    bluetooth_mac_address: {
      type: 'string'
    },

    notification_key: {
      type: 'string'
    },

    for_bttendance: {
      type: 'boolean',
      required: true,
      defaultsTo: true
    },

    ownerChangedAt: {
      type: 'date',
      required: true
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
  }

};
