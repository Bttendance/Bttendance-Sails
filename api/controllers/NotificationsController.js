/**
 * NotificationsController
 *
 * @description :: Server-side logic for managing notifications
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var Error = require('../utils/errors');

module.exports = {
	
	update_attendance: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var email = req.param('email');
		var attendance = req.param('attendance');

		Users.findOneByEmail(email)
		.populate('device')
		.populate('notification')
		.populate('supervising_courses')
		.populate('attending_courses')
		.populate('employed_schools')
		.populate('enrolled_schools')
		.populate('identifications')
		.exec(function callback(err, user) {
			if (err || !user)
				return res.send(500, Error.alert(req, "Update Setting Error", "Attendance notification setting update has some error."));

			if (attendance == 'false' || attendance == 'NO')
				user.notification.attendance = false;
			else
				user.notification.attendance = true;

		  user.notification.save(function callback(err) {
		   	if (err)
					return res.send(500, Error.alert(req, "Update Setting Error", "Attendance notification setting update has some error."));
		  	return res.send(user.toWholeObject());
	    });
		});
	},

	update_clicker: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var email = req.param('email');
		var clicker = req.param('clicker');

		Users.findOneByEmail(email)
		.populate('device')
		.populate('notification')
		.populate('supervising_courses')
		.populate('attending_courses')
		.populate('employed_schools')
		.populate('enrolled_schools')
		.populate('identifications')
		.exec(function callback(err, user) {
			if (err || !user)
				return res.send(500, Error.alert(req, "Update Setting Error", "Poll notification setting update has some error."));

			if (clicker == 'false' || clicker == 'NO')
				user.notification.clicker = false;
			else
				user.notification.clicker = true;

		  user.notification.save(function callback(err) {
		   	if (err)
					return res.send(500, Error.alert(req, "Update Setting Error", "Poll notification setting update has some error."));
		  	return res.send(user.toWholeObject());
	    });
		});
	},

	update_notice: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var email = req.param('email');
		var notice = req.param('notice');

		Users.findOneByEmail(email)
		.populate('device')
		.populate('notification')
		.populate('supervising_courses')
		.populate('attending_courses')
		.populate('employed_schools')
		.populate('enrolled_schools')
		.populate('identifications')
		.exec(function callback(err, user) {
			if (err || !user)
				return res.send(500, Error.alert(req, "Update Setting Error", "Notice notification setting update has some error."));

			if (notice == 'false' || notice == 'NO')
				user.notification.notice = false;
			else
				user.notification.notice = true;

		  user.notification.save(function callback(err) {
		   	if (err)
					return res.send(500, Error.alert(req, "Update Setting Error", "Notice notification setting update has some error."));
		  	return res.send(user.toWholeObject());
	    });
		});
	}
	
};

