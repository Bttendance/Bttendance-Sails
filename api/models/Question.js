/**
* Questions.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    // One to Many
    owner: {
      model: 'User'
    },

		message: {
			type: 'string',
			required: true
		},

		choiceCount: {
			type: 'integer',
      required: true,
      defaultsTo: 4,
      min: 2,
      max: 5
		},

    progressTime: {  // sec
      type: 'integer',
      required: true
    },

    detailPrivacy: {
      type: 'string',
      enum: ['all', 'professor', 'none'],
      required: true
    },

    showInfoOnSelect: {
      type: 'boolean',
      required: true
    },

    aOptionText: {
      type: 'string'
    },

    bOptionText: {
      type: 'string'
    },

    cOptionText: {
      type: 'string'
    },

    dOptionText: {
      type: 'string'
    },

    eOptionText: {
      type: 'string'
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

  }

};

