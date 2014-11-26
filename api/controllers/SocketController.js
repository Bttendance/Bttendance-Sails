'use strict';

/**
 * SocketController
 *
 * @description :: Server-side logic for managing sockets
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var error = require('../utils/errors');

module.exports = {

  connect: function (req, res) {
    var email = req.param('email');

    if (!email) {
      return res.badRequest();
    }

    User.findOneByEmail(email)
    .populateAll()
    .exec(function (err, user) {
      if (err || !user) {
        return res.send(500, error.log(req, "Socket Connect Error", "User Find Error"));
      }

      for (var i = 0; i < user.supervisingCourses.length; i++) {
        sails.sockets.join(req.socket, 'Course#' + user.supervisingCourses[i].id);
      }

      for (var i = 0; i < user.attendingCourses.length; i++) {
        sails.sockets.join(req.socket, 'Course#' + user.attendingCourses[i].id);
      }

      return res.ok();
    });
  }

};
