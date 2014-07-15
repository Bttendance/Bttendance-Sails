/**
 * MigrationController
 *
 * @description :: Server-side logic for managing migrations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

// heroku pgbackups:restore HEROKU_POSTGRESQL_MAROON 'https://s3-ap-northeast-1.amazonaws.com/herokubackup/a121.dump' --app bttendance-dev
// psql "dbname=d9vocafm0kncoe host=ec2-54-204-42-178.compute-1.amazonaws.com user=neqpefgtcbgyym password=ub0oR3o9VsAbGsuiYarNsx4yqw port=5432 sslmode=require"

// DROP TABLE "user", course, school, post, serial, serials, serials_owners__users_serials, tokens;
// ALTER TABLE courses DROP COLUMN number CASCADE;
// ALTER TABLE schools DROP COLUMN logo_image CASCADE;
// ALTER TABLE schools DROP COLUMN website CASCADE;
// ALTER TABLE users DROP COLUMN username_lower CASCADE;
// ALTER TABLE users DROP COLUMN profile_image CASCADE;

// comment out courses code as unique constraint
// sails lift (for auto migration)
// call api for migration

// comment in courses code as unique constraint
// sails lift (for auto migration)

// uncomment for auto migration

var Random = require('../utils/random');

module.exports = {

	migrate: function(req, res) {

		//create Notice
		Posts.find().sort('id ASC').exec(function callback(err, posts) {
			if (err || !posts)
				return;

			async.eachSeries(posts, function (each_post, done) {
				if (each_post.type == 'notice') {
					Notices.create({
						post: each_post.id
					}).exec(function callback(err, notice) {
						if (err || !notice)
							done(err);
						Posts.update({ id: notice.post }, { notice: notice.id }).exec(function callback(err, updated_device) {
								done();
						});
					});
				} else
					done();
			}, function (err) {
				if (err == null)
					console.log('Create Notices finished');
				else
					console.log(err);
			});
		});

		//Update School Type
		Schools.update({ name: 'BTTENDANCE' }, { type: 'institute' }).exec(function callback(err, school){});
		Schools.update({ name: 'KAIST' }, { type: 'university' }).exec(function callback(err, school){});
		Schools.update({ name: 'Yonsei University' }, { type: 'university' }).exec(function callback(err, school){});
		Schools.update({ name: 'Seoul National University' }, { type: 'university' }).exec(function callback(err, school){});
		Schools.update({ name: 'Korea University' }, { type: 'university' }).exec(function callback(err, school){});
		Schools.update({ name: 'Postech' }, { type: 'university' }).exec(function callback(err, school){});
		Schools.update({ name: 'Hongik University' }, { type: 'university' }).exec(function callback(err, school){});
		Schools.update({ name: 'Harvard University' }, { type: 'university' }).exec(function callback(err, school){});
		Schools.update({ name: 'Stanford University' }, { type: 'university' }).exec(function callback(err, school){});
		Schools.update({ name: 'MIT' }, { type: 'university' }).exec(function callback(err, school){});
		Schools.update({ name: 'Gang Dong University' }, { type: 'university' }).exec(function callback(err, school){});
		Schools.update({ name: 'Seoul Science High School' }, { type: 'school' }).exec(function callback(err, school){});
		Schools.update({ name: 'ROKAF_ATC' }, { type: 'army' }).exec(function callback(err, school){});

		// Add Opened/Code for all Courses
		Courses.find().sort('id ASC').exec(function callback(err, courses) {
			if (err || !courses)
				return;

			for ( index = 0; index < courses.length; index++) 
				Courses.update({ id: courses[index].id }, { opened: false, code: Random.string(4) }).exec(function callback(err, course){});
		});
	},

	test: function(req, res) {
		var undef;
		Users.findOne({
		  or : [
		    { username: undef },
		    { email: 'apple1@apple.com' }
		  ]
		}).exec(function callback(err, user) {
			console.log(user);
		});
	}
	
};

