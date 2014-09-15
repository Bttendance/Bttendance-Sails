/**
 * Polls.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

		aChosenStudents: {
			type: 'array',
      required: true,
      defaultsTo: new Array()
		},

		bChosenStudents: {
			type: 'array',
      required: true,
      defaultsTo: new Array()
		},

		cChosenStudents: {
			type: 'array',
      required: true,
      defaultsTo: new Array()
		},

		dChosenStudents: {
			type: 'array',
      required: true,
      defaultsTo: new Array()
		},

		eChosenStudents: {
			type: 'array',
      required: true,
      defaultsTo: new Array()
		},

		post: {
			model: 'Post'
		},

    choiceCount: {
      type: 'integer',
      required: true,
      defaultsTo: 4,
      min: 2,
      max: 5
    },

    progressTime: {
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

    toSimpleJSON: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      delete obj.createdAt;
      delete obj.updatedAt;
      return obj;
    },

    toWholeJSON: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      obj.createdAt = this.createdAt;
      obj.updatedAt = this.updatedAt;
      return obj;
    }
	},

  afterUpdate: function(values, next) {
    
    Clickers
    .findOneById(values.id)
    .populateAll()
    .exec(function callback(err, clicker) {
      if (clicker && clicker.post && clicker.post.course) {
        sails.sockets.broadcast('Course#' + clicker.post.course, 'clicker', clicker.toWholeObject());       
        Clickers.publishCreate(clicker.toWholeObject()); //For Beta
      }
    });

    next();
  }
};
