/**
 * QuestionsController
 *
 * @description :: Server-side logic for managing questions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var Error = require('../utils/errors'),
    Arrays = require('../utils/arrays');

module.exports = {

  mine: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var email = req.param('email');

    User
    .findOneByEmail(email)
    .populate('questions')
    .exec(function (err, user) {
      if (err || !user)
        return res.send(500, Error.log(req, "Get Questions Error", "User doesn't exist."));

      Questions
      .findById(Arrays.getIds(user.questions))
      .sort('id DESC')
      .populateAll()
      .exec(function (err, questions) {
        if (err || !questions)
          return res.send(500, Error.log(req, "Get Questions Error", "Questions doesn't exist."));

        for (var i = 0; i < questions.length; i++)
          questions[i] = questions[i].toWholeObject();

        return res.send(questions);
      });
    });
  },

  create: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var email = req.param('email');
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

    if (showInfoOnSelect == 'false' || showInfoOnSelect == 'NO')
      showInfoOnSelect = false;
    else
      showInfoOnSelect = true;

    User
    .findOneByEmail(email)
    .exec(function (err, user) {
      if (err || !user)
        return res.send(500, Error.log(req, "Create Questions Error", "User doesn't exist."));

      Questions
      .create({
        message: message,
        choiceCount: choiceCount,
        progressTime: progressTime,
        showInfoOnSelect: showInfoOnSelect,
        detailPrivacy: detailPrivacy,
        owner: user.id
      }).exec(function (err, question) {
        if (err || !question)
          return res.send(500, Error.log(req, "Create Questions Error", "Fail to create question."));

        Questions
        .findOneById(question.id)
        .populateAll()
        .exec(function (err, question) {
          if (err || !question)
            return res.send(500, Error.log(req, "Create Questions Error", "Question doesn't exist."));

          return res.send(question.toWholeObject());
        });
      });
    });
  },

  edit: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var question_id = req.param('question_id');
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

    if (showInfoOnSelect == 'false' || showInfoOnSelect == 'NO')
      showInfoOnSelect = false;
    else
      showInfoOnSelect = true;

    Questions
    .findOneById(question_id)
    .populateAll()
    .exec(function (err, question) {
      if (err || !question)
        return res.send(500, Error.alert(req, "Update Questions Error", "Fail to find current question."));

      question.message = message;
      question.choiceCount = choiceCount;
      question.progressTime = progressTime;
      question.showInfoOnSelect = showInfoOnSelect;
      question.detailPrivacy = detailPrivacy;
      question.save(function (err) {
        if (err)
          return res.send(500, Error.alert(req, "Update Questions Error", "Fail to save question."));

        return res.send(question.toWholeObject());
      });
    });
  },

  remove: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var email = req.param('email');
    var question_id = req.param('question_id');

    User
    .findOneByEmail(email)
    .populate('questions')
    .exec(function (err, user) {
      if (err || !user)
        return res.send(500, Error.log(req, "Delete Questions Error", "User doesn't exist."));

      user.questions.remove(question_id);
      user.save(function (err) {
        if (err || !user)
          return res.send(500, Error.log(req, "Delete Questions Error", "Deleting question error."));

        Questions
        .findOneById(question_id)
        .populateAll()
        .exec(function (err, question) {
          if (err || !question)
            return res.send(500, Error.log(req, "Delete Questions Error", "Question doesn't exist."));

          return res.send(question.toWholeObject());
        });
      });
    });
  }

};
