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

    detail_privacy: { //all, professor, none
      type: 'string',
      required: true
    },

    show_info_on_select: {
      type: 'boolean',
      required: true
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

