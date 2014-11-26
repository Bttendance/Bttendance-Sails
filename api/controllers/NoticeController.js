'use strict';

/**
 * NoticeController
 *
 * @description :: Server-side logic for managing notices
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var error = require('../utils/errors'),
    Arrays = require('../utils/arrays');

module.exports = {

  seen: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var email = req.param('email'),
        noticeId = req.param('noticeId');

    User.findOneByEmail(email)
      .exec(function (err, user) {
        if (err || !user) {
          return res.send(500, error.log(req, "Notice Seen Error", "Fail to find user."));
        }

        Notice.findOneById(noticeId)
        .populateAll()
          .exec(function (err, notice) {
            if (err || !notice) {
              return res.send(500, error.log(req, "Notice Seen Error", "Fail to find notice."));
            }

            if (notice.seenStudents.indexOf(user.id) !== -1) {
              return res.send(notice.toWholeObject());
            } else if (notice.post) {
              Post.findOneById(notice.post.id)
                .exec(function (err, post) {
                  if (err || !post) {
                    return res.send(500, error.log(req, "Notice Seen Error", "Fail to find post."));
                  }

                  post.seenStudents.push(user.id)
                  post.save();

                  notice.seenStudents.push(user.id);
                  notice.save();

                  return res.send(notice.toWholeObject());
                });
            } else {
              notice.seenStudents.push(user.id);
              notice.save();

              return res.send(notice.toWholeObject());
            }
          });
      });
  }

};
