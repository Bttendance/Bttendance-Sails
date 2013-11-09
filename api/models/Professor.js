/**
 * Professor
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

  attributes: {

    user_id: {
      type: 'integer',
      unique: true
    },

    first_name: {
      type: 'string',
      required: true
    },

    last_name: {
      type: 'string',
      required: true
    },

    full_name: {
      type: 'string'
    },

    profile_image: {
      type: 'url'
    },

    // has many Courses
    courses: {
      type: 'array'
    },

    // has many memberships = 1 School + n Departments
    memberships: {
      type: 'array'
    },

    toJSON: function() {
      var obj = this.toObject();
      return obj;
    }
  },

  // Lifecycle Callbacks
  beforeCreate: function(values, next) {

    User.create({
      username: values.username,
      email:    values.email,
      password: values.password,
      userType: 'professor'
    }, function (err, user) {

      // An database error occurred
      if (err) { return next(err); }

      // Use wasn't created for some weird reason
      if (!user) { return next({ error: "User creation Error"}); }

      // Instantly add or modify attributes
      delete values['username'];
      delete values['email'];
      delete values['password'];
      values.user_id = user.id_;
      values.full_name = values.first_name + " " + values.last_name;
      values.courses = new Array();
      values.memberships = new Array();
      next();
    });
  },

  beforeDestroy: function(criteria, next) {

    Professor.findOne(criteria).done(function(err, prof) {
      // An database error occurred
      if (err) { return next(err); }

      User.findOne({
        id_: prof.user_id
      }).done(function(err, user) {
        // An database error occurred
        if (err) { return next(err); }
        // Use couldn't found for some weird reason
        if (!user) { return next({ error: "User found Error"}); }
        // destroy the record
        user.destroy(function(err) {
          // An database error occurred
          if (err) { return next(err); }
          // record has been removed
          next();
        });
      });
    });
  }
};
