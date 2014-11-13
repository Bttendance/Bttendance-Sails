/**
 * MigrationController
 *
 * @description :: Server-side logic for managing migrations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var Random = require('../utils/random');
var Arrays = require('../utils/arrays');

module.exports = {

	migrate1: function(req, res) {
		// setting (done)
		Settings
		.find()
		.exec(function callback(err, settings) {
			for (var i = 0; i < settings.length; i++) {
				settings[i].curious = true;
				settings[i].save();
			}
		});

		// attendance (done)
		Attendances
		.find()
		.exec(function callback(err, attendances) {
			for (var i = attendances.length - 1; i >= 0; i--) {
				attendances[i].type = 'auto';
				attendances[i].save();
			};
		});
	},

	migrate2: function(req, res) {

		// question (done)
		Questions
		.find()
		.exec(function callback(err, questions) {
			async.each(questions, function(question, next) {

				if (!question.owner || question.owner == null)
					next();
				else {
					Users
					.findOneById(question.owner)
					.populate('supervising_courses')
					.exec(function callback(err, user) {
						if (user && user.supervising_courses) {
							for (var i = user.supervising_courses.length - 1; i >= 0; i--) {
								console.log(user.supervising_courses[i]);
								ClickerQuestions.create({
									author: question.owner,
									message: question.message,
									choice_count: question.choice_count,
									progress_time: question.progress_time,
									detail_privacy: question.detail_privacy,
									show_info_on_select: question.show_info_on_select,
									course: user.supervising_courses[i].id
								}).exec(function(err, clickerQuestion) {
									if (err)
										console.log(err);
									else
										console.log(clickerQuestion);
								});
							}
						}
						next();
					});
				}

			}, function(err) {
			});
		});
	},

	migrate3: function(req, res) {
		//Post init seen_students & seen_managers (done)
		Posts
		.find()
		.exec(function callback(err, posts) {
			for (var i = posts.length - 1; i >= 0; i--) {
				posts[i].seen_students = new Array();
				posts[i].seen_managers = new Array();
				posts[i].save();
			};
		});
	},

	migrate4: function(req, res) {
		//seen_students, seen_managers (done)
		Courses
		.find()
		.populate('posts')
		.populate('students')
		.populate('managers')
		.exec(function callback(err, courses) {
			async.each(courses, function(course, callback) {
				for (var i = course.posts.length - 1; i >= 0; i--) {
					if (course.posts[i].type != 'notice')
						course.posts[i].seen_students = Arrays.getIds(course.students);
					course.posts[i].seen_managers = Arrays.getIds(course.managers);
					course.posts[i].save();
				};
			}, function(err) {
			});
		});
	},

	migrate5: function(req, res) {
		//Notice (done)
		Posts
		.findByType('notice')
		.populate('notice')
		.exec(function callback(err, posts) {
			for (var i = posts.length - 1; i >= 0; i--) {
				if (posts[i].notice && posts[i].notice != null) {
					posts[i].seen_students = posts[i].notice.seen_students;
					posts[i].save();
				}
			};
		});
	}

};
