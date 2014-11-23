/**
* Question.js
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

    choiceCount: {
      type: 'integer',
      required: true,
      max: 5,
      min: 2,
      defaultsTo: 4
    },

    progressTime: {
      type: 'integer',
      required: true,
      defaultsTo: 60
    },

    showInfoOnSelect: {
      type: 'boolean',
      required: true,
      defaultsTo: true
    },

    detailPrivacy: {
      type: 'string',
      enum: ['all', 'none', 'professor'],
      required: true,
      defaultsTo: 'professor'
    },

    owner: {
      model: 'User'
    },

    toJSON: function () {
      var obj = this.toObject();

      delete obj.createdAt;
      delete obj.updatedAt;
      delete obj.owner;

      return obj;
    },

    toWholeObject: function () {
      var json = JSON.stringify(this),
          obj = JSON.parse(json);

      obj.createdAt = this.createdAt;
      obj.updatedAt = this.updatedAt;
      obj.owner = this.owner;

      return obj;
    }
  }
};
