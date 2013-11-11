/**
 * Student
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

    toJSON: function() {
      var obj = this.toObject();
      return obj;
    }
  },

  // Lifecycle Callbacks
  beforeCreate: function(values, next) {

    console.log(values);

    User.create({
      username: values.username,
      email:    values.email,
      password: values.password,
      type: 'student'
    }, function (err, user) {

      // An database error occurred
      if (err) { return next(err); }

      // Use wasn't created for some weird reason
      if (!user) { return next({ error: "User creation Error"}); }

      // Instantly add or modify attributes
      delete values['username'];
      delete values['email'];
      delete values['password'];
      values._id = user.id;
      values.full_name = values.first_name + " " + values.last_name;
      values.courses = new Array();
      values.memberships = new Array();
      next();
    });
  },

  beforeDestroy: function(criteria, next) {

    Student.findOne(criteria).done(function(err, std) {
      // An database error occurred
      if (err) { return next(err); }

      User.findOne(std.id).done(function(err, user) {
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
