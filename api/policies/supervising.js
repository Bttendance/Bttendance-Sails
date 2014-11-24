'use strict';

/**
 * Supervising
 *
 * @module      :: Policy
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/policies
 */

var error = require('../utils/errors'),
    Arrays = require('../utils/arrays');

module.exports = function supervising (req, res, next) {
  // Params
  var email = req.param('email'),
      password = req.param('password'),
      courseId = req.param('courseId'),
      postId = req.param('postId');

  if (!email) {
    return res.send(400, error.alert(req, "Supervising Policy Error", "Email is required."));
  }

  if (!courseId && !postId) {
    return res.send(400, error.alert(req, "Supervising Policy Error", "Course ID or Post ID is required."));
  }

  if (!password) {
    return res.send(400, error.alert(req, "Supervising Policy Error", "Password is required."));
  }

  User.findOneByEmail(email)
    .populate('supervisingCourses')
    .exec(function (err, user) {
      // Error handling
      if (err) {
        return res.send(500, error.alert(req, "Supervising Policy Error", "Error in user find method."));

      // No User found
      } else if (!user) {
        return res.send(404, error.alert(req, "Supervising Policy Error", "User doesn't exitst."));

      // Password Doesn't Match
      } else if (user.password !== password) {
        return res.send(404, error.alert(req, "Supervising Policy Error", "Password doesn't match."));

      // User supervising check
      } else if (courseId && Arrays.getIds(user.supervisingCourses).indexOf(Number(courseId)) < 0) {
        return res.send(403, error.alert(req, "Supervising Policy Error", "User is not supervising current course."));

      // Found User
      } else if (postId) {

        Post.findOneById(postId)
          .exec(function (err, post) {
            // Error handling
            if (err) {
              return res.send(500, error.alert(req, "Supervising Policy Error", "Error in post find method."));

            // No Post found
            } else if (!post) {
              return res.send(404, error.alert(req, "Supervising Policy Error", "Post doesn't exitst."));

            } else if (Arrays.getIds(user.supervisingCourses).indexOf(Number(post.course)) < 0) {
              return res.send(403, error.alert(req, "Supervising Policy Error", "User is not supervising current course."));

            } else {
              return next();
            }
          });
      } else {
        return next();
      }
    });

};
