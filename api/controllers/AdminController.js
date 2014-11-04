/**
 * AdminController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var Moment = require('moment-timezone');
var Arrays = require('../utils/arrays');

module.exports = {

	show: function(req, res) {
		var password = req.param('password');
		var model = req.param('model');
		var id = req.param('id');
		var page = req.param('page');
		var email = req.param('email');
		var course = req.param('course');

		if (password != 'bttendance') {
			res.contentType('html');
			return res.forbidden('Your password doesn\'t match.');
		}

		if ( (model == 'User' && !email)
			&& (model == 'Post' && !course)
			&& (!id || isNaN(Number(id)))
			&& (!page || isNaN(Number(page))) ) {
			res.contentType('html');
			return res.forbidden('Numeric parameter id or page is required.');
		}

		if (model == 'User') {
			if (page)
				Users
				.find()
				.paginate({page: page, limit: 50})
				.populateAll()
				.sort('id DESC')
				.exec(function callback (err, users) {
					if (err || !users) {
						res.contentType('html');
						return res.notFound();
					} else {
						res.contentType('application/json; charset=utf-8');
						for (var i = 0; i < users.length; i++)
							users[i] = users[i].toWholeObject();
				  	return res.send(users);
					}
				});
			else 
				Users
				.findOne({
				  or : [
				    { id: id },
				    { email: email }
				  ]
				})
				.populateAll()
				.exec(function callback (err, user) {
					if (err || !user) {
						res.contentType('html');
						return res.notFound();
					} else {
						res.contentType('application/json; charset=utf-8');
				  	return res.send(user.toWholeObject());
					}
				});
		} else if (model == 'School') {
			if (page)
				Schools
				.find()
				.paginate({page: page, limit: 50})
				.populateAll()
				.sort('id DESC')
				.exec(function callback (err, schools) {
					if (err || !schools) {
						res.contentType('html');
						return res.notFound();
					} else {
						res.contentType('application/json; charset=utf-8');
						for (var i = 0; i < schools.length; i++)
							schools[i] = schools[i].toWholeObject();
				  	return res.send(schools);
					}
				});
			else 
				Schools
				.findOneById(Number(id))
				.populateAll()
				.exec(function callback (err, school) {
					if (err || !school) {
						res.contentType('html');
						return res.notFound();
					} else {
						res.contentType('application/json; charset=utf-8');
				  	return res.send(school.toWholeObject());
					}
				});
		} else if (model == 'Course') {
			if (page)
				Courses
				.find()
				.paginate({page: page, limit: 50})
				.populateAll()
				.sort('id DESC')
				.exec(function callback (err, courses) {
					if (err || !courses) {
						res.contentType('html');
						return res.notFound();
					} else {
						res.contentType('application/json; charset=utf-8');
						for (var i = 0; i < courses.length; i++)
							courses[i] = courses[i].toWholeObject();
				  	return res.send(courses);
					}
				});
			else 
				Courses
				.findOneById(Number(id))
				.populateAll()
				.exec(function callback (err, course) {
					if (err || !course) {
						res.contentType('html');
						return res.notFound();
					} else {
						res.contentType('application/json; charset=utf-8');
				  	return res.send(course.toWholeObject());
					}
				});
		} else if (model == 'ClickerQuestion') {
			if (page)
				ClickerQuestions
				.find()
				.paginate({page: page, limit: 50})
				.populateAll()
				.sort('id DESC')
				.exec(function callback (err, clicker_questions) {
					if (err || !clicker_questions) {
						res.contentType('html');
						return res.notFound();
					} else {
						res.contentType('application/json; charset=utf-8');
						for (var i = 0; i < clicker_questions.length; i++)
							clicker_questions[i] = clicker_questions[i].toWholeObject();
				  	return res.send(clicker_questions);
					}
				});
			else 
				ClickerQuestions
				.findOneById(Number(id))
				.populateAll()
				.exec(function callback (err, clicker_question) {
					if (err || !clicker_question) {
						res.contentType('html');
						return res.notFound();
					} else {
						res.contentType('application/json; charset=utf-8');
				  	return res.send(clicker_question.toWholeObject());
					}
				});
		} else if (model == 'AttendanceAlarm') {
			if (page)
				AttendanceAlarms
				.find()
				.paginate({page: page, limit: 50})
				.populateAll()
				.sort('id DESC')
				.exec(function callback (err, attendance_alarms) {
					if (err || !attendance_alarms) {
						res.contentType('html');
						return res.notFound();
					} else {
						res.contentType('application/json; charset=utf-8');
						for (var i = 0; i < attendance_alarms.length; i++)
							attendance_alarms[i] = attendance_alarms[i].toWholeObject();
				  	return res.send(attendance_alarms);
					}
				});
			else 
				AttendanceAlarms
				.findOneById(Number(id))
				.populateAll()
				.exec(function callback (err, attendance_alarm) {
					if (err || !attendance_alarm) {
						res.contentType('html');
						return res.notFound();
					} else {
						res.contentType('application/json; charset=utf-8');
				  	return res.send(attendance_alarm.toWholeObject());
					}
				});
		} else if (model == 'Post') {
			if (page)
				Posts
				.find()
				.paginate({page: page, limit: 50})
				.populateAll()
				.sort('id DESC')
				.exec(function callback (err, posts) {
					if (err || !posts) {
						res.contentType('html');
						return res.notFound();
					} else {
						res.contentType('application/json; charset=utf-8');
						for (var i = 0; i < posts.length; i++)
							posts[i] = posts[i].toWholeObject();
				  	return res.send(posts);
					}
				});
			else if (id)
				Posts
				.findOneById(Number(id))
				.populateAll()
				.exec(function callback (err, post) {
					if (err || !post) {
						res.contentType('html');
						return res.notFound();
					} else {
						res.contentType('application/json; charset=utf-8');
				  	return res.send(post.toWholeObject());
					}
				});
			else
				Posts
				.find({ where: { course: course }, sort: 'id DESC'})
				.populateAll()
				.exec(function callback (err, posts) {
					if (err || !posts) {
						res.contentType('html');
						return res.notFound();
					} else {
						res.contentType('application/json; charset=utf-8');
						for (var i = 0; i < posts.length; i++)
							posts[i] = posts[i].toWholeObject();
				  	return res.send(posts);
					}
				});
		} else if (model == 'Comment') {
			if (page)
				Comments
				.find()
				.paginate({page: page, limit: 50})
				.populateAll()
				.sort('id DESC')
				.exec(function callback (err, comments) {
					if (err || !comments) {
						res.contentType('html');
						return res.notFound();
					} else {
						res.contentType('application/json; charset=utf-8');
						for (var i = 0; i < comments.length; i++)
							comments[i] = comments[i].toWholeObject();
				  	return res.send(comments);
					}
				});
			else 
				Comments
				.findOneById(Number(id))
				.populateAll()
				.exec(function callback (err, comment) {
					if (err || !comment) {
						res.contentType('html');
						return res.notFound();
					} else {
						res.contentType('application/json; charset=utf-8');
				  	return res.send(comment.toWholeObject());
					}
				});
		} else if (model == 'Attendance') {
			if (page)
				Attendances
				.find()
				.paginate({page: page, limit: 50})
				.populateAll()
				.sort('id DESC')
				.exec(function callback (err, attendances) {
					if (err || !attendances) {
						res.contentType('html');
						return res.notFound();
					} else {
						res.contentType('application/json; charset=utf-8');
						for (var i = 0; i < attendances.length; i++)
							attendances[i] = attendances[i].toWholeObject();
				  	return res.send(attendances);
					}
				});
			else 
				Attendances
				.findOneById(Number(id))
				.populateAll()
				.exec(function callback (err, attendance) {
					if (err || !attendance) {
						res.contentType('html');
						return res.notFound();
					} else {
						res.contentType('application/json; charset=utf-8');
				  	return res.send(attendance.toWholeObject());
					}
				});
		} else if (model == 'Clicker') {
			if (page)
				Clickers
				.find()
				.paginate({page: page, limit: 50})
				.populateAll()
				.sort('id DESC')
				.exec(function callback (err, clickers) {
					if (err || !clickers) {
						res.contentType('html');
						return res.notFound();
					} else {
						res.contentType('application/json; charset=utf-8');
						for (var i = 0; i < clickers.length; i++)
							clickers[i] = clickers[i].toWholeObject();
				  	return res.send(clickers);
					}
				});
			else 
				Clickers
				.findOneById(Number(id))
				.populateAll()
				.exec(function callback (err, clicker) {
					if (err || !clicker) {
						res.contentType('html');
						return res.notFound();
					} else {
						res.contentType('application/json; charset=utf-8');
				  	return res.send(clicker.toWholeObject());
					}
				});
		} else if (model == 'Notice') {
			if (page)
				Notices
				.find()
				.paginate({page: page, limit: 50})
				.populateAll()
				.sort('id DESC')
				.exec(function callback (err, notices) {
					if (err || !notices) {
						res.contentType('html');
						return res.notFound();
					} else {
						res.contentType('application/json; charset=utf-8');
						for (var i = 0; i < notices.length; i++)
							notices[i] = notices[i].toWholeObject();
				  	return res.send(notices);
					}
				});
			else 
				Notices
				.findOneById(Number(id))
				.populateAll()
				.exec(function callback (err, notice) {
					if (err || !notice) {
						res.contentType('html');
						return res.notFound();
					} else {
						res.contentType('application/json; charset=utf-8');
				  	return res.send(notice.toWholeObject());
					}
				});
		} else if (model == 'Curious') {
			if (page)
				Curiouses
				.find()
				.paginate({page: page, limit: 50})
				.populateAll()
				.sort('id DESC')
				.exec(function callback (err, curiouses) {
					if (err || !curiouses) {
						res.contentType('html');
						return res.notFound();
					} else {
						res.contentType('application/json; charset=utf-8');
						for (var i = 0; i < curiouses.length; i++)
							curiouses[i] = curiouses[i].toWholeObject();
				  	return res.send(curiouses);
					}
				});
			else 
				Curiouses
				.findOneById(Number(id))
				.populateAll()
				.exec(function callback (err, curious) {
					if (err || !curious) {
						res.contentType('html');
						return res.notFound();
					} else {
						res.contentType('application/json; charset=utf-8');
				  	return res.send(curious.toWholeObject());
					}
				});
		} else if (model == 'Device') {
			if (page)
				Devices
				.find()
				.paginate({page: page, limit: 50})
				.populateAll()
				.sort('id DESC')
				.exec(function callback (err, devices) {
					if (err || !devices) {
						res.contentType('html');
						return res.notFound();
					} else {
						res.contentType('application/json; charset=utf-8');
						for (var i = 0; i < devices.length; i++)
							devices[i] = devices[i].toWholeObject();
				  	return res.send(devices);
					}
				});
			else 
				Devices
				.findOneById(Number(id))
				.populateAll()
				.exec(function callback (err, device) {
					if (err || !device) {
						res.contentType('html');
						return res.notFound();
					} else {
						res.contentType('application/json; charset=utf-8');
				  	return res.send(device.toWholeObject());
					}
				});
		} else if (model == 'Setting') {
			if (page)
				Settings
				.find()
				.paginate({page: page, limit: 50})
				.populateAll()
				.sort('id DESC')
				.exec(function callback (err, settings) {
					if (err || !settings) {
						res.contentType('html');
						return res.notFound();
					} else {
						res.contentType('application/json; charset=utf-8');
						for (var i = 0; i < settings.length; i++)
							settings[i] = settings[i].toWholeObject();
				  	return res.send(settings);
					}
				});
			else 
				Settings
				.findOneById(Number(id))
				.populateAll()
				.exec(function callback (err, setting) {
					if (err || !setting) {
						res.contentType('html');
						return res.notFound();
					} else {
						res.contentType('application/json; charset=utf-8');
				  	return res.send(setting.toWholeObject());
					}
				});
		} else if (model == 'Identification') {
			if (page)
				Identifications
				.find()
				.paginate({page: page, limit: 50})
				.populateAll()
				.sort('id DESC')
				.exec(function callback (err, identifications) {
					if (err || !identifications) {
						res.contentType('html');
						return res.notFound();
					} else {
						res.contentType('application/json; charset=utf-8');
						for (var i = 0; i < identifications.length; i++)
							identifications[i] = identifications[i].toWholeObject();
				  	return res.send(identifications);
					}
				});
			else 
				Identifications
				.findOneById(Number(id))
				.populateAll()
				.exec(function callback (err, identification) {
					if (err || !identification) {
						res.contentType('html');
						return res.notFound();
					} else {
						res.contentType('application/json; charset=utf-8');
				  	return res.send(identification.toWholeObject());
					}
				});
		} else {
			res.contentType('html');
			return res.forbidden('Check out your model parameter.');
		}

	},

	user: function(req, res) {
		var password = req.param('password');
		var start = req.param('start');
		var end = req.param('end');

		if (password != 'bttendance') {
			res.contentType('html');
			return res.forbidden('Your password doesn\'t match.');
		}

		if (!start) {
			res.contentType('html');
			return res.forbidden('Check out your model parameter.');
		}

		var startDate = Moment.tz(start, "Asia/Seoul").zone("+00:00").format();
		var endDate;
		if (!end)
			endDate = Moment.tz("Asia/Seoul").zone("+00:00").format();
		else
			endDate = Moment.tz(end, "Asia/Seoul").zone("+00:00").format();

		if (startDate == 'Invalid date') {
			res.contentType('html');
			return res.forbidden('Start is not valid format date.');
		}

		if (endDate == 'Invalid date') {
			res.contentType('html');
			return res.forbidden('End is not valid format date.');
		}

		Users
		.find({ createdAt: { 
			'>': startDate, 
			'<': endDate } })
		.exec(function callback(err, users) {
			if (err || !users) {
				res.contentType('html');
				return res.notFound();
			} else {
				res.contentType('application/json; charset=utf-8');
				var result = {};
				result.user_count = users.length;
				return res.send(result);
			}
		});
	},

	analyze: function(req, res) {
		var password = req.param('password');
		var start = req.param('start');
		var end = req.param('end');

		if (password != 'bttendance') {
			res.contentType('html');
			return res.forbidden('Your password doesn\'t match.');
		}

		if (!start) {
			res.contentType('html');
			return res.forbidden('Check out your model parameter.');
		}

		var startDate = Moment.tz(start, "Asia/Seoul").zone("+00:00").format();
		var endDate;
		if (!end)
			endDate = Moment.tz("Asia/Seoul").zone("+00:00").format();
		else
			endDate = Moment.tz(end, "Asia/Seoul").zone("+00:00").format();

		if (startDate == 'Invalid date') {
			res.contentType('html');
			return res.forbidden('Start is not valid format date.');
		}

		if (endDate == 'Invalid date') {
			res.contentType('html');
			return res.forbidden('End is not valid format date.');
		}

		Courses
		.find({ createdAt: { 
			'>': startDate, 
			'<': endDate } })
		.sort('createdAt DESC')
		.populate('students')
		.exec(function callback(err, courses) {
			if (err || !courses) {
				res.contentType('html');
				return res.notFound();
			} else {
				res.contentType('application/json; charset=utf-8');

				var result = {};
				result.course_count = courses.length;

				for (var i = 0; i < courses.length; i++)
					courses[i].students_count = courses[i].students.length;

				var courses_over_5_ids = new Array();
				for (var i = 0; i < courses.length; i++) 
					if (courses[i].students.length >= 5)
						courses_over_5_ids.push(courses[i].id);

				result.student_over_5 = courses_over_5_ids.length;

				Courses
				.find(courses_over_5_ids)
				.populate('managers')
				.populate('students')
				.populate('posts')
				.exec(function callback(err, courses_over_5) {
					if (err || !courses_over_5)
						res.send(result);

					var active = 0;
					var active_managers = new Array();

					for (var i = 0; i < courses_over_5.length; i++) {
						courses_over_5[i].managers_count = courses_over_5[i].managers.length;
						courses_over_5[i].students_count = courses_over_5[i].students.length;
						courses_over_5[i].posts_count = courses_over_5[i].posts.length;

						var professors = new Array();
						for (var j = 0; j < courses_over_5[i].managers.length; j++)
							professors.push(courses_over_5[i].managers[j].toJSON());
						courses_over_5[i].professors = professors;

						var isActive = false;
						for (var j = 0; j < courses_over_5[i].posts.length; j++) {
							if (-Moment(courses_over_5[i].posts[j].createdAt).diff(Moment(endDate), 'days') < 14) {
								isActive = true;

								var add = true;
								for (var l = 0; l < active_managers.length; l++)
									if (courses_over_5[i].managers.length >= 1 && active_managers[l].id == courses_over_5[i].managers[0].id)
										add = false;
								if (add)
									active_managers.push(courses_over_5[i].managers[0]);
							}
						}
						if (isActive)
							active++;
						courses_over_5[i].active = isActive;
					}

					result.active = active;
					result.active_managers_count = active_managers.length;
					result.courses_over_5 = courses_over_5;
					res.send(result);
				});
			}
		});
	},

	emails: function(req, res) {
		var password = req.param('password');
		var page = req.param('page');

		if (password != 'bttendance') {
			res.contentType('html');
			return res.forbidden('Your password doesn\'t match.');
		}

		if (!page) {
			res.contentType('html');
			return res.forbidden('Page is required.');
		}

		var type = req.param('type'); //non-student, student, professor, non-professor, all
		if (!type)
			type = 'all';
		
		Users
		.find()
		.sort('id DESC')
		.paginate({page: page, limit: 100})
		.populate('supervising_courses')
		.populate('attending_courses')
		.exec(function callback (err, users) {
			if (err || !users) {
				res.contentType('html');
				return res.notFound();
			} else {
				res.contentType('application/json; charset=utf-8');
				var emails = new Array();
				if (type == 'all')
					for (var i = 0; i < users.length; i++)
						emails.push(users[i].toJSON());

				if (type == 'non-student')
					for (var i = 0; i < users.length; i++)
						if (users[i].attending_courses.length == 0)
							emails.push(users[i].toJSON());

				if (type == 'student')
					for (var i = 0; i < users.length; i++)
						if (users[i].attending_courses.length > 0)
							emails.push(users[i].toJSON());

				if (type == 'professor')
					for (var i = 0; i < users.length; i++)
						if (users[i].supervising_courses.length > 0)
							emails.push(users[i].toJSON());

				if (type == 'non-professor')
					for (var i = 0; i < users.length; i++)
						if (users[i].supervising_courses.length == 0)
							emails.push(users[i].toJSON());

				var json = {};
				json.emails = emails;
		  	return res.send(json);
			}
		});
	},

	noti: function(req, res) {
		// Users
		// .findOneByEmail('thefinestartist@bttendance.com')
		// .populateAll()
		// .exec(function callback(err, user) {
		// 	var Noti = require('../utils/notifications');
		// 	Noti.send(user, "BTTENDANCE", "You have succeed to send a message.", "message", 0);
		// 	return res.send(user.toWholeObject());
		// });
	}
	
};
