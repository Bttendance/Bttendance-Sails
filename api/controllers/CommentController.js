'use strict';

/**
 * CommentController
 *
 * @description :: Server-side logic for managing comments
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var error = require('../utils/Errors'),
    Arrays = require('../utils/Arrays');

module.exports = {

  curious: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var curiousId = req.param('curiousId');

    Curious.findOneById(curiousId)
      .populate('comments')
      .exec(function (err, curious) {
        if (err || !curious)
          return res.send(500, error.log(req, "Get Comments Error", "Curious doesn't exist."));

        Comment.findById(Arrays.getIds(curious.comments))
          .sort('id DESC')
          .populateAll()
          .exec(function (err, comments) {
            if (err || !comments) {
              return res.send(500, error.log(req, "Get Comments Error", "Comment doesn't exist."));
            }

            for (var i = 0; i < comments.length; i++) {
              comments[i] = comments[i].toWholeObject();
            }

            return res.send(comments);
          });
      });
  },

  create: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var email = req.param('email'),
        message = req.param('message'),
        postId = req.param('postId');

    User.findOneByEmail(email)
      .exec(function (err, user) {
        if (err || !user)
          return res.send(500, error.log(req, "Comment Create Error", "User doesn't exist."));

        Comment.create({
            author: user.id,
            message: message,
            post: postId
          }).exec(function (err, comment) {
            if (err || !comment) {
              return res.send(500, error.alert(req, "Comment Create Error", "Fail to create comment."));
            }

            Comment.findOneById(comment.id)
            .populateAll()
            .exec(function (err, comment) {
              if (err || !comment) {
                return res.send(500, error.log(req, "Comment Create Error", "Fail to find comment."));
              }

              return res.send(comment.toWholeObject());
            });
        });
      });
  },

  edit: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var message = req.param('message'),
        commentId = req.param('commentId');

    Comment.findOneById(commentId)
      .populateAll()
      .exec(function (err, comment) {
        if (err || !comment) {
          return res.send(500, error.log(req, "Comment Update Error", "Fail to find comment."));
        }

        comment.message = message;
        comment.save(function (err) {
          if (err) {
            return res.send(500, error.alert(req, "Comment Update Error", "Fail to update comment."));
          }

          return res.send(comment.toWholeObject());
        });
      });
  },

  remove: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var message = req.param('message'),
        commentId = req.param('commentId');

    Comment.findOneById(commentId)
      .populateAll()
      .exec(function (err, comment) {
        if (err || !comment) {
          return res.send(500, error.log(req, "Comment Update Error", "Fail to find comment."));
        }

        comment.post = null;
        comment.save(function (err) {
          if (err) {
            return res.send(500, error.alert(req, "Comment Update Error", "Fail to delete comment."));
          }

          return res.send(comment.toWholeObject());
        });
      });
  }

};
