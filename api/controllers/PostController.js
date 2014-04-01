/**
 * PostController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

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

			Posts.create({
			  author: user.id,
			  course: course_id,
			  type: 'attendance'
			}).exec(function callback(err, post) {
				if (err || !post)
	    		return res.send(500, { message: "Post Create Error" });

	    	Posts
	    	.findById(post.id)
	  		.populate('author')
	  		.populate('course')
	  		.populate('attendance')
	  		.exec(function callback(err, post) {
	  			if (err || !post)
	  				return res.send(500, {message: "Post Find Error"});

		    	Courses
		    	.update({id: post.course}, {attdCheckedAt: post.createdAt})
					.populate('posts')
			  	.populate('managers')
			  	.populate('students')
			  	.populate('school')
		    	.exec(function callback(err, course) {
		    		if (err || !course)
			    		return res.send(404, { message: "Course UpdateError" });

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
			  				sendNotification(users[j], course, post, "Attendance has been started", "attendance_started");
			  		});

			  		setTimeout(function() { resendNotis(post.id); }, 40000);
			  		setTimeout(function() { resendNotis(post.id); }, 75000);
			  		setTimeout(function() { resendNotis(post.id); }, 120000);

				  	return res.send(course.toOldObject());
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

		Users.findOne({
			device_uuid: uuid
		}).done(function(err, user_uuid) {
			if (err || !user_uuid)
    		return res.send(202, { message: "Found wrong device" });

			Users
			.findOneByUsername(username)
			.exec(function callback(err, user_api) {
				if (err || !user_api)
    			return res.send(404, { message: "No User Found Error" });

    		if (user_uuid.id == user_api.id)
    			return res.send(400, { message: "User has found his own device somehow" });

				Posts
				.findOneById(post_id)
	  		.populate('author')
	  		.populate('course')
	  		.populate('attendance')
				.exec(function callback(err, post) {
					if (err || !post)
		    		return res.send(404, { message: "No Post Found Error" });

		    	// Check whether users are in same courses(post)
		    	if ((user_api.supervising_courses.indexOf(post.course) == -1
		    		&& user_api.attending_courses.indexOf(post.course) == -1)
		    		|| (user_uuid.supervising_courses.indexOf(post.course) == -1
		    		&& user_uuid.attending_courses.indexOf(post.course) == -1))
		    		return res.send(204, { message: "User is not attending current course" });

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
						for (var i = 0; i < post.clusters.length; i++)
							clusters.push(post.clusters[i]);

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
								if (clusters[i][j] == post.author)
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
						for (var i = 0; i < post.checks.length; i++)
							checks.push(post.checks[i]);

						for (var i = 0; i < clusters.length; i++) {

							var has_prof = false;
							for (var j = 0; j < clusters[i].length; j++) {
								if (clusters[i][j] == post.author) {
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
												sendNotification(user, null, post, "Attendance has been checked", "attendance_checked");
										});
									}
								}
								break;
							}
						}
					}
					checks = notiable;
					
					// Update Checks & Clusters
					post.checks = checks;
					post.clusters = clusters;
					post.save(function(err) {
				  	return res.send(post.toOldObject());
					});
				});
			})
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
  			return res.send(404, { message: "No User Found Error" });

  		Posts
  		.findOneById(post_id)
  		.populate('author')
  		.populate('course')
  		.populate('attendance')
  		.exec(function callback(err, post) {
				if (err || !post)
	  			return res.send(404, { message: "No Post Found Error" });

				var checks = new Array();
				var has_user = false;
				for (var i = 0; i < post.checks.length; i++) {
					var id = post.checks[i];
					checks.push(id);
					if (id == user.id)
						has_user = true;
				}

				if (!has_user) {
					sendNotification(user, null, post, "Attendance has been checked manually", "attendance_checked");
					checks.push(user.id);
					post.checks = checks;
					post.save(function(err) {
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
				  author_name: user.full_name,
				  course: course_id,
				  title: course.name + ' Notice',
				  message: message,
				  type: 'notice'
				}).exec(function callback(err, post) {
					if (err || !post)
	    			return res.send(404, { message: "No Post Found Error" });

	    		Posts
	    		.findById(post.id)
		  		.populate('author')
		  		.populate('course')
		  		.populate('attendance')
		  		.exec(function callback(err, post) {
		  			if (err || !post)
		  				return res.send(404, {message: "No Post Found Error"});

				  	// Send notification about post to Prof & Std
				  	var notiUsers = new Array();
				  	for (var i = 0; i < course.students.length; i++)
				  		notiUsers.push(course.students[i]);
				  	for (var i = 0; i < course.managers.length; i++)
				  		notiUsers.push(course.managers[i]);
				  	
			  		Users
			  		.findById(notiUsers)
			  		.populate('device')
			  		.sort('id DESC')
			  		.exec(function callback(err, users) {
			  			for (var j = 0; j < users.length; j++)
			  				sendNotification(users[j], course, post, message, "notification");
			  		});

				  	return res.send(post.toOldObject());
		    	});
		  	});
			});
		});
	},

	// remove: function(req, res) {
	// 	res.contentType('application/json; charset=utf-8');
	// 	var post_id = req.param('post_id');

	// 	Post.findOne(post_id).done(function(err, post) {
	// 		if (err || !post)
 //    		return res.send(404, { message: "No Post Found Error" });

 //    	Course.findOne(post.course).done(function(err, course) {
	// 			if (err || !course)
	//     		return res.send(404, { message: "No Course Found Error" });

	//     	if (course.posts.indexOf(Number(post.id)) != -1) {
 //        	course.posts.splice(course.posts.indexOf(Number(post.id)), 1);
 //        	if (post.type == "attendance")
 //        		course.attd_check_count = course.attd_check_count - 1;
 //        	course.save(function(err) {
 //        		post.destroy(function(err) {});
	// 					var courseJSON = JSON.stringify(course);
	// 			  	return res.send(courseJSON);
 //        	});
	//     	}
 //    	});
	// 	});
	// }
};

var resendNotis = function(post_id) {

	Posts
	.findOneById(post_id)
	.populate('author')
	.populate('course')
	.populate('attendance')
	.exec(function callback(err, post) {
		if (err || !post)
			return;

		Courses
		.findOneById(post.course)
		.populate('posts')
  	.populate('managers')
  	.populate('students')
  	.populate('school')
		.exec(function callback(err, course) {
			if (err || !course)
				return;

			var unchecked = new Array();
			for (var i = 0; i < course.students.length; i++)
				unchecked.push(course.students[i]);

			for (var i = 0; i < post.checks.length; i++) {
				var index = unchecked.indexOf(post.checks[i]);
				if (index > -1)
					unchecked.splice(index, 1);
			}
								  	
  		Users
  		.findById(unchecked)
  		.populate('device')
  		.sort('id DESC').exec(function(err, users) {
  			if (err || !users)
  				return;
  			
  			for (var j = 0; j < users.length; j++)
  				sendNotification(users[j], course, post, "Attendance has been started", "attendance_started");
  		});
		});
	});
}

// Function to get id list
// user.populate('device')
// post.populate(all)
// course.populate(all)
var sendNotification = function(user, course, post, message, type) {
	if (!user.device.notification_key)
		return;

	if (user.device.type == 'android') {

		var message = new gcm.Message({
		    collapseKey: 'bttendance',
		    delayWhileIdle: false,
		    timeToLive: 4,
		    data: {
		    	title: post.course_name,
		      message: message,
		      type: type,
		      post: JSON.stringify(post.toOldObject()),
		      course: JSON.stringify(course.toOldObject())
		    }
		});

		var registrationIds = [];
		registrationIds.push(user.device.notification_key);

		var sender = new gcm.Sender('AIzaSyByrjmrKWgg1IvZhFZspzYVMykKHaGzK0o');
		sender.send(message, registrationIds, 4, function (err, result) {
			if (err)
				console.log(err);
			else
    		console.log(result);
		});

	} else if (user.device.type == 'iphone') {

		var apns = require('apn');
		var options;

		if (process.env.NODE_ENV == 'development') {
			options = { cert: "./certification/cert_development.pem",
									certData: null,
									key: "./certification/key_development.pem",
									keyData: null,
									passphrase: "bttendance",
									ca: null,
									gateway: "gateway.sandbox.push.apple.com",
									port: 2195,
									enhanced: true,
									errorCallback: undefined,
									cacheLength: 100 };
		} else { //production
			options = { cert: "./certification/cert_production.pem",
									certData: null,
									key: "./certification/key_production.pem",
									keyData: null,
									passphrase: "bttendance",
									ca: null,
									gateway: "gateway.sandbox.push.apple.com",
									port: 2195,
									enhanced: true,
									errorCallback: undefined,
									cacheLength: 100 };
		}

    var apnConnection = new apns.Connection(options);
		var myDevice = new apns.Device(user.device.notification_key); //for token
		var note = new apns.Notification();

		var alert = "Notification from Bttendance";
		if (type == "attendance_started") {
			alert = post.course_name + " attendance has been started.";
		} else if (type == "attendance_checked") {
			alert = post.course_name + " attendance has been chekced.";
		} else if (type == "notification") {
			alert = post.course_name + " : " + message;
		}

		note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
		note.badge = 1;
		note.sound = "ping.aiff";
		note.alert = alert;
		note.payload = {
			'title' 	: post.course_name,
			'message' : message,
			'type' 		: type 
		};
		note.device = myDevice;

		// apnConnection.pushNotification(note, myDevice);
		apnConnection.sendNotification(note);
	}
}

// var isClose = function(location_a, location_b) {
// 	var lat_a = parseFloat(location_a[0]);
// 	var lgn_a = parseFloat(location_a[1]);
// 	var lat_b = parseFloat(location_b[0]);
// 	var lgn_b = parseFloat(location_b[1]);

// 	if (isNaN(lat_a) || isNaN(lgn_a) || isNaN(lat_b) || isNaN(lgn_b)
// 		|| lat_a == 0 || lgn_a == 0 || lat_b == 0 || lgn_b == 0)
// 		return false;

// 	if (((lat_a - lat_b) * (lat_a - lat_b) + (lgn_a - lgn_b) * (lgn_a - lgn_b)) > 0.01)
// 		return false;

// 	return true;
// }

// // Function to get median location of a cluster
// var getMedianLocation = function(cluster, locations) {
// 	var medianLocation = new Array();
// 	var latitudeArray = new Array();
// 	var longitudeArray = new Array();
// 	for (var i in cluster) {
// 		for (var j in locations)
// 			if (locations[j][0] == cluster[i]) {
// 				latitudeArray.push(locations[j][1]);
// 				longitudeArray.push(locations[j][2]);
// 			}
// 	}

// 	medianLocation.push(getMedian(latitudeArray));
// 	medianLocation.push(getMedian(longitudeArray));

// 	return medianLocation;
// }

// // Get Median of an array
// var getMedian = function(array) {
// 	if (array.length < 3)
// 		return 0;

// 	for (var i = 0; i < array.length; i++) {
// 		for (var j = i; j < array.length; j++) {
// 			if (array[i] > array[j]) {
// 				var k = array[i];
// 				array[i] = array[j];
// 				array[j] = k;
// 			}
// 		}
// 	}
// 	return array[Math.floor(array.length/2)];
// }
