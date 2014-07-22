/**
* Notifications.js
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

