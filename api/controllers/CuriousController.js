'use strict';

/**
 * CuriousController
 *
 * @description :: Server-side logic for managing curiouses
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var error = require('../utils/errors'),
    Arrays = require('../utils/arrays');

module.exports = {

  like: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var email = req.param('email'),
        curiousId = req.param('curiousId');

    User.findOneByEmail(email)
      .exec(function (err, user) {
        if (err || !user) {
          return res.send(500, error.log(req, "Curious Update Error", "User doesn't exist."));
        }

        Curious.findOneById(curiousId)
          .populateAll()
          .exec(function (err, curious) {
            if (err || !curious) {
              return res.send(500, error.log(req, "Curious Update Error", "Curious doesn't exist."));
            }

            if (Arrays.getIds(curious.likedUser) === -1) {
              curious.likedUser.push(user.id);
              curious.save();
            }

            return res.send(curious.toWholeObject());
          });
      });
  },

  unlike: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var email = req.param('email'),
        curiousId = req.param('curiousId');

    User.findOneByEmail(email)
      .exec(function (err, user) {
        if (err || !user) {
          return res.send(500, error.log(req, "Curious Update Error", "User doesn't exist."));
        }

        Curious.findOneById(curiousId)
          .populateAll()
          .exec(function (err, curious) {
            if (err || !curious) {
              return res.send(500, error.log(req, "Curious Update Error", "Curious doesn't exist."));
            }

            if (Arrays.getIds(curious.likedUser) !== -1) {
              var likedUser = [];
              for (var i = curious.likedUser.length - 1; i >= 0; i--) {
                if (curious.likedUser[i] !== user.id) {
                  likedUser.push(curious.likedUser[i]);
                }
              }

              curious.likedUser = likedUser;
              curious.save();
            }

            return res.send(curious.toWholeObject());
          });
      });
  },

  follow: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var email = req.param('email'),
        curiousId = req.param('curiousId');

    User.findOneByEmail(email)
      .exec(function (err, user) {
        if (err || !user) {
          return res.send(500, error.log(req, "Curious Update Error", "User doesn't exist."));
        }

        Curious.findOneById(curiousId)
          .populateAll()
          .exec(function (err, curious) {
            if (err || !curious) {
              return res.send(500, error.log(req, "Curious Update Error", "Curious doesn't exist."));
            }

            if (Arrays.getIds(curious.followers) === -1) {
              curious.followers.push(user.id);
              curious.save();
            }

            return res.send(curious.toWholeObject());
          });
      });
  },

  unfollow: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var email = req.param('email'),
        curiousId = req.param('curiousId');

    User.findOneByEmail(email)
      .exec(function (err, user) {
        if (err || !user) {
          return res.send(500, error.log(req, "Curious Update Error", "User doesn't exist."));
        }

        Curious.findOneById(curiousId)
          .populateAll()
          .exec(function (err, curious) {
            if (err || !curious) {
              return res.send(500, error.log(req, "Curious Update Error", "Curious doesn't exist."));
            }

            if (Arrays.getIds(curious.followers) !== -1) {
              var followers = [];
              for (var i = curious.followers.length - 1; i >= 0; i--) {
                if (curious.followers[i] !== user.id) {
                  followers.push(curious.followers[i]);
                }
              }

              curious.followers = followers;
              curious.save();
            }

            return res.send(curious.toWholeObject());
          });
      });
  }

};
