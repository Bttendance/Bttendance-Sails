/**
 * School
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

    logo_image: {
    	type: 'url'
    },

    website: {
    	type: 'url',
      required: true
    },

    // has many Courses
    courses: {
      type: 'array'
    }
    
  },

  // Lifecycle Callbacks
  beforeCreate: function(values, next) {
    // Instantly add or modify attributes
    values.courses = new Array();

    // Dealing with MongoDB '_id'
    School.find().limit(1).sort('createdAt DESC').done(function(err, objs) {
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
