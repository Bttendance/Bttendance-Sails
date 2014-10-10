/**
 * Device
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

    os: {
      type: 'string',
      enum: ['iOS', 'Android', 'MIUI'],
      required: true
    },

    // uuid for iphone, Pseudo-Unique ID for android
    uniqueID: {
      type: 'string',
      unique: true
    },

    // uuid for iphone, bluetooth mac address for android => use for bluetooth scanning
    uuid: {
      type: 'string',
      required: true,
      unique: true
    },

    // bluetooth mac address
    bluetoothMacAddress: {
      type: 'string'
    },

    notificationKey: {
      type: 'string'
    },

    forBttendance: {
      type: 'boolean',
      required: true,
      defaultsTo: true
    },

    ownerChangedAt: {
      type: 'date',
      required: true,
      defaultsTo: function() {return new Date();}
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
    
  },

  beforeCreate: function(values, next) {
    if (values.type == 'iOS')
      values.uniqueID = values.uuid;
    if (values.type == 'Android')
      values.bluetoothMacAddress = values.uuid;
    next();
  }

};
