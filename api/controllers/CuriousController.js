/**
 * CuriousController
 *
 * @description :: Server-side logic for managing curiouses
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var Error = require('../utils/errors'),
    Arrays = require('../utils/arrays');

module.exports = {

  like: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var email = req.param('email');
    var curious_id = req.param('curious_id');

    User
    .findOneByEmail(email)
    .exec(function (err, user) {
      if (err || !user)
        return res.send(500, Error.log(req, "Curious Update Error", "User doesn't exist."));

      Curious
      .findOneById(curious_id)
      .populateAll()
      .exec(function (err, curious) {
        if (err || !curious)
          return res.send(500, Error.log(req, "Curious Update Error", "Curious doesn't exist."));

        if (Arrays.getIds(curious.liked_user) == -1) {
          curious.liked_user.push(user.id);
          curious.save();
        }

        return res.send(curious.toWholeObject());
      });
    });
  },

  unlike: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var email = req.param('email');
    var curious_id = req.param('curious_id');

    User
    .findOneByEmail(email)
    .exec(function (err, user) {
      if (err || !user)
        return res.send(500, Error.log(req, "Curious Update Error", "User doesn't exist."));

      Curious
      .findOneById(curious_id)
      .populateAll()
      .exec(function (err, curious) {
        if (err || !curious)
          return res.send(500, Error.log(req, "Curious Update Error", "Curious doesn't exist."));

        if (Arrays.getIds(curious.liked_user) != -1) {
          var liked_user = [];
          for (var i = curious.liked_user.length - 1; i >= 0; i--)
            if (curious.liked_user[i] != user.id)
              liked_user.push(curious.liked_user[i]);

          curious.liked_user = liked_user;
          curious.save();
        }

        return res.send(curious.toWholeObject());
      });
    });
  },

  follow: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var email = req.param('email');
    var curious_id = req.param('curious_id');

    User
    .findOneByEmail(email)
    .exec(function (err, user) {
      if (err || !user)
        return res.send(500, Error.log(req, "Curious Update Error", "User doesn't exist."));

      Curious
      .findOneById(curious_id)
      .populateAll()
      .exec(function (err, curious) {
        if (err || !curious)
          return res.send(500, Error.log(req, "Curious Update Error", "Curious doesn't exist."));

        if (Arrays.getIds(curious.followers) == -1) {
          curious.followers.push(user.id);
          curious.save();
        }

        return res.send(curious.toWholeObject());
      });
    });
  },

  unfollow: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var email = req.param('email');
    var curious_id = req.param('curious_id');

    User
    .findOneByEmail(email)
    .exec(function (err, user) {
      if (err || !user)
        return res.send(500, Error.log(req, "Curious Update Error", "User doesn't exist."));

      Curious
      .findOneById(curious_id)
      .populateAll()
      .exec(function (err, curious) {
        if (err || !curious)
          return res.send(500, Error.log(req, "Curious Update Error", "Curious doesn't exist."));

        if (Arrays.getIds(curious.followers) != -1) {
          var followers = [];
          for (var i = curious.followers.length - 1; i >= 0; i--)
            if (curious.followers[i] != user.id)
              followers.push(curious.followers[i]);

          curious.followers = followers;
          curious.save();
        }

        return res.send(curious.toWholeObject());
      });
    });
  },

};
