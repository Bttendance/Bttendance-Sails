'use strict';

/**
* Comment.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    // One-to-many
    curious: {
      model: 'Curious',
      index: true
    },

    // One-to-many
    author: {
      model: 'User',
      required: true
    },

    message: {
      type: 'string',
      required: true,
      defaultsTo: ''
    },

    toJSON: function () {
      var obj = this.toObject();

      delete obj.createdAt;
      delete obj.updatedAt;

      return obj;
    },

    toWholeObject: function () {
      var json = JSON.stringify(this),
          obj = JSON.parse(json);

      obj.createdAt = this.createdAt;
      obj.updatedAt = this.updatedAt;

      return obj;
    }

  }
};
