/**
 * PostController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

var gcm = require('node-gcm');
var apn = require('apn');
var moment = require('moment');

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
								course.attdCheckedAt = moment().utc().format('YYYY-MM-DD[T]HH:mm:ss[.000Z]');
								course.save(function(err) {
									if (err) {
								  	console.log(err);
						    		return res.send(404, { message: "Course Save Error" });
									} else {
								  	// Send notification about post to Prof & Std
								  	var notiUsers = new Array();
								  	for (var i = 0; i < course.students.length; i++)
								  		notiUsers.push(course.students[i]);
								  	notiUsers.push(course.professor);
								  	
							  		User.find({
							  			where: {
							  				or: getConditionFromIDs(notiUsers)
							  			}
							  		}).sort('id DESC').done(function(err, users) {
							  			for (var j = 0; j < users.length; j++)
							  				sendNotification(users[j], course.name, "Attendance has been started", "attendance", post.id);
							  		});

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
									for (var i = 0; i < post.clusters.length; i++)
										clusters.push(post.clusters[i]);
									var cluster_flag = new Array();

									for (var i = 0; i < clusters.length; i++) {

										var has_id = false;
										for (var j = 0; j < clusters[i].length; j++) {
											for (var k = 0; k < userids.length; k++) {
												if (clusters[i][j] == userids[k]) {
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

									for (var i = 0; i < cluster_flag.length; i++) {
										if (cluster_flag[i]) {
											for (var j = 0; j < clusters[i].length; j++) {
												if (userids.indexOf(clusters[i][j]) == -1)
													userids.push(clusters[i][j]);
											}
											clusters.pop(clusters[i]);
										}
									}
									clusters.push(userids);
								}

								// GPS

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
														sendNotification(user, post.course_name, "Attendance has been checked", "attendance", post.id);
													});
												}
											}

											break;
										}
									}
								}

								checks = notiable;
								
								// Update Post
								post.checks = checks;
								post.clusters = clusters;
								post.save(function(err) {
									var postJSON = JSON.stringify(post);
							  	return res.send(postJSON);
								});

							} else
				    		return res.send(404, { message: "No Post Found Error" });
						});
					} else
    				return res.send(404, { message: "No User Found Error" });
				})
			} else
    		return res.send(404, { message: "No User Found Error" });
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
var sendNotification = function(user, title, message, type, post_id) {
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
		      message: message,
		      type: type,
		      post_id: post_id
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
