/**
 * QuestionsController
 *
 * @description :: Server-side logic for managing questions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var Error = require('../utils/errors');
var Arrays = require('../utils/arrays');

module.exports = {
	
	mine: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var email = req.param('email');

		Users
		.findOneByEmail(email)
		.populate('questions')
		.exec(function callback(err, user) {
			if (err || !user)
				return res.send(500, Error.log(req, "Get Questions Error", "User doesn't exist."));

  		Questions
  		.findById(Arrays.getIds(user.questions))
  		.populateAll()
  		.exec(function callback(err, questions) {
				if (err || !questions)
					return res.send(500, Error.log(req, "Get Questions Error", "Questions doesn't exist."));

				console.log(questions);

				for (var i = 0; i < questions.length; i++)
  				questions[i] = questions[i].toWholeObject();

		  	return res.send(questions);
  		});
		});
	},

	create: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var email = req.param('email');
		var message = req.param('message');
		var choice_count = req.param('choice_count');

		Users
		.findOneByEmail(email)
		.exec(function callback(err, user) {
			if (err || !user)
				return res.send(500, Error.log(req, "Create Questions Error", "User doesn't exist."));

  		Questions
			.create({
				message: message,
				choice_count: choice_count,
				owner: user.id
			}).exec(function callback(err, question) {
		  	if (err || !question)
					return res.send(500, Error.log(req, "Create Questions Error", "Fail to create question."));

	  		Questions
	  		.findOneById(question.id)
	  		.populateAll()
	  		.exec(function callback(err, question) {
					if (err || !question)
						return res.send(500, Error.log(req, "Create Questions Error", "Question doesn't exist."));

			  	return res.send(question.toWholeObject());
	  		});
			});
		});
	},

	edit: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var question_id = req.param('question_id');
		var message = req.param('message');
		var choice_count = req.param('choice_count');

		Questions
		.findOneById(question_id)
		.populateAll()
		.exec(function callback(err, question) {
			if (err || !question)
				return res.send(500, Error.alert(req, "Update Questions Error", "Fail to fine current question."));

			question.message = message;
			question.choice_count = choice_count;
			question.save(function callback(err) {
				if (err)
					return res.send(500, Error.alert(req, "Update Questions Error", "Fail to save question."));

		  	return res.send(question.toWholeObject());
			});
		});
	},

	remove: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var email = req.param('email');
		var question_id = req.param('question_id');

		Users
		.findOneByEmail(email)
		.populate('questions')
		.exec(function callback(err, user) {
			if (err || !user)
				return res.send(500, Error.log(req, "Delete Questions Error", "User doesn't exist."));

			user.questions.remove(question_id);
			user.save(function callback(err) {
				if (err || !user)
					return res.send(500, Error.log(req, "Delete Questions Error", "Deleting question error."));

	  		Questions
	  		.findOneById(question_id)
	  		.populateAll()
	  		.exec(function callback(err, question) {
					if (err || !question)
						return res.send(500, Error.log(req, "Delete Questions Error", "Question doesn't exist."));

			  	return res.send(question.toWholeObject());
	  		});
			});
		});
	}
	
};

