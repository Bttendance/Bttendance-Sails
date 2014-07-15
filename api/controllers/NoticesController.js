/**
 * NoticesController
 *
 * @description :: Server-side logic for managing notices
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
	seen: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var user_id = req.param('user_id');
		var attendance_id = req.param('attendance_id');

		Users
		.findOneById(user_id)
		.populate('device')
		.populate('supervising_courses')
		.exec(function callback(err, user) {
			if (err || !user)
  			return res.send(404, Error.alert(req, "Manual Check Error", "Student doesn't exist."));

  		Attendances
  		.findOneById(attendance_id)
  		.populate('post')
  		.exec(function callback(err, attendance) {
				if (err || !attendance)
	  			return res.send(404, Error.alert(req, "Manual Check Error", "Attendance record doesn't exist."));

				var checked_students = new Array();
				var has_user = false;
				for (var i = 0; i < attendance.checked_students.length; i++) {
					var id = attendance.checked_students[i];
					checked_students.push(id);
					if (id == user.id)
						has_user = true;
				}

				if (!has_user) {
					checked_students.push(user.id);

					attendance.checked_students = checked_students;
					attendance.save(function callback(err) {
						if (err)
			  			return res.send(404, Error.alert(req, "Manual Check Error", "Updating attendance record has been failed."));

						Posts
						.findOneById(attendance.post.id)
						.populate('course')
						.exec(function callback(err, post) {
							if (err || !post)
				  			return res.send(404, Error.alert(req, "Manual Check Error", "Manual attendance check failed. Please try again."));

							Noti.send(user, post.course.name, "Attendance has been checked manually", "attendance_checked");
					  	return res.send(attendance.toWholeObject());
						});
					});
				} else {
			  	return res.send(attendance.toWholeObject());
				}

  		})
		})
	},
	
	resend: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var user_id = req.param('user_id');
		var attendance_id = req.param('attendance_id');

		Users
		.findOneById(user_id)
		.populate('device')
		.populate('supervising_courses')
		.exec(function callback(err, user) {
			if (err || !user)
  			return res.send(404, Error.alert(req, "Manual Check Error", "Student doesn't exist."));

  		Attendances
  		.findOneById(attendance_id)
  		.populate('post')
  		.exec(function callback(err, attendance) {
				if (err || !attendance)
	  			return res.send(404, Error.alert(req, "Manual Check Error", "Attendance record doesn't exist."));

				var checked_students = new Array();
				var has_user = false;
				for (var i = 0; i < attendance.checked_students.length; i++) {
					var id = attendance.checked_students[i];
					checked_students.push(id);
					if (id == user.id)
						has_user = true;
				}

				if (!has_user) {
					checked_students.push(user.id);

					attendance.checked_students = checked_students;
					attendance.save(function callback(err) {
						if (err)
			  			return res.send(404, Error.alert(req, "Manual Check Error", "Updating attendance record has been failed."));

						Posts
						.findOneById(attendance.post.id)
						.populate('course')
						.exec(function callback(err, post) {
							if (err || !post)
				  			return res.send(404, Error.alert(req, "Manual Check Error", "Manual attendance check failed. Please try again."));

							Noti.send(user, post.course.name, "Attendance has been checked manually", "attendance_checked");
					  	return res.send(attendance.toWholeObject());
						});
					});
				} else {
			  	return res.send(attendance.toWholeObject());
				}

  		})
		})
	}
};

