/**
 * AttendanceAlarmsController
 *
 * @description :: Server-side logic for managing alarms
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var Error = require('../utils/errors');
var Moment = require('moment-timezone');
var Cron = require('cron');

module.exports = {
	
	course: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var course_id = req.param('course_id');

		AttendanceAlarms
		.find({
			course: course_id
		})
		.sort('id DESC')
		.populateAll()
		.exec(function callback(err, attendanceAlarms) {
			if (err || !attendanceAlarms)
				return res.send(500, Error.log(req, "Get Alarms Error", "Alarms doesn't exist."));

			for (var i = 0; i < attendanceAlarms.length; i++)
				attendanceAlarms[i] = attendanceAlarms[i].toWholeObject();
	  	return res.send(attendanceAlarms);
		});
	},

	create: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var email = req.param('email');
		var course_id = req.param('course_id');
		var scheduled_at = req.param('scheduled_at');

		Users
		.findOneByEmail(email)
		.exec(function callback(err, user) {
			if (err || !user)
				return res.send(500, Error.log(req, "Create Alarms Error", "User doesn't exist."));

  		AttendanceAlarms
			.create({
				scheduled_at: scheduled_at,
				author: user.id,
				course: course_id
			}).exec(function callback(err, attendanceAlarm) {
		  	if (err || !attendanceAlarm)
					return res.send(500, Error.log(req, "Create Alarms Error", "Fail to create alarm."));

	  		AttendanceAlarms
	  		.findOneById(attendanceAlarm.id)
	  		.populateAll()
	  		.exec(function callback(err, attendanceAlarm) {
					if (err || !attendanceAlarm)
						return res.send(500, Error.log(req, "Create Alarms Error", "Alarm doesn't exist."));

			  	return res.send(attendanceAlarm.toWholeObject());
	  		});
			});
		});
	},

	on: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var attendance_alarm_id = req.param('attendance_alarm_id');

		AttendanceAlarms
		.findOneById(attendance_alarm_id)
		.populateAll()
		.exec(function callback(err, attendanceAlarm) {
			if (err || !attendanceAlarm)
				return res.send(500, Error.alert(req, "Update Alarms Error", "Fail to find current alarm."));

			attendanceAlarm.on = true;
			attendanceAlarm.save(function callback(err) {
				if (err)
					return res.send(500, Error.alert(req, "Update Alarms Error", "Updating alarm error."));

		  	return res.send(attendanceAlarm.toWholeObject());
			});
		});
	},

	off: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var attendance_alarm_id = req.param('attendance_alarm_id');

		AttendanceAlarms
		.findOneById(attendance_alarm_id)
		.populateAll()
		.exec(function callback(err, attendanceAlarm) {
			if (err || !attendanceAlarm)
				return res.send(500, Error.alert(req, "Update Alarms Error", "Fail to find current alarm."));

			attendanceAlarm.on = false;
			attendanceAlarm.save(function callback(err) {
				if (err)
					return res.send(500, Error.alert(req, "Update Alarms Error", "Updating alarm error."));

		  	return res.send(attendanceAlarm.toWholeObject());
			});
		});
	},

	remove: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var attendance_alarm_id = req.param('attendance_alarm_id');

		AttendanceAlarms
		.findOneById(attendance_alarm_id)
		.populateAll()
		.exec(function callback(err, attendanceAlarm) {
			if (err || !attendanceAlarm)
				return res.send(500, Error.alert(req, "Delete Alarms Error", "Fail to find current alarm."));

			attendanceAlarm.course = null;
			attendanceAlarm.save(function callback(err) {
				if (err)
					return res.send(500, Error.alert(req, "Delete Alarms Error", "Deleting alarm error."));

		  	return res.send(attendanceAlarm.toWholeObject());
			});
		});
	}
	
};

