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

		if (password != 'bttendance') {
			res.contentType('html');
			return res.forbidden('Your password doesn\'t match.');
		}

		if ( isNaN(Number(id)) && id != 'all' ) {
			res.contentType('html');
			return res.forbidden('Check out your id parameter.');
		}

		if (model == 'users') {
			if (id == 'all')
				Users
				.find()
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
				.findOneById(Number(id))
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
		} else if (model == 'schools') {
			if (id == 'all')
				Schools
				.find()
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
		} else if (model == 'courses') {
			if (id == 'all')
				Courses
				.find()
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
		} else if (model == 'posts') {
			if (id == 'all')
				Posts
				.find()
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
		} else if (model == 'devices') {
			if (id == 'all')
				Devices
				.find()
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
		} else if (model == 'notifications') {
			if (id == 'all')
				Notifications
				.find()
				.populateAll()
				.sort('id DESC')
				.exec(function callback (err, notifications) {
					if (err || !notifications) {
						res.contentType('html');
						return res.notFound();
					} else {
						res.contentType('application/json; charset=utf-8');
						for (var i = 0; i < notifications.length; i++)
							notifications[i] = notifications[i].toWholeObject();
				  	return res.send(notifications);
					}
				});
			else 
				Notifications
				.findOneById(Number(id))
				.populateAll()
				.exec(function callback (err, notification) {
					if (err || !notification) {
						res.contentType('html');
						return res.notFound();
					} else {
						res.contentType('application/json; charset=utf-8');
				  	return res.send(notification.toWholeObject());
					}
				});
		} else if (model == 'identifications') {
			if (id == 'all')
				Identifications
				.find()
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
		} else if (model == 'attendances') {
			if (id == 'all')
				Attendances
				.find()
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
		} else if (model == 'clickers') {
			if (id == 'all')
				Clickers
				.find()
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
		} else if (model == 'notices') {
			if (id == 'all')
				Notices
				.find()
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
		
		Users
		.find()
		.sort('id DESC')
		.exec(function callback (err, users) {
			if (err || !users) {
				res.contentType('html');
				return res.notFound();
			} else {
				res.contentType('application/json; charset=utf-8');
				var emails = new Array();
				for (var i = 0; i < users.length; i++)
					emails.push(users[i].email);
				var json = {};
				json.emails = emails;
		  	return res.send(json);
			}
		});
	},

	noti: function(req, res) {
		Users
		.findOneByUsername('galaxys2')
		.populateAll()
		.exec(function callback(err, user) {
			var Noti = require('../utils/notifications');
			Noti.send(user, "BTTENDANCE", "You have succeed to send a message.", "message");
			return res.send(user.toWholeObject());
		});
	}
	
};
