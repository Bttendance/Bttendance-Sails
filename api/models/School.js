/**
 * School
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

  attributes: {

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
    },

    // user who created this school
    creator: {
      type: 'integer',
      required: true
    }
    
  },

  beforeValidation: function(values, next) {
    if (values.username) {
      User.findOne({
        username: values.username
      }).done(function(err, user) {
        if (!err && user) {
          values.creator = user.id;
        } else
          return next(err);
      });
    }
    next();
  },

  // Lifecycle Callbacks
  beforeCreate: function(values, next) {
    values.courses = new Array();
    next();
  },

  afterCreate: function(values, next) {
    User.findOne(values.creator).done(function(err, user) {
      // return err
      if (err) return next(err);
      // make new array
      if (!user.schools) user.schools = new Array();
      // add school to user who created this school
      user.schools.push(values.id);
      // save new values
      user.save(function(err){
        if (err) return next(err);
        next();
      })
    });

  }

};
