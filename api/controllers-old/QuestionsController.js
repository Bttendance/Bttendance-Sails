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
			.sort('id DESC')
  		.populateAll()
  		.exec(function callback(err, questions) {
				if (err || !questions)
					return res.send(500, Error.log(req, "Get Questions Error", "Questions doesn't exist."));

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
		var progress_time = req.param('progress_time');
		var show_info_on_select = req.param('show_info_on_select');
		var detail_privacy = req.param('detail_privacy');

		if (!progress_time)
			progress_time = 60;
		if (!show_info_on_select)
			show_info_on_select = true;
		if (!detail_privacy)
			detail_privacy = 'professor';
		
		if (show_info_on_select == 'false' || show_info_on_select == 'NO')
			show_info_on_select = false;
		else
			show_info_on_select = true;

		Users
		.findOneByEmail(email)
		.exec(function callback(err, user) {
			if (err || !user)
				return res.send(500, Error.log(req, "Create Questions Error", "User doesn't exist."));

  		Questions
			.create({
				message: message,
				choice_count: choice_count,
				progress_time: progress_time,
				show_info_on_select: show_info_on_select,
				detail_privacy: detail_privacy,
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
		var progress_time = req.param('progress_time');
		var show_info_on_select = req.param('show_info_on_select');
		var detail_privacy = req.param('detail_privacy');

		if (!progress_time)
			progress_time = 60;
		if (!show_info_on_select)
			show_info_on_select = true;
		if (!detail_privacy)
			detail_privacy = 'professor';
		
		if (show_info_on_select == 'false' || show_info_on_select == 'NO')
			show_info_on_select = false;
		else
			show_info_on_select = true;

		Questions
		.findOneById(question_id)
		.populateAll()
		.exec(function callback(err, question) {
			if (err || !question)
				return res.send(500, Error.alert(req, "Update Questions Error", "Fail to fine current question."));

			question.message = message;
			question.choice_count = choice_count;
			question.progress_time = progress_time;
			question.show_info_on_select = show_info_on_select;
			question.detail_privacy = detail_privacy;
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
