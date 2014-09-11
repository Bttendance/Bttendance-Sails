/**
 * MigrationController
 *
 * @description :: Server-side logic for managing migrations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

// For Develop (Drop all table and add new)
// heroku pgbackups:restore HEROKU_POSTGRESQL_MAROON 'https://s3-ap-northeast-1.amazonaws.com/herokubackup/a190.dump' --app bttendance-dev
// psql "dbname=d9vocafm0kncoe host=ec2-54-204-42-178.compute-1.amazonaws.com user=neqpefgtcbgyym password=ub0oR3o9VsAbGsuiYarNsx4yqw port=5432 sslmode=require"
// ALTER TABLE attendances RENAME TO attendance; ALTER TABLE clickers RENAME TO clicker; ALTER TABLE courses RENAME TO course; ALTER TABLE devices RENAME TO device; ALTER TABLE identifications RENAME TO identification; ALTER TABLE notices RENAME TO notice; ALTER TABLE posts RENAME TO post; ALTER TABLE questions RENAME TO question; ALTER TABLE schools RENAME TO school; ALTER TABLE settings RENAME TO setting; ALTER TABLE users RENAME TO "user";
// ALTER TABLE courses_managers__users_supervising_courses RENAME TO course_managers__user_supervising_courses; ALTER TABLE courses_students__users_attending_courses RENAME TO course_students__user_attending_courses; ALTER TABLE schools_professors__users_employed_schools RENAME TO school_professors__user_employed_schools; ALTER TABLE schools_students__users_enrolled_schools RENAME TO school_students__user_enrolled_schools;
// DROP TABLE tokens;

var Random = require('../utils/random');
var Arrays = require('../utils/arrays');

module.exports = {

	migrate: function(req, res) {

		//create Notice
		Posts
		.find()
		.populate('attendance')
		.sort('id ASC')
		.exec(function callback(err, posts) {
			if (err || !posts)
				return;

			async.eachSeries(posts, function (each_post, done) {
				if (each_post.type == 'notice') {
					Notices.create({
						post: each_post.id
					}).exec(function callback(err, notice) {
						if (err || !notice)
							done(err);

						if (each_post.course == null || !each_post.course || each_post.course == 'null')
							done();
						else {
							Courses
							.findOneById(each_post.course)
							.populate('students')
							.exec(function callback(err, course) {
								if (err || !course)
									done(err);

								notice.seen_students = Arrays.getIds(course.students);
								notice.save();

								Posts.update({ id: notice.post }, { notice: notice.id }).exec(function callback(err, updated_device) {
										done();
								});
							});
						}
					});
				} else if(each_post.type == 'attendance') {
					Courses
					.findOneById(each_post.course)
					.populate('managers')
					.exec(function callback(err, course) {
						if (err || !course)
							done(err);

						var checked_students = new Array();
						for (var i = 0; i < each_post.attendance.checked_students.length; i++) {
							var has_manager = false;
							for (var j = 0; j < course.managers.length; j++) {
								if (course.managers[j].id == each_post.attendance.checked_students[i]) {
									has_manager = true;
								}
							}

							if (!has_manager) {
								checked_students.push(each_post.attendance.checked_students[i]);
							} else {
								console.log(each_post.attendance.checked_students[i]);
							}
						}
						each_post.attendance.checked_students = checked_students;
						each_post.attendance.save(function callback(err) {
							done();
						});
					});
				} else
					done();
			}, function (err) {
				if (err == null)
					console.log('Create Notices && remove manager from attendance finished');
				else
					console.log(err);
			});
		});
	},

	migrate1: function(req, res) {

		//create Setting
		Users.find().sort('id ASC').exec(function callback(err, users) {
			if (err || !users)
				return;

			async.eachSeries(users, function (each_user, done) {
				if (!each_user.setting) {
					Settings.create({
						owner: each_user.id
					}).exec(function callback(err, setting) {
						if (err || !setting)
							done(err);
						Users.update({ id: setting.owner }, { setting: setting.id }).exec(function callback(err, updated_user) {
								done();
						});
					});
				} else
					done();
			}, function (err) {
				if (err == null)
					console.log('Create Setting finished');
				else
					console.log(err);
			});
		});
	},

	migrate2: function(req, res) {

		//create type, late_students
		Attendances
		.find()
		.sort('id ASC')
		.exec(function callback(err, attendances) {
			if (err || !attendances)
				return;

			for (var i = 0; i < attendances.length; i++) {
				attendances[i].type = 'auto';
				attendances[i].late_students = new Array();
				attendances[i].save();
			}
		});

		//user locale
		Users.find().sort('id ASC').exec(function callback(err, users) {
			if (err || !users)
				return;

			for (var i = 0; i < users.length; i++) {
				users[i].locale = 'en';
				users[i].save();
			}
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
		Schools.update({ name: 'ROKAF_ATC' }, { type: 'etc' }).exec(function callback(err, school){});
		Schools.update({ name: 'Institute of Technical Education' }, { type: 'university' }).exec(function callback(err, school){});

		// Add Opened/Code for all Courses
		Courses.find().sort('id ASC').exec(function callback(err, courses) {
			if (err || !courses)
				return;

			for ( index = 0; index < courses.length; index++) 
				Courses.update({ id: courses[index].id }, { opened: false, code: Random.string(4) }).exec(function callback(err, course){});
		});
	}
	
};

