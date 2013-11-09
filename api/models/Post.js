/**
 * Post
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

  attributes: {

  	id_: {
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
      type: 'integer',
      required: true
    },

    // has one studentCheck = 1 Student + 1 Check
    student_check: {
      type: 'array'
    }

  },

  // Lifecycle Callbacks
  beforeCreate: function(values, next) {

    // Dealing with 'id_'
    Post.find().limit(1).sort('createdAt DESC').done(function(err, collections) {
      if (err) return next(err);

      var seqNo;
      if (collections.length == 0)
        seqNo = 1;
      else
        seqNo = parseInt(collections[0].id_)+ 1;
      values.id_ = seqNo.toString();

      next();
    });
  }

};
