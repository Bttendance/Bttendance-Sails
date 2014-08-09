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

		Courses
		.findById(course_ids)
		.populateAll()
		.exec(function callback(err, courses) {
			if (err || !courses)
  			return res.send(500, Error.log(req, "Find attendance checking IDs Error", "Fail to find courses."));

			var attendances = new Array();
			if (err || !courses)
    		return res.send(attendances);
    	
			var now = Moment();
    	for (var i = 0; i < courses.length; i++) {
    		for (var j = 0; j < courses[i].posts.length; j++) {
    			var createdAt = Moment(courses[i].posts[j].createdAt);
    			var diff = now.diff(createdAt);
    			if (diff < 65 * 1000 && courses[i].posts[j].type == 'attendance')
    				attendances.push(courses[i].posts[j].attendance);
    		}
    	}

    	Attendances
    	.find(attendances)
    	.exec(function callback(err, attendances) {
    		if (err || !attendances)
	  			return res.send(500, Error.log(req, "Find attendance checking IDs Error", "Fail to find attendances."));

	  		var autoAttds = new Array();
	  		for (var k = 0; k < attendances.length; j++)
	  			if (attendances[k].type == 'auto')
	  				autoAttds.push(attendances[k]);
	  		return res.send(Arrays.getIds(autoAttds));
    	});
		});
	},

	found_device: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var email = req.param('email');
		var username = req.param('username');
		var attendance_id = req.param('attendance_id');
		var uuid = req.param('uuid');

		Devices 
		.findOneByUuid(uuid)
		.exec(function callback(err, device) {
			if (err || !device)
  			return res.send(500, Error.log(req, "Bttendance Error", "Wrong device."));

    	Users
    	.findOneById(device.owner)
			.populate('supervising_courses')
			.populate('attending_courses')
    	.exec(function callback(err, user_uuid) {
				if (err || !user_uuid)
	  			return res.send(500, Error.log(req, "Bttendance Error", "Fail to find user."));

				Users
				.findOne({
				  or : [
				    { email: email },
				    { username: username }
				  ]
				})
				.populate('supervising_courses')
				.populate('attending_courses')
				.exec(function callback(err, user_api) {
					if (err || !user_api)
		  			return res.send(500, Error.log(req, "Bttendance Error", "Fail to find user."));

	    		if (user_uuid.id == user_api.id)
		  			return res.send(400, Error.log(req, "Bttendance Error", "User has found his own device somehow."));

		    	Attendances
		    	.findOneById(attendance_id)
		    	.populate('post')
		    	.exec(function callback(err, attendance) {
						if (err || !attendance)
			  			return res.send(500, Error.log(req, "Bttendance Error", "Attendance record doesn't exist."));

			    	// Check whether users are in same courses(post)
			    	if ((Arrays.getIds(user_api.supervising_courses).indexOf(attendance.post.course) == -1
			    		&& Arrays.getIds(user_api.attending_courses).indexOf(attendance.post.course) == -1)
			    		|| (Arrays.getIds(user_uuid.supervising_courses).indexOf(attendance.post.course) == -1
			    		&& Arrays.getIds(user_uuid.attending_courses).indexOf(attendance.post.course) == -1))
			  			return res.send(204, Error.log(req, "Bttendance Error", "User is not attending current course."));

			  		if (Arrays.getIds(user_api.supervising_courses).indexOf(attendance.post.course) == -1
			  			&& user_api.id != attendance.post.author)
			  			return res.send(204, Error.log(req, "Bttendance Error", "Manager around who is not author."));

			  		if (Arrays.getIds(user_uuid.supervising_courses).indexOf(attendance.post.course) == -1
			  			&& user_uuid.id != attendance.post.author)
			  			return res.send(204, Error.log(req, "Bttendance Error", "Manager around who is not author."));

						var userids = new Array();
						userids.push(user_api.id);
						userids.push(user_uuid.id);

						// Re Clustering - user_api : A, user_uuid : B
						//          Find Cluster Number which User A, B included (say it's a,b)
						// Case 1 : None included => Make new cluster and add
						// Case 2 : One included => Add other to the cluster
						// Case 3 : Both included Same => Do nothing
						// Case 4 : Both included Diff => Merge two cluster
						var clusters = new Array();
						{
							for (var i = 0; i < attendance.clusters.length; i++)
								clusters.push(attendance.clusters[i]);

							// Find Cluster Number a, b
							var a = -1;
							var b = -1;
							for (var i = 0; i < clusters.length; i++) {
								for (var j = 0; j < clusters[i].length; j++) {
									if (clusters[i][j] == user_api.id)
										a = i;
									if (clusters[i][j] == user_uuid.id)
										b = i;
								}
							}

							// Case 3
							if (a == b && a != -1)
				  			return res.send(202, Error.log(req, "Bttendance Error", "Users are already accepted."));

			    		// Case 1
			    		else if (a == b && a == -1)
			    			clusters.push(userids);

			    		// Case 2
			    		else if (a != -1 && b == -1)
			    			clusters[a].push(user_uuid.id);

			    		// Case 2
			    		else if (a == -1 && b != -1)
			    			clusters[b].push(user_api.id);

			    		// Case 4
			    		else {
			    			var new_cluster = new Array();
			    			for (var i = 0; i < clusters.length; i++) {
			    				if (i != a && i != b)
			    					new_cluster.push(clusters[i]);
			    			}

			    			var merged_array = clusters[a].concat(clusters[b]);
			    			new_cluster.push(merged_array);

			    			clusters = new_cluster;
			    		}
						}

						// Found if any cluster has more than 3 users
						{
							var a = -1;	// cluster which has more than 3 users
							var b = -1; // cluster which author is included
							for (var i = 0; i < clusters.length; i++)
								for (var j = 0; j < clusters[i].length; j++)
									if (clusters[i][j] == attendance.post.author)
										b = i;

							for (var i = 0; i < clusters.length; i++)
								if (i != b && clusters[i].length > 2)
									a = i;

							if (a != -1) {
			    			var new_cluster = new Array();
			    			for (var i = 0; i < clusters.length; i++) {
			    				if (i != a && i != b)
			    					new_cluster.push(clusters[i]);
			    			}

								var merged_array = clusters[a].concat(clusters[b]);
			    			new_cluster.push(merged_array);

			    			clusters = new_cluster;
							}
						}

						// Send Notification
						{
							var checks = new Array();
							for (var i = 0; i < attendance.checked_students.length; i++)
								checks.push(attendance.checked_students[i]);

							for (var i = 0; i < clusters.length; i++) {

								var has_prof = false;
								for (var j = 0; j < clusters[i].length; j++) {
									if (clusters[i][j] == attendance.post.author) {
										has_prof = true;
										break;
									}
								}

								if (has_prof) {
									var notiable = new Array();
									for (var j = 0; j < clusters[i].length; j++)
										notiable.push(clusters[i][j]);

									for (var j = 0; j < notiable.length; j++) {

										var noti = true;
										for (var k = 0; k < checks.length; k++)
											if (notiable[j] == checks[k])
												noti = false;

										if (noti) {
											Courses
											.findOneById(attendance.post.course)
											.populate('managers')
											.exec(function callback(err, course) {
												if (!err && course && Arrays.getIds(course.managers).indexOf(notiable[j]) == -1) {
													Users
													.findOneById(notiable[j])
													.populate('device')
													.populate('setting')
													.exec(function callback(err, user) {
														if (user && user.setting.attendance) {
															Courses
															.findOneById(attendance.post.course)
															.exec(function callback(err, course) {
																Noti.send(user, course.name, "Attendance has been checked", "attendance_checked");
															});
														}
													});	
												}
											});
										}
									}
									break;
								}
							}
						}
						
						var updating_checkes = new Array();
						for (var i = 0; i < notiable.length; i++)
							if (attendance.post.author != notiable[i])
								updating_checkes.push(notiable[i]);

						// Update Checks & Clusters
						attendance.checked_students = updating_checkes;
						attendance.clusters = clusters;
						attendance.save(function(err) {
					  	return res.send(attendance.toWholeObject());
						});						
					});
				});
    	});
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
