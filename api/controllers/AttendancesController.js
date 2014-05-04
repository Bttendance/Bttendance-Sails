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
		.populate('posts')
		.exec(function callback(err, courses) {
			var attendances = new Array();
			if (err || !courses)
    		return res.send(attendances);
    	
			var now = Moment();
    	for (var i = 0; i < courses.length; i++) {
    		for (var j = 0; j < courses[i].posts.length; j++) {
    			var createdAt = Moment(courses[i].posts[j].createdAt);
    			var diff = now.diff(createdAt);
    			if (diff < 3 * 60 * 1000 && courses[i].posts[j].type == 'attendance')
    				attendances.push(courses[i].posts[j].attendance);
    		}
    	}
  		return res.send(attendances);
		});
	},

	found_device: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var username = req.param('username');
		var post_id = req.param('post_id');
		var uuid = req.param('uuid');

		Devices
		.findOneByUuid(uuid)
		.exec(function callback(err, device) {
			if (err || !device)
    		return res.send(202, { message: "Found wrong device" });

    	Users
    	.findOneById(device.owner)
			.populate('supervising_courses')
			.populate('attending_courses')
    	.exec(function callback(err, user_uuid) {
				if (err || !user_uuid)
    			return res.send(404, { message: "User Found Error" });

				Users
				.findOneByUsername(username)
				.populate('supervising_courses')
				.populate('attending_courses')
				.exec(function callback(err, user_api) {
					if (err || !user_api)
	    			return res.send(404, { message: "User Found Error" });

	    		if (user_uuid.id == user_api.id)
	    			return res.send(400, { message: "User has found his own device somehow" });

					Posts
					.findOneById(post_id)
		  		.populate('author')
		  		.populate('course')
		  		.populate('attendance')
					.exec(function callback(err, post) {
						if (err || !post)
			    		return res.send(404, { message: "Post Found Error" });

			    	// Check whether users are in same courses(post)
			    	if ((getIds(user_api.supervising_courses).indexOf(post.course.id) == -1
			    		&& getIds(user_api.attending_courses).indexOf(post.course.id) == -1)
			    		|| (getIds(user_uuid.supervising_courses).indexOf(post.course.id) == -1
			    		&& getIds(user_uuid.attending_courses).indexOf(post.course.id) == -1))
			    		return res.send(204, { message: "User is not attending current course" });

			    	if (post.type != 'attendance')
			    		return res.send(204, { message: "Current Post is not for Attendance" });

			    	Attendances
			    	.findOneById(post.attendance.id)
			    	.exec(function callback(err, attendance) {
							if (err || !post)
				    		return res.send(404, { message: "Attendance Found Error" });

							var userids = new Array();
							userids.push(user_api.id);
							userids.push(user_uuid.id);

							// Re Clustering - user_api : A, user_uuid : B
							//          Find Cluster Number which User A, B included (say it's a,b)
							// Case 1 : None included => Make new cluster and add
							// Case 2 : One included => Add other to the cluster
							// Case 3 : Both included Same => Do nothing
							// Case 4 : Both included Diff => Merge two cluster
							{
								var clusters = new Array();
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
				    			return res.send(202, { message: "Users are already accepted" });

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

							// Found if any cluster has more than 4 users
							{
								var a = -1;	// cluster which has more than 4 users
								var b = -1; // cluster which prof is included
								for (var i = 0; i < clusters.length; i++)
									for (var j = 0; j < clusters[i].length; j++)
										if (clusters[i][j] == post.author.id)
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
										if (clusters[i][j] == post.author.id) {
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
												Users
												.findOneById(notiable[j])
												.populate('device')
												.exec(function callback(err, user) {
													if (user)
														Noti.send(user, post.course.name, "Attendance has been checked", "attendance_checked");
												});
											}
										}
										break;
									}
								}
							}
							checks = notiable;
							
							// Update Checks & Clusters
							attendance.checked_students = checks;
							attendance.clusters = clusters;
							attendance.save(function(err) {
								post.attendance = attendance;
						  	return res.send(post.toOldObject());
							});						
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
		.populate('device')
		.populate('supervising_courses')
		.exec(function callback(err, user) {
			if (err || !user)
  			return res.send(404, Error.alert("Manual Check Error", "Student doesn't exist."));

  		Attendances
  		.findOneById(attendance_id)
  		.populate('post')
  		.exec(function callback(err, attendance) {
				if (err || !attendance)
	  			return res.send(404, Error.alert("Manual Check Error", "Attendance record doesn't exist."));

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
			  			return res.send(404, Error.alert("Manual Check Error", "Updating attendance record has been failed."));

						Posts
						.findOneById(attendance.post.id)
						.populate('course')
						.exec(function callback(err, post) {
							if (err || !post)
				  			return res.send(404, Error.alert("Manual Check Error", "Manual attendance check failed. Please try again."));

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
