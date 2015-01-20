/**
 * AttendancesController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var Noti = require('../utils/notifications');
var Error = require('../utils/errors');
var Arrays = require('../utils/arrays');
var Moment = require('moment');

module.exports = {

	from_courses: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var course_ids = req.param('course_ids');

		Posts
		.find({
			type: 'attendance',
			course: course_ids,
			createdAt: { 
				'>': Moment().subtract(65, 's').format()
			}
		})
		.populate('attendance')
  	.exec(function callback(err, posts) {
  		if (err || !posts)
    		return res.send(new Array());

  		var autoAttds = new Array();
  		for (var i = 0; i < posts.length; i++)
  			if (posts[i].attendance.type == 'auto')
  				autoAttds.push(posts[i].attendance.id);
  		return res.send(autoAttds);
  	});
	},

	found_device: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var email = req.param('email');
		var attendance_id = req.param('attendance_id');
		var uuid = req.param('uuid');

		Bttendance
		.create({
			attendanceID : attendance_id,
			email : email,
			uuid : uuid
		}).exec(function callback(err, attendanceCluser) {
		  	return res.ok();
		});
	},

	check_manually: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var user_id = req.param('user_id');
		var attendance_id = req.param('attendance_id');

		Users
		.findOneById(user_id)
		.populateAll()
		.exec(function callback(err, user) {
			if (err || !user)
  			return res.send(500, Error.alert(req, "Manual Check Error", "Student doesn't exist."));

  		Attendances
  		.findOneById(attendance_id)
  		.populateAll()
  		.exec(function callback(err, attendance) {
				if (err || !attendance)
	  			return res.send(500, Error.alert(req, "Manual Check Error", "Attendance record doesn't exist."));

				var has_user = false;
				
				var checked_students = new Array();
				for (var i = 0; i < attendance.checked_students.length; i++) {
					var id = attendance.checked_students[i];
					if (id == user.id)
						has_user = true;
					checked_students.push(id);
				}
				
				var late_students = new Array();
				for (var i = 0; i < attendance.late_students.length; i++) {
					var id = attendance.late_students[i];
					if (id == user.id)
						has_user = false;
					else
						late_students.push(id);
				}

				if (!has_user) {
					checked_students.push(user.id);
					attendance.checked_students = checked_students;
					attendance.late_students = late_students;
					attendance.save(function callback(err) {
						if (err)
			  			return res.send(500, Error.alert(req, "Manual Check Error", "Updating attendance record has been failed."));

						Posts
						.findOneById(attendance.post.id)
						.populateAll()
						.exec(function callback(err, post) {
							if (err || !post)
				  			return res.send(500, Error.alert(req, "Manual Check Error", "Manual attendance check failed. Please try again."));

					  	return res.send(attendance.toWholeObject());
						});
					});
				} else {
			  	return res.send(attendance.toWholeObject());
				}
  		})
		})
	},

	uncheck_manually: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var user_id = req.param('user_id');
		var attendance_id = req.param('attendance_id');

		Users
		.findOneById(user_id)
		.populateAll()
		.exec(function callback(err, user) {
			if (err || !user)
  			return res.send(500, Error.alert(req, "Manual Un-Check Error", "Student doesn't exist."));

  		Attendances
  		.findOneById(attendance_id)
  		.populateAll()
  		.exec(function callback(err, attendance) {
				if (err || !attendance)
	  			return res.send(500, Error.alert(req, "Manual Un-Check Error", "Attendance record doesn't exist."));

				var has_user = false;
				
				var checked_students = new Array();
				for (var i = 0; i < attendance.checked_students.length; i++) {
					var id = attendance.checked_students[i];
					if (id == user.id)
						has_user = true;
					else
						checked_students.push(id);
				}
				
				var late_students = new Array();
				for (var i = 0; i < attendance.late_students.length; i++) {
					var id = attendance.late_students[i];
					if (id == user.id)
						has_user = true;
					else
						late_students.push(id);
				}

				if (has_user) {
					attendance.checked_students = checked_students;
					attendance.late_students = late_students;
					attendance.save(function callback(err) {
						if (err)
			  			return res.send(500, Error.alert(req, "Manual Un-Check Error", "Updating attendance record has been failed."));

						Posts
						.findOneById(attendance.post.id)
						.populateAll()
						.exec(function callback(err, post) {
							if (err || !post)
				  			return res.send(500, Error.alert(req, "Manual Un-Check Error", "Manual attendance un-check failed. Please try again."));

					  	return res.send(attendance.toWholeObject());
						});
					});
				} else {
			  	return res.send(attendance.toWholeObject());
				}

  		})
		})
	},

	toggle_manually: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var user_id = req.param('user_id');
		var attendance_id = req.param('attendance_id');

		Users
		.findOneById(user_id)
		.populateAll()
		.exec(function callback(err, user) {
			if (err || !user)
  			return res.send(500, Error.alert(req, "Manual Check Error", "Student doesn't exist."));

  		Attendances
  		.findOneById(attendance_id)
  		.populateAll()
  		.exec(function callback(err, attendance) {
				if (err || !attendance)
	  			return res.send(500, Error.alert(req, "Manual Check Error", "Attendance record doesn't exist."));

				var late_user = false;
				var late_students = new Array();
				for (var i = 0; i < attendance.late_students.length; i++) {
					var id = attendance.late_students[i];
					if (id == user.id)
						late_user = true;
					else
						late_students.push(id);
				}
				
				var check_user = false;
				var checked_students = new Array();
				for (var i = 0; i < attendance.checked_students.length; i++) {
					var id = attendance.checked_students[i];
					if (id == user.id)
						check_user = true;
					else
						checked_students.push(id);
				}

				// check => late
				if (check_user)
					late_students.push(user.id);

				// late => uncheck (do nothing)

				// uncheck => check
				if (!check_user && !late_user)
					checked_students.push(user.id);

				attendance.checked_students = checked_students;
				attendance.late_students = late_students;
				attendance.save(function callback(err) {
					if (err)
		  			return res.send(500, Error.alert(req, "Manual Check Error", "Updating attendance record has been failed."));

					Posts
					.findOneById(attendance.post.id)
					.populateAll()
					.exec(function callback(err, post) {
						if (err || !post)
			  			return res.send(500, Error.alert(req, "Manual Check Error", "Manual attendance check failed. Please try again."));

				  	return res.send(attendance.toWholeObject());
					});
				});
  		})
		})
	}

};
