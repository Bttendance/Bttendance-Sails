/**
 * ClickerQuestionsController
 *
 * @description :: Server-side logic for managing clickerquestions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var Error = require('../utils/errors');
var Arrays = require('../utils/arrays');

module.exports = {
	
	course: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var course_id = req.param('course_id');

		Courses
		.findOneById(course_id)
		.populate('questions')
		.exec(function callback(err, course) {
			if (err || !course)
				return res.send(500, Error.log(req, "Get Questions Error", "User doesn't exist."));

  		ClickerQuestions
  		.findById(Arrays.getIds(course.questions))
			.sort('id DESC')
  		.populateAll()
  		.exec(function callback(err, clickerQuestions) {
				if (err || !clickerQuestions)
					return res.send(500, Error.log(req, "Get Questions Error", "Questions doesn't exist."));

				for (var i = 0; i < clickerQuestions.length; i++)
  				clickerQuestions[i] = clickerQuestions[i].toWholeObject();

		  	return res.send(clickerQuestions);
  		});
		});
	},

	create: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var email = req.param('email');
		var course_id = req.param('course_id');
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

  		ClickerQuestions
			.create({
				message: message,
				choice_count: choice_count,
				progress_time: progress_time,
				show_info_on_select: show_info_on_select,
				detail_privacy: detail_privacy,
				author: user.id,
				course: course_id
			}).exec(function callback(err, clickerQuestion) {
		  	if (err || !clickerQuestion)
					return res.send(500, Error.log(req, "Create Questions Error", "Fail to create question."));

	  		ClickerQuestions
	  		.findOneById(clickerQuestion.id)
	  		.populateAll()
	  		.exec(function callback(err, clickerQuestion) {
					if (err || !clickerQuestion)
						return res.send(500, Error.log(req, "Create Questions Error", "Question doesn't exist."));

			  	return res.send(clickerQuestion.toWholeObject());
	  		});
			});
		});
	},

	edit: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var clicker_question_id = req.param('clicker_question_id');
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

		ClickerQuestions
		.findOneById(clicker_question_id)
		.populateAll()
		.exec(function callback(err, clickerQuestion) {
			if (err || !clickerQuestion)
				return res.send(500, Error.alert(req, "Update Questions Error", "Fail to find current question."));

			clickerQuestion.message = message;
			clickerQuestion.choice_count = choice_count;
			clickerQuestion.progress_time = progress_time;
			clickerQuestion.show_info_on_select = show_info_on_select;
			clickerQuestion.detail_privacy = detail_privacy;
			clickerQuestion.save(function callback(err) {
				if (err)
					return res.send(500, Error.alert(req, "Update Questions Error", "Fail to save question."));

		  	return res.send(clickerQuestion.toWholeObject());
			});
		});
	},

	remove: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var clicker_question_id = req.param('clicker_question_id');

		ClickerQuestions
		.findOneById(clicker_question_id)
		.populateAll()
		.exec(function callback(err, clickerQuestion) {
			if (err || !clickerQuestion)
				return res.send(500, Error.alert(req, "Delete Questions Error", "Fail to find current question."));

			clickerQuestion.course = null;
			clickerQuestion.save(function callback(err) {
				if (err)
					return res.send(500, Error.alert(req, "Delete Questions Error", "Deleting question error."));

		  	return res.send(clickerQuestion.toWholeObject());
			});
		});
	}
	
};

