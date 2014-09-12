/**
 * Polls.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

		a_students: {
			type: 'json',
      required: true
		},

		b_students: {
			type: 'json',
      required: true
		},

		c_students: {
			type: 'json',
      required: true
		},

		d_students: {
			type: 'json',
      required: true
		},

		e_students: {
			type: 'json',
      required: true
		},

		post: {
			model: 'Post'
		},

    choice_count: {
      type: 'integer',
      required: true
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
      return obj;
    },

    toWholeObject: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      obj.createdAt = this.createdAt;
      obj.updatedAt = this.updatedAt;
      return obj;
    }
	},

  beforeValidate: function(values, next) {
    next();
  },

  afterValidate: function(values, next) {
    next();
  },

  beforeCreate: function(values, next) {
    values.a_students = new Array();
    values.b_students = new Array();
    values.c_students = new Array();
    values.d_students = new Array();
    values.e_students = new Array();
    next();
  },

  afterCreate: function(values, next) {
    next();
  },

  beforeUpdate: function(values, next) {
    next();
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
  },

  beforeDestroy: function(values, next) {
    next();
  },

  afterDestroy: function(values, next) {
    next();
  }
};
