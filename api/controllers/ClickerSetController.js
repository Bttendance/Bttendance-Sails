/**
 * ClickerQuestionController
 *
 * @description :: Server-side logic for managing clickerquestions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var Error = require('../utils/errors'),
    Arrays = require('../utils/arrays');

module.exports = {

  course: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var courseId = req.param('courseId');

    ClickerQuestion.find({ course: courseId })
      .sort('id DESC')
      .populateAll()
      .exec(function (err, clickerQuestions) {
        if (err || !clickerQuestions) {
          return res.send(500, Error.log(req, "Get Questions Error", "Questions doesn't exist."));
        }

        for (var i = 0; i < clickerQuestions.length; i++) {
          clickerQuestions[i] = clickerQuestions[i].toWholeObject();
        }

        return res.send(clickerQuestions);
      });
  },

  create: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var email = req.param('email'),
        courseId = req.param('courseId'),
        message = req.param('message'),
        choiceCount = req.param('choiceCount'),
        progressTime = req.param('progressTime'),
        showInfoOnSelect = req.param('showInfoOnSelect'),
        detailPrivacy = req.param('detailPrivacy');

    if (!progressTime) {
      progressTime = 60;
    }
    if (!showInfoOnSelect) {
      showInfoOnSelect = true;
    }
    if (!detailPrivacy) {
      detailPrivacy = 'professor';
    }

    if (showInfoOnSelect === 'false' || showInfoOnSelect === 'NO') {
      showInfoOnSelect = false;
    } else {
      showInfoOnSelect = true;
    }

    User.findOneByEmail(email)
      .exec(function (err, user) {
        if (err || !user) {
          return res.send(500, Error.log(req, "Create Questions Error", "User doesn't exist."));
        }

        ClickerQuestion.create({
            message: message,
            choiceCount: choiceCount,
            progressTime: progressTime,
            showInfoOnSelect: showInfoOnSelect,
            detailPrivacy: detailPrivacy,
            author: user.id,
            course: courseId
          }).exec(function (err, clickerQuestion) {
            if (err || !clickerQuestion) {
              return res.send(500, Error.log(req, "Create Questions Error", "Fail to create question."));
            }

            ClickerQuestion.findOneById(clickerQuestion.id)
              .populateAll()
              .exec(function (err, clickerQuestion) {
                if (err || !clickerQuestion) {
                  return res.send(500, Error.log(req, "Create Questions Error", "Question doesn't exist."));
                }

                return res.send(clickerQuestion.toWholeObject());
              });
          });
      });
  },

  edit: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var clickerQuestionId = req.param('clickerQuestionId');
    var message = req.param('message');
    var choiceCount = req.param('choiceCount');
    var progressTime = req.param('progressTime');
    var showInfoOnSelect = req.param('showInfoOnSelect');
    var detailPrivacy = req.param('detailPrivacy');

    if (!progressTime)
      progressTime = 60;
    if (!showInfoOnSelect)
      showInfoOnSelect = true;
    if (!detailPrivacy)
      detailPrivacy = 'professor';

    if (showInfoOnSelect === 'false' || showInfoOnSelect === 'NO')
      showInfoOnSelect = false;
    else
      showInfoOnSelect = true;

    ClickerQuestion.findOneById(clickerQuestionId)
      .populateAll()
      .exec(function (err, clickerQuestion) {
        if (err || !clickerQuestion) {
          return res.send(500, Error.alert(req, "Update Questions Error", "Fail to find current question."));
        }

        clickerQuestion.message = message;
        clickerQuestion.choiceCount = choiceCount;
        clickerQuestion.progressTime = progressTime;
        clickerQuestion.showInfoOnSelect = showInfoOnSelect;
        clickerQuestion.detailPrivacy = detailPrivacy;
        clickerQuestion.save(function (err) {
          if (err) {
            return res.send(500, Error.alert(req, "Update Questions Error", "Fail to save question."));
          }

          return res.send(clickerQuestion.toWholeObject());
        });
      });
  },

  remove: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var clickerQuestionId = req.param('clickerQuestionId');

    ClickerQuestion.findOneById(clickerQuestionId)
      .populateAll()
      .exec(function (err, clickerQuestion) {
        if (err || !clickerQuestion)
          return res.send(500, Error.alert(req, "Delete Questions Error", "Fail to find current question."));

        clickerQuestion.course = null;
        clickerQuestion.save(function (err) {
          if (err)
            return res.send(500, Error.alert(req, "Delete Questions Error", "Deleting question error."));

          return res.send(clickerQuestion.toWholeObject());
        });
      });
  }

};
