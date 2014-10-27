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

	migrate: function(req, res) {

		//seen_students, seen_managers

		// question
		Questions
		.find()
		.exec(function callback(err, questions) {
			Sails.async.each(questions, function(question, callback) {

				Users
				.findOneById(question.author)
				.populate('supervising_courses')
				.exec(function callback(user, err) {

					Sails.async.each(user.supervising_courses, function(course, callback) {
						ClickerQuestions.create({
							author: question.author,
							message: question.message,
							choice_count: question.choice_count,
							progress_time: question.progress_time,
							detail_privacy: question.detail_privacy,
							course: course.id
						}).exec(function(clickerQuestion, err) {

						});
					} , function(err) {
					});

				});

			}, function(err) {
			});
		});

		// setting
		Settings
		.find()
		.exec(function callback(err, settings) {
			for (var i = 0; i < settings.length; i++) {
				settings[i].curious = true;
				settings[i].save();
			}
		});
	}
	
};

