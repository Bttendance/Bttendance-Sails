/**
 * MigrationController
 *
 * @description :: Server-side logic for managing migrations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

// For Develop (Drop all table and add new)
// psql "dbname=d9vocafm0kncoe host=ec2-54-204-42-178.compute-1.amazonaws.com user=neqpefgtcbgyym password=ub0oR3o9VsAbGsuiYarNsx4yqw port=5432 sslmode=require"
// heroku pgbackups:restore HEROKU_POSTGRESQL_MAROON 'https://s3-ap-northeast-1.amazonaws.com/herokubackup/a238.dump' --app bttendance-dev

// For Production
// heroku maintenance:on
// heroku ps:scale worker=0

/**** Do work ****/

// heroku ps:scale worker=1
// heroku maintenance:off

// 1. sails lift (migration alter)
// 2. migrate api

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
	},

	migrate2: function(req, res) {

			Questions
			.create({
				message: 'Hello',
				choice_count: 2,
				progress_time: 60,
				show_info_on_select: true,
				detail_privacy: 'all',
				owner: 1
			}).exec(function callback(err, question) {
				console.log(err);
			});

		// question
		// Questions
		// .find()
		// .exec(function callback(err, questions) {
		// 	async.each(questions, function(question, next) {

		// 		if (!question.owner || question.owner == null)
		// 			next();
		// 		else {
		// 			Users
		// 			.findOneById(question.owner)
		// 			.populate('supervising_courses')
		// 			.exec(function callback(err, user) {
		// 				if (user && user != null && user.supervising_courses && user.supervising_courses != null) {
		// 					for (var i = user.supervising_courses.length - 1; i >= 0; i--) {
		// 						console.log(user.supervising_courses[i]);
		// 						ClickerQuestions.create({
		// 							author: question.owner,
		// 							message: question.message,
		// 							choice_count: question.choice_count,
		// 							progress_time: question.progress_time,
		// 							detail_privacy: question.detail_privacy,
		//							show_info_on_select: question.show_info_on_select,
		// 							course: user.supervising_courses[i].id
		// 						}).exec(function(err, clickerQuestion) {
		// 							console.log(err);
		// 						});
		// 					}
		// 				}
		// 				next();
		// 			});
		// 		}

		// 	}, function(err) {
		// 	});
		// });
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

