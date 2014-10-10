/**
 * Polls.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

		choice_count: {
			type: 'integer'
		},

		a_students: {
			type: 'json'
		},

		b_students: {
			type: 'json'
		},

		c_students: {
			type: 'json'
		},

		d_students: {
			type: 'json'
		},

		e_students: {
			type: 'json'
		},

    progress_time: {
      type: 'integer',
      defaultsTo: 90
    },

    show_info_on_select: {
      type: 'boolean',
      defaultsTo: true
    },

    detail_privacy: { //all, none, professor
      type: 'string',
      defaultsTo: 'professor'
    },

    // a_option_text: {
    //   type: 'string'
    // },

    // b_option_text: {
    //   type: 'string'
    // },

    // c_option_text: {
    //   type: 'string'
    // },

    // d_option_text: {
    //   type: 'string'
    // },

    // e_option_text: {
    //   type: 'string'
    // },

    post: {
      model: 'Posts'
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
    if (!values.choice_count)
      values.choice_count = 4;
    if (values.choice_count < 2)
      values.choice_count = 2;
    if (values.choice_count > 5)
      values.choice_count = 5;
    
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
