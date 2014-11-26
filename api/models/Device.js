'use strict';

/**
 * Device
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    // One-to-many
    owner: {
      model: 'User'
    },

    os: {
      type: 'string',
      required: true,
      enum: ['ios', 'android', 'xiaomi']
    },

    // uuid for iphone, mac address for android
    uniqueID: {
      type: 'string',
      required: true,
      unique: true
    },

    uuid: {
      type: 'string'
    },

    macAddress: {
      type: 'string'
    },

    notificationKey: {
      type: 'string'
    },

    ownerChangedAt: {
      type: 'date',
      required: true
    }

  },

  beforeCreate: function (values, next) {
    if (values.type === 'android') {
      values.MACAddress = values.uuid;
    }

    next();
  },

};
