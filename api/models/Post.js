/**
 * Post
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

  attributes: {

  	_id: {
  		type: 'string',
  		unique: true
  	},

  	title: {
  		type: 'string',
  		required: true
  	},

  	message: {
  		type: 'string',
  		required: true
  	},

  	on_going: {
  		type: 'boolean',
  		defaultsTo: true,
  		required: true
  	},

    // has one Course
    course: {
      type: 'json',
      required: true
    },

    // has one studentCheck = 1 Student + 1 Check
    student_check: {
      type: 'array'
    }

  },

  // Lifecycle Callbacks
  beforeCreate: function(values, next) {

    // Dealing with MongoDB '_id'
    Post.find().limit(1).sort('createdAt DESC').done(function(err, objs) {
      if (err) return next(err);

      var seqNo;
      if (objs.length == 0)
        seqNo = 1;
      else
        seqNo = parseInt(objs[0].id) + 1;
      values._id = seqNo.toString();

      next();
    });
  }

};
