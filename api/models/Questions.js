/**
* Questions.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    message: {
      type: 'string',
      required: true
    },

    choice_count: {
      type: 'integer',
      required: true,
      max: 5,
      min: 2,
      defaultsTo: 4
    },

    progress_time: {
      type: 'integer',
      required: true,
      defaultsTo: 60
    },

    show_info_on_select: {
      type: 'boolean',
      required: true,
      defaultsTo: true
    },

    detail_privacy: { //all, none, professor
      type: 'string',
      enum: ['all', 'none', 'professor'],
      required: true,
      defaultsTo: 'professor'
    },

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