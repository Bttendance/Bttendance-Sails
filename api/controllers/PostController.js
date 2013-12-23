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
				  // Error handling
				  if (err) {
				  	console.log(err);
		    		return res.send(404, { message: "Post Create Error" });
				  // The User was created successfully!
				  } else {
						var postJSON = JSON.stringify(post);
				  	return res.send(postJSON);
				  }
				});
			} else
    		return res.send(404, { message: "No User Found Error" });
		});

	},

	attendance_check: function(req, res) {
		res.contentType('application/json');
		var username = req.param('username');
		var post_id = req.param('post_id');
		var longitude = req.param('longitude');
		var latitude = req.param('latitude');
		var uuid = req.param('uuid');

		User.findOne({
			device_uuid: uuid
		}).done(function(err, user_uuid) {
			if (!err && user_uuid) {
				User.findOne({
					username: username
				}).done(function(err, user_api) {
					if (!err && user_uuid) {

						var userids = new Array();
						userids.push(user_api.id);
						userids.push(user_uuid.id);

						Post.findOne(post_id).done(function(err, post) {
							if (!err && post) {

								// Re Clustering
								{
									var clusters = new Array();
									for (var array in post.clusters)
										clusters.push(array);
									var cluster_flag = new Array();

									for (var array in clusters) {

										var has_id = false;
										for (var id in array) {
											for (var user_id in userids) {
												if (id == user_id) {
													has_id = true;
													break;
												}
											}
	 									}

										if (has_id)
											cluster_flag.push(true);
										else
											cluster_flag.push(false);

									}

									for (var i = 0; i < cluster_flag.length; i++ ) {
										if (cluster_flag[i]) {
											for (var id in clusters[i])
												userids.push(id);
											clusters.pop(clusters[i]);
										}
									}
									clusters.push(userids);
								}

								//GPS

								// Send Notification
								{
									var checks = new Array();
									for (var id in post.checks)
										checks.push(id);

									for (var array in clusters) {
										var has_prof = false;
										for (var id in array) {
											if (id == post.author) {
												has_prof = true;
												break;
											}
										}
										if (has_prof) {

											var notiable = new Array();
											for (var id in array)
												notiable.push(id);

											for (var id_n in notiable) {

												var noti = true;
												for (var id_c in checks) {
													if (id_n == id_c)
														noti = false;
												}

												if (noti) {
													User.findOne(id_n).done(function(err, user) {
														sendNotification(user, "Hello", "Noti");
													})
												}
											}

											break;
										}
									}
								}

								// Update Post
								post.checks = checks;
								post.clusters = clusters;
								Post.save(function(err) {});

							} else
				    		return res.send(404, { message: "No Post Found Error" });
						});
					} else
    				return res.send(404, { message: "No User Found Error" });
				})
			} else
    		return res.send(404, { message: "No UUID User Found Error" });
		});

	},

	student_list: function(req, res) {
		res.contentType('application/json');
		var post_id = req.param('post_id');

		Post.findOne(Number(post_id)).done(function(err, post) {
			if (!err && post) {
				Course.findOne(post.course).done(function(err, course) {
					if (!err && course) {
				  	var studentsObject = new Array();
			  		User.find({
			  			where: {
			  				or: getConditionFromIDs(course.students)
			  			}
			  		}).sort('id DESC').done(function(err, students) {
			  			if (!err && students) {
			  				for (var index in students) {
			  					var student = students[index];
			  					if (post.checks.indexOf(student.id) == -1)
			  						student["check"] = false;
			  					else
			  						student["check"] = true;
			  					studentsObject.push(students[index]);
			  				}
								var studentsJSON = JSON.stringify(studentsObject);
						  	return res.send(studentsJSON);
			  			} else
				    		return res.send(404, { message: "No Studnet Found Error" });
			  		});
					} else
						return res.send(404, { message: "No Course Found Error" });
				});
			} else 
				return res.send(404, { message: "No Post Found Error" });
		});

	}
};

// Function to get id list
var sendNotification = function(user, title, message) {
	if (!user.notification_key)
		return;

	if (user.device_type == 'android') {
		// or with object values
		var message = new gcm.Message({
		    collapseKey: 'bttendance',
		    delayWhileIdle: true,
		    timeToLive: 3,
		    data: {
		    	title: title,
		      message: message
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
		var options = { "gateway": "gateway.sandbox.push.apple.com" };
    var apnConnection = new apn.Connection(options);
		var myDevice = new apn.Device(token);
		var note = new apn.Notification();

		note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
		note.badge = 1;
		note.sound = "ping.aiff";
		note.alert = "\uD83D\uDCE7 \u2709 You have a new message";
		note.payload = {'messageFrom': 'Caroline'};

		apnConnection.pushNotification(note, myDevice);
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
