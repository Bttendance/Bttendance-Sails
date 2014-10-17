/**
 * Polls.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

		a_chosen_students: {
			type: 'array',
      required: true,
      defaultsTo: new Array()
		},

		b_chosen_students: {
			type: 'array',
      required: true,
      defaultsTo: new Array()
		},

		c_chosen_students: {
			type: 'array',
      required: true,
      defaultsTo: new Array()
		},

		d_chosen_students: {
			type: 'array',
      required: true,
      defaultsTo: new Array()
		},

		e_chosen_students: {
			type: 'array',
      required: true,
      defaultsTo: new Array()
		},

		post: {
			model: 'Post'
		},

    choice_count: {
      type: 'integer',
      required: true,
      defaultsTo: 4,
      min: 2,
      max: 5
    },

    progress_time: {
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
      if (this.post)
        obj.post = this.post.id;
      return obj;
    },

    toWholeJSON: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      if (this.post)
        obj.post = this.post.toSimpleJSON();
      return obj;
    }
	},

  afterUpdate: function(values, next) {
    
    Clicker
    .findOneById(values.id)
    .populateAll()
    .exec(function callback(err, clicker) {
      if (clicker && clicker.post && clicker.post.course)
        sails.sockets.broadcast('Course#' + clicker.post.course, 'clicker', clicker.toWholeJSON());       
    });

    next();
  }
};
