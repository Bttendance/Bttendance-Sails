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
      defaultsTo: new Array()
		},

		b_students: {
			type: 'json',
      defaultsTo: new Array()
		},

		c_students: {
			type: 'json',
      defaultsTo: new Array()
		},

		d_students: {
			type: 'json',
      defaultsTo: new Array()
		},

		e_students: {
			type: 'json',
      defaultsTo: new Array()
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

    detail_privacy: {
      type: 'string',
      enum: ['all', 'none', 'professor'],
      required: true,
      defaultsTo: 'professor'
    },

    post: {
      model: 'Posts',
      index: true
    },

    toJSON: function() {
      var obj = this.toObject();
      return obj;
    },

    toWholeObject: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      return obj;
    }
	},

  afterCreate: function(values, next) {

    for (var i =  1; i <= values.progress_time; i++) {
      setTimeout(function() { 
    
        Clickers
        .findOneById(values.id)
        .populateAll()
        .exec(function callback(err, clicker) {
          if (clicker && clicker.post && clicker.post.course)
            sails.sockets.broadcast('Course#' + clicker.post.course, 'clicker', clicker.toWholeObject());       
        });

      }, i * 1000);
    };

    next();
  },

  afterUpdate: function(values, next) {
    
    var createdAt = Moment(values.createdAt);
    var diff = Moment().diff(createdAt);
    if (diff >= values.progress_time * 1000)
      Clickers
      .findOneById(values.id)
      .populateAll()
      .exec(function callback(err, clicker) {
        if (clicker && clicker.post && clicker.post.course)
          sails.sockets.broadcast('Course#' + clicker.post.course, 'clicker', clicker.toWholeObject());       
      });

    next();
  }

};
