/**
 * Course
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

  	name: {
  		type: 'string',
  		required: true
  	},

  	section: {
  		type: 'string'
  	},

  	onGoing: {
  		type: 'boolean',
  		defaultsTo: true,
  		required: true
  	},

    // has one School
    school: {
      type: 'integer',
      required: true
    },

    // has one School
    professor: {
      type: 'integer',
      required: true
    },

    // has many Posts
    posts: {
      type: 'array'
    },
    
    // has many Students
    students: {
      type: 'array'
    }
    
  },

  // Lifecycle Callbacks
  beforeCreate: function(values, next) {
    // Instantly add or modify attributes
    values.posts = new Array();
    values.students = new Array();

    // Dealing with MongoDB '_id'
    Course.find().limit(1).sort('createdAt DESC').done(function(err, objs) {
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
