/**
 * PostController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

var Noti = require('../utils/notifications');
var gcm = require('node-gcm');
var apn = require('apn');

module.exports = {

	attendance_start: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var username = req.param('username');
		var course_id = req.param('course_id');

		Users
		.findOneByUsername(username)
		.exec(function callback(err, user) {
			if(err || !user)
    		return res.send(404, { message: "User Found Error" });

			Posts
			.create({
			  author: user.id,
			  course: course_id,
			  type: 'attendance'
			}).exec(function callback(err, post) {
				if (err || !post)
	    		return res.send(500, { message: "Post Create Error" });

	    	Posts
	    	.findOneById(post.id)
	  		.populate('author')
	  		.populate('course')
	  		.populate('attendance')
	  		.exec(function callback(err, post) {
	  			if (err || !post)
	  				return res.send(500, {message: "Post Find Error"});

		    	Courses
		    	.update({id: post.course.id}, {attdCheckedAt: JSON.parse(JSON.stringify(post.toWholeObject())).createdAt})
		    	.exec(function callback(err, courses) {
		    		if (err || !courses)
			    		return res.send(404, { message: "Course Update Error" });

			    	Courses
			    	.findOneById(courses[0].id)
						.populate('posts')
				  	.populate('managers')
				  	.populate('students')
				  	.populate('school')
				  	.exec(function callback(err, course) {
			    		if (err || !course)
				    		return res.send(404, { message: "Course Update Error" });

					  	// Send notification about post to Prof & Std
					  	var notiUsers = new Array();
					  	for (var i = 0; i < course.students.length; i++)
					  		notiUsers.push(course.students[i].id);
					  	for (var i = 0; i < course.managers.length; i++)
					  		notiUsers.push(course.managers[i].id);
					  	
				  		Users
				  		.findById(notiUsers)
							.populate('device')
				  		.sort('id DESC')
				  		.exec(function callback(err, users) {
				  			for (var j = 0; j < users.length; j++)
				  				Noti.send(users[j], post.name, "Attendance check has been started", "attendance_started");
				  		});

				  		setTimeout(function() { Noti.resendAttedance(post.attendance.id); }, 40000);
				  		setTimeout(function() { Noti.resendAttedance(post.attendance.id); }, 75000);
				  		setTimeout(function() { Noti.resendAttedance(post.attendance.id); }, 120000);

					  	return res.send(course.toOldObject());
				  	});
		    	});
				});
			});
		});
	},

	attendance_found_device: function(req, res) {
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

	attendance_check_manually: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var user_id = req.param('user_id');
		var post_id = req.param('post_id');

		Users
		.findOneById(user_id)
		.populate('device')
		.exec(function callback(err, user) {
			if (err || !user)
  			return res.send(404, { message: "User Found Error" });

  		Posts
  		.findOneById(post_id)
  		.populate('author')
  		.populate('course')
  		.populate('attendance')
  		.exec(function callback(err, post) {
				if (err || !post)
	  			return res.send(404, { message: "Post Found Error" });

				var checked_students = new Array();
				var has_user = false;
				for (var i = 0; i < post.attendance.checked_students.length; i++) {
					var id = post.attendance.checked_students[i];
					checked_students.push(id);
					if (id == user.id)
						has_user = true;
				}

				if (!has_user) {
					checked_students.push(user.id);

					Attendances
					.update({id: post.attendance.id}, {checked_students: checked_students})
					.exec(function callback(err, attendance) {
						if (err || !attendance)
							return res.send(404, {message: "Attendance update failed"});

						post.attendance = attendance[0];
						Noti.send(user, post.course.name, "Attendance has been checked", "attendance_checked");
				  	return res.send(post.toOldObject());
					});
				} else {
			  	return res.send(post.toOldObject());
				}

  		})
		})
	},

	create_notice: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var username = req.param('username');
		var course_id = req.param('course_id');
		var message = req.param('message');

		Users
		.findOneByUsername(username)
		.exec(function callback(err, user) {
			if (err || !user)
    		return res.send(404, { message: "User Found Error" });

			Courses
			.findOneById(course_id)
			.populate('posts')
	  	.populate('managers')
	  	.populate('students')
	  	.populate('school')
			.exec(function callback(err, course) {
				if(err || !course)
	    		return res.send(404, { message: "Course Found Error" });

				Posts.create({
				  author: user.id,
				  course: course_id,
				  message: message,
				  type: 'notice'
				}).exec(function callback(err, post) {
					if (err || !post)
	    			return res.send(404, { message: "Post Found Error" });

	    		Posts
	    		.findOneById(post.id)
		  		.populate('author')
		  		.populate('course')
		  		.populate('attendance')
		  		.exec(function callback(err, post) {
		  			if (err || !post)
		  				return res.send(404, {message: "Post Found Error"});

			    	course.notice_usage = courses.notice_usage + 1;
			    	course.save();

				  	// Send notification about post to Prof & Std
				  	var notiUsers = new Array();
				  	for (var i = 0; i < course.students.length; i++)
				  		notiUsers.push(course.students[i].id);
				  	for (var i = 0; i < course.managers.length; i++)
				  		notiUsers.push(course.managers[i].id);
				  	
			  		Users
			  		.findById(notiUsers)
			  		.populate('device')
			  		.sort('id DESC')
			  		.exec(function callback(err, users) {
			  			for (var j = 0; j < users.length; j++)
			  				Noti.send(users[j], post.course.name, message, "notice");
			  		});

				  	return res.send(post.toOldObject());
		    	});
		  	});
			});
		});
	},

	find_post: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var post_id = req.param('post_id');

		Posts
		.findOneById(post_id)
		.populate('author')
		.populate('course')
		.populate('attendance')
		.exec(function callback(err, post) {
			if (err || !post)
  			return res.send(404, { message: "Post Found Error" });

	  	return res.send(post.toOldObject());
		});
	},

	remove: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var post_id = req.param('post_id');

		Posts
		.findOne(post_id)
		.exec(function callback(err, post) {
			if (err || !post)
    		return res.send(404, { message: "No Post Found Error" });

    	Courses
    	.findOne(post.course)
    	.exec(function callback(err, course) {
				if (err || !course)
	    		return res.send(404, { message: "No Course Found Error" });

	    	if (course.posts.indexOf(Number(post.id)) != -1) {
        	course.posts.splice(course.posts.indexOf(Number(post.id)), 1);
        	if (post.type == "attendance")
        		course.attd_check_count = course.attd_check_count - 1;
        	course.save(function(err) {
        		post.destroy(function(err) {});
						var courseJSON = JSON.stringify(course);
				  	return res.send(courseJSON);
        	});
	    	}
    	});
		});
	}
};

var getIds = function(jsonArray) {
	if (!jsonArray)
		return new Array();

  var ids = new Array();
  for (var i = 0; i < jsonArray.length; i++)
  	ids.push(jsonArray[i].id);
	return ids;
}

