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

		choice_count: {
			type: 'integer',
      required: true,
      defaultsTo: 4,
      min: 2,
      max: 5
		},

    progress_time: {  // sec
      type: 'integer',
      required: true
    },

    detail_privacy: {
      type: 'string',
      enum: ['all', 'professor', 'none'],
      required: true
    },

    show_info_on_select: {
      type: 'boolean',
      required: true
    },

    a_option: {
      type: 'string'
    },

    b_option: {
      type: 'string'
    },

    c_option: {
      type: 'string'
    },

    d_option: {
      type: 'string'
    },

    e_option: {
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

