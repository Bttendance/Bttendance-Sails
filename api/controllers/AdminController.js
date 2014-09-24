/**
 * AdminController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

	show: function(req, res) {
		var password = req.param('password');
		var model = req.param('model');
		var id = req.param('id');
		var page = req.param('page');
		var email = req.param('email');

		if (password != 'bttendance') {
			res.contentType('html');
			return res.forbidden('Your password doesn\'t match.');
		}

		if ( (model == 'user' && !email)
			&& (!id || isNaN(Number(id)))
			&& (!page || isNaN(Number(page))) ) {
			res.contentType('html');
			return res.forbidden('Numeric parameter id or page is required.');
		}

		if (model == 'user') {
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
		} else if (model == 'school') {
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
		} else if (model == 'course') {
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
		} else if (model == 'post') {
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
			else 
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
		} else if (model == 'attendance') {
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
		} else if (model == 'clicker') {
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
		} else if (model == 'notice') {
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
		} else if (model == 'question') {
			if (page)
				Questions
				.find()
				.paginate({page: page, limit: 50})
				.populateAll()
				.sort('id DESC')
				.exec(function callback (err, questions) {
					if (err || !questions) {
						res.contentType('html');
						return res.notFound();
					} else {
						res.contentType('application/json; charset=utf-8');
						for (var i = 0; i < questions.length; i++)
							questions[i] = questions[i].toWholeObject();
				  	return res.send(questions);
					}
				});
			else 
				Questions
				.findOneById(Number(id))
				.populateAll()
				.exec(function callback (err, question) {
					if (err || !question) {
						res.contentType('html');
						return res.notFound();
					} else {
						res.contentType('application/json; charset=utf-8');
				  	return res.send(question.toWholeObject());
					}
				});
		} else if (model == 'device') {
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
		} else if (model == 'setting') {
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
		} else if (model == 'identification') {
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

	emails: function(req, res) {
		var password = req.param('password');

		if (password != 'bttendance') {
			res.contentType('html');
			return res.forbidden('Your password doesn\'t match.');
		}

		var type = req.param('type'); //non-student, student, professor, non-professor, all
		if (!type)
			type = 'all';
		
		Users
		.find()
		.sort('id DESC')
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
		// .findOneByUsername('galaxys2')
		// .populateAll()
		// .exec(function callback(err, user) {
		// 	var Noti = require('../utils/notifications');
		// 	Noti.send(user, "BTTENDANCE", "You have succeed to send a message.", "message", 0);
		// 	return res.send(user.toWholeObject());
		// });
	}
	
};
