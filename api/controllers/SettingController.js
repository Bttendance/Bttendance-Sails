/**
 * SettingsController
 *
 * @description :: Server-side logic for managing settings
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var Error = require('../utils/errors');

module.exports = {
	
	update_attendance: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var email = req.param('email');
		var attendance = req.param('attendance');

		Users
		.findOneByEmail(email)
		.populateAll()
		.exec(function callback(err, user) {
			if (err || !user || !user.setting)
				return res.send(500, Error.alert(req, "Update Setting Error", "Attendance notification setting update has some error."));

			if (attendance == 'false' || attendance == 'NO')
				user.setting.attendance = false;
			else
				user.setting.attendance = true;

		  user.setting.save(function callback(err) {
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

		Users
		.findOneByEmail(email)
		.populateAll()
		.exec(function callback(err, user) {
			if (err || !user || !user.setting)
				return res.send(500, Error.alert(req, "Update Setting Error", "Poll notification setting update has some error."));

			if (clicker == 'false' || clicker == 'NO')
				user.setting.clicker = false;
			else
				user.setting.clicker = true;

		  user.setting.save(function callback(err) {
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

		Users
		.findOneByEmail(email)
		.populateAll()
		.exec(function callback(err, user) {
			if (err || !user || !user.setting)
				return res.send(500, Error.alert(req, "Update Setting Error", "Notice notification setting update has some error."));

			if (notice == 'false' || notice == 'NO')
				user.setting.notice = false;
			else
				user.setting.notice = true;

		  user.setting.save(function callback(err) {
		   	if (err)
					return res.send(500, Error.alert(req, "Update Setting Error", "Notice notification setting update has some error."));
		  	return res.send(user.toWholeObject());
	    });
		});
	}
	
};

