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
		res.contentType('application/json');
		var username = req.param('username');
		var course_id = req.param('course_id');

		User.findOne({
			username: username
		}).done(function(err, user) {
			if (!err && user) {
				Post.create({
				  author: user.id,
				  author_name: user.full_name,
				  course: course_id,
				  type: 'attendance'
				}).done(function(err, post) {
					if (!err && post) {
						Course.findOne(course_id).done(function(err, course) {
							if(!err && course) {
								course.attdCheckedAt = JSON.parse(JSON.stringify(post)).createdAt;
								course.attd_check_count = course.attd_check_count + 1;

								course.save(function(err) {
									if (err) {
								  	console.log(err);
						    		return res.send(404, { message: "Course Save Error" });
									} else {
								  	// Send notification about post to Prof & Std
								  	var notiUsers = new Array();
								  	for (var i = 0; i < course.students.length; i++)
								  		notiUsers.push(course.students[i]);
								  	for (var i = 0; i < course.managers.length; i++)
								  		notiUsers.push(course.managers[i]);
								  	
							  		User.find({
							  			where: {
							  				or: getConditionFromIDs(notiUsers)
							  			}
							  		}).sort('id DESC').done(function(err, users) {
							  			for (var j = 0; j < users.length; j++)
							  				sendNotification(users[j], course, post, "Attendance has been started", "attendance_started");
							  		});

							  		setTimeout(function() { resendNotis(post.id); }, 40000);
							  		setTimeout(function() { resendNotis(post.id); }, 75000);
							  		setTimeout(function() { resendNotis(post.id); }, 120000);

										var courseJSON = JSON.stringify(course);
								  	return res.send(courseJSON);
									}
								});
							}
						});
					}
				});
			} else
    		return res.send(404, { message: "No User Found Error" });
		});
	},

	attendance_found_device: function(req, res) {
		res.contentType('application/json');
		var username = req.param('username');
		var post_id = req.param('post_id');
		var uuid = req.param('uuid');

		User.findOne({
			device_uuid: uuid
		}).done(function(err, user_uuid) {
			if (err || !user_uuid)
    		return res.send(202, { message: "Found wrong device" });

			User.findOne({
				username: username
			}).done(function(err, user_api) {
				if (err || !user_api)
    			return res.send(404, { message: "No User Found Error" });

    		if (user_uuid.id == user_api.id)
    			return res.send(400, { message: "User has found his own device somehow" });

				Post.findOne(post_id).done(function(err, post) {
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
										User.findOne(notiable[j]).done(function(err, user) {
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
						var postJSON = JSON.stringify(post);
				  	return res.send(postJSON);
					});
				});
			})
		});

	},

	attendance_check_manually: function(req, res) {
		res.contentType('application/json');
		var user_id = req.param('user_id');
		var post_id = req.param('post_id');

		User.findOne(user_id).done(function(err, user) {
			if (err || !user)
  			return res.send(404, { message: "No User Found Error" });

  		Post.findOne(post_id).done(function(err, post) {
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
						var postJSON = JSON.stringify(post);
				  	return res.send(postJSON);
					});
				} else {
					var postJSON = JSON.stringify(post);
			  	return res.send(postJSON);
				}

  		})
		})
	},

	create_notice: function(req, res) {
		res.contentType('application/json');
		var username = req.param('username');
		var course_id = req.param('course_id');
		var message = req.param('message');

		User.findOne({
			username: username
		}).done(function(err, user) {
			if (err || !user)
    		return res.send(404, { message: "No User Found Error" });

			Course.findOne(course_id).done(function(err, course) {
				if(err || !course)
	    		return res.send(404, { message: "No Course Found Error" });

				Post.create({
				  author: user.id,
				  author_name: user.full_name,
				  course: course_id,
				  title: course.name + ' Notice',
				  message: message,
				  type: 'notice'
				}).done(function(err, post) {
					if (err || !post)
	    			return res.send(404, { message: "No Post Found Error" });

			  	// Send notification about post to Prof & Std
			  	var notiUsers = new Array();
			  	for (var i = 0; i < course.students.length; i++)
			  		notiUsers.push(course.students[i]);
			  	for (var i = 0; i < course.managers.length; i++)
			  		notiUsers.push(course.managers[i]);
			  	
		  		User.find()
		  		.where({ or: getConditionFromIDs(notiUsers) })
		  		.sort('id DESC')
		  		.done(function(err, users) {
		  			for (var j = 0; j < users.length; j++)
		  				sendNotification(users[j], course, post, message, "notification");
		  		});

					var postJSON = JSON.stringify(post);
			  	return res.send(postJSON);
	    	});
			});
		});
	},

	remove: function(req, res) {
		res.contentType('application/json');
		var post_id = req.param('post_id');

		Post.findOne(post_id).done(function(err, post) {
			if (err || !post)
    		return res.send(404, { message: "No Post Found Error" });

    	Course.findOne(post.course).done(function(err, course) {
				if (err || !course)
	    		return res.send(404, { message: "No Course Found Error" });

	    	if (course.posts.indexOf(Number(post.id)) != -1) {
        	course.posts.splice(course.posts.indexOf(Number(post.id)), 1);
        	course.save(function(err) {
						var courseJSON = JSON.stringify(course);
				  	return res.send(courseJSON);
        	});
	    	}
    	});
		});
	}
};

var resendNotis = function(post_id) {
	console.log("resendNotis");
	Post.findOne(post_id).done(function(err, post) {
		if (err || !post)
			return;

		Course.findOne(post.course).done(function(err, course) {
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
								  	
  		User.find({
  			where: {
  				or: getConditionFromIDs(unchecked)
  			}
  		}).sort('id DESC').done(function(err, users) {
  			if (err || !users)
  				return;
  			
  			for (var j = 0; j < users.length; j++)
  				sendNotification(users[j], course, post, "Attendance has been started", "attendance_started");
  		});
		});
	});
}

// Function to get id list
var sendNotification = function(user, course, post, message, type) {
	if (!user.notification_key)
		return;

	if (user.device_type == 'android') {

		var message = new gcm.Message({
		    collapseKey: 'bttendance',
		    delayWhileIdle: false,
		    timeToLive: 4,
		    data: {
		    	title: post.course_name,
		      message: message,
		      type: type,
		      post: JSON.stringify(post),
		      course: JSON.stringify(course)
		    }
		});

		var registrationIds = [];
		registrationIds.push(user.notification_key);

		var sender = new gcm.Sender('AIzaSyByrjmrKWgg1IvZhFZspzYVMykKHaGzK0o');
		sender.send(message, registrationIds, 4, function (err, result) {
			if (err)
				console.log(err);
			else
    		console.log(result);
		});

	} else if (user.device_type == 'iphone') {

		var apns = require('apn');
		var options;

		if (process.env.NODE_ENV == 'development') {
			options = { cert: "./Certification/cert_development.pem",
									certData: null,
									key: "./Certification/key_development.pem",
									keyData: null,
									passphrase: "bttendance",
									ca: null,
									gateway: "gateway.sandbox.push.apple.com",
									port: 2195,
									enhanced: true,
									errorCallback: undefined,
									cacheLength: 100 };
		} else { //production
			options = { cert: "./Certification/cert_production.pem",
									certData: null,
									key: "./Certification/key_production.pem",
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
		var myDevice = new apns.Device(user.notification_key); //for token
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

// Function to get id list
var getConditionFromIDs = function(array) {
	var returnArray = new Array();
	for (var index in array) {
		var idObject = [];
		idObject["id"] = array[index];
		returnArray.push(idObject);
	}
	return returnArray;
}

// Function to get id list
var getConditionFromUUIDs = function(array) {
	var returnArray = new Array();
	for (var index in array) {
		var idObject = [];
		idObject["device_uuid"] = array[index];
		returnArray.push(idObject);
	}
	return returnArray;
}

var isClose = function(location_a, location_b) {
	var lat_a = parseFloat(location_a[0]);
	var lgn_a = parseFloat(location_a[1]);
	var lat_b = parseFloat(location_b[0]);
	var lgn_b = parseFloat(location_b[1]);

	if (isNaN(lat_a) || isNaN(lgn_a) || isNaN(lat_b) || isNaN(lgn_b)
		|| lat_a == 0 || lgn_a == 0 || lat_b == 0 || lgn_b == 0)
		return false;

	if (((lat_a - lat_b) * (lat_a - lat_b) + (lgn_a - lgn_b) * (lgn_a - lgn_b)) > 0.01)
		return false;

	return true;
}

// Function to get median location of a cluster
var getMedianLocation = function(cluster, locations) {
	var medianLocation = new Array();
	var latitudeArray = new Array();
	var longitudeArray = new Array();
	for (var i in cluster) {
		for (var j in locations)
			if (locations[j][0] == cluster[i]) {
				latitudeArray.push(locations[j][1]);
				longitudeArray.push(locations[j][2]);
			}
	}

	medianLocation.push(getMedian(latitudeArray));
	medianLocation.push(getMedian(longitudeArray));

	return medianLocation;
}

// Get Median of an array
var getMedian = function(array) {
	if (array.length < 3)
		return 0;

	for (var i = 0; i < array.length; i++) {
		for (var j = i; j < array.length; j++) {
			if (array[i] > array[j]) {
				var k = array[i];
				array[i] = array[j];
				array[j] = k;
			}
		}
	}
	return array[Math.floor(array.length/2)];
}
