/**
 * UserController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var passwordHash = require('password-hash');
var gcm = require('node-gcm');
var apn = require('apn');

module.exports = {

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to UserController)
   */
  _config: {},

	signin: function(req, res) {
		res.contentType('application/json');
		var username = req.param('username');
		var password = req.param('password');
		var uuid = req.param('device_uuid');

		if (!username) {
			console.log("UserController : signin : Username or Email is required");
			return res.send(400, { message: "Username or Email is required"});
		}

		if (!password) {
			console.log("UserController : signin : Password is required");
			return res.send(400, { message: "Password is required"});
		}

		if (!uuid) {
			console.log("UserController : signin : UUID is required");
			return res.send(400, { message: "UUID is required"});
		}

		User.findOne({
  		username: username
		}).done(function(err, user) {
			if (user)
				return checkPass(res, err, user, password, uuid);
			else {
				User.findOne({
		  		email: username
				}).done(function(err, user) {
					return checkPass(res, err, user, password, uuid);
				});
			}
		});
	},

	update_notification_key: function(req, res) {
		res.contentType('application/json');
		var username = req.param('username');
		var notification_key = req.param('notification_key');

		if (!notification_key) {
			console.log("UserController : update_notification_key : Notification Key is required");
			return res.send(400, { message: "Notification Key is required"});
		}

		User.findOne({
			username: username
		}).done(function(err, user) {
			// error handling
			if (err) {
				console.log(err);
		    return res.send(500, { message: "User Find Error" });

		  // No User found
		  } else if (!user) {
		    return res.send(404, { message: "No User Found Error" });

		  // Found User!
		  } else {
			  // Update User
		  	user.notification_key = notification_key;
		  	user.save(function(err) {
					// Error handling
					if (err) {
						console.log(err);
				    return res.send(500, { message: "User Save Error" });
				  }
			  	// return UserJSON
					var userJSON = JSON.stringify(user);
			  	return res.send(userJSON);
		  	});
		  }
		});
	},

	update_profile_image: function(req, res) {
		res.contentType('application/json');
		var username = req.param('username');
		var profile_image = req.param('profile_image');

		if (!profile_image) {
			console.log("UserController : update_profile_image : Profile Image url is required");
			return res.send(400, { message: "Profile Image url is required"});
		}

		User.findOne({
			username: username
		}).done(function(err, user) {
			// error handling
			if (err) {
				console.log(err);
		    return res.send(500, { message: "User Find Error" });

		  // No User found
		  } else if (!user) {
		    return res.send(404, { message: "No User Found Error" });

		  // Found User!
		  } else {
			  // Update User
		  	user.profile_image = profile_image;
		  	user.save(function(err) {
					// Error handling
					if (err) {
						console.log(err);
				    return res.send(500, { message: "User Save Error" });
				  }
			  	// return UserJSON
					var userJSON = JSON.stringify(user);
			  	return res.send(userJSON);
		  	});
		  }
		});
	},

	update_full_name: function(req, res) {
		res.contentType('application/json');
		var username = req.param('username');
		var full_name = req.param('full_name');

		if (!full_name) {
			console.log("UserController : update_full_name : Full Name is required");
			return res.send(400, { message: "Full Name is required"});
		}

		User.findOne({
			username: username
		}).done(function(err, user) {
			// error handling
			if (err) {
				console.log(err);
		    return res.send(500, { message: "User Find Error" });

		  // No User found
		  } else if (!user) {
		    return res.send(404, { message: "No User Found Error" });

		  // Found User!
		  } else {
			  // Update User
		  	user.full_name = full_name;
		  	user.save(function(err) {
					// Error handling
					if (err) {
						console.log(err);
				    return res.send(500, { message: "User Save Error" });
				  }
			  	// return UserJSON
					var userJSON = JSON.stringify(user);
			  	return res.send(userJSON);
		  	});
		  }
		});
	},

	update_email: function(req, res) {
		res.contentType('application/json');
		var username = req.param('username');
		var email = req.param('email');

		if (!email) {
			console.log("UserController : update_email : Email is required");
			return res.send(400, { message: "Email is required"});
		}

		User.findOne({
			username: username
		}).done(function(err, user) {
			// error handling
			if (err) {
				console.log(err);
		    return res.send(500, { message: "User Find Error" });

		  // No User found
		  } else if (!user) {
		    return res.send(404, { message: "No User Found Error" });

		  // Found User!
		  } else {
			  // Update User
		  	user.email = email;
		  	user.save(function(err) {
					// Error handling
					if (err) {
						console.log(err);
				    return res.send(500, { message: "User Save Error" });
				  }
			  	// return UserJSON
					var userJSON = JSON.stringify(user);
			  	return res.send(userJSON);
		  	});
		  }
		});
	},

	courses: function(req, res) {
		res.contentType('application/json');
		var username = req.param('username');

		User.findOne({
			username: username
		}).done(function(err, user) {
			// Error handling
			if (err) {
				console.log(err);
		    return res.send(500, { message: "User Find Error" });
		  // No User found
		  } else if (!user) {
		    return res.send(404, { message: "No User Found Error" });
		  // Found User!
		  } else {
		  	var coursesObject = new Array();
	  		Course.find({
	  			where: {
	  				or: getConditionFromIDs(user.courses)
	  			}
	  		}).done(function(err, courses) {
	  			if (!err && courses) {
	  				for (var index in courses)
	  					coursesObject.push(courses[index]);
						var coursesJSON = JSON.stringify(coursesObject);
				  	return res.send(coursesJSON);
	  			} else
		    		// return res.send(404, { message: "No Course Found Error" });
		    		return res.send(JSON.stringify(new Array()));
	  		});
		  }
		});
	},

	joinable_courses: function(req, res) {
		res.contentType('application/json');
		var username = req.param('username');

		User.findOne({
			username: username
		}).done(function(err, user) {
			// Error handling
			if (err) {
				console.log(err);
		    return res.send(500, { message: "User Find Error" });
		  // No User found
		  } else if (!user) {
		    return res.send(404, { message: "No User Found Error" });
		  // Found User!
		  } else {
	  		School.find({
	  			where: {
	  				or: getConditionFromIDs(user.schools)
	  			}
	  		}).done(function(err, schools) {
	  			if (!err && schools) {
	  				var coursesArray = new Array();
	  				for (var index in schools)
	  					coursesArray = coursesArray.concat(schools[index].courses);

				  	var coursesObject = new Array();
			  		Course.find({
			  			where: {
			  				or: getConditionFromIDs(coursesArray)
			  			}
			  		}).done(function(err, courses) {
			  			if (!err && courses) {
			  				for (var index in courses)
			  					coursesObject.push(courses[index]);
								var coursesJSON = JSON.stringify(coursesObject);
						  	return res.send(coursesJSON);
			  			} else
				    		return res.send(404, { message: "No Course Found Error" });
			  		});

	  			} else
		    		return res.send(404, { message: "No School Found Error" });
	  		});
		  }
		});
	},

	schools: function(req, res) {
		res.contentType('application/json');
		var username = req.param('username');

		User.findOne({
			username: username
		}).done(function(err, user) {
			// Error handling
			if (err) {
				console.log(err);
		    return res.send(500, { message: "User Find Error" });
		  // No User found
		  } else if (!user) {
		    return res.send(404, { message: "No User Found Error" });
		  // Found User!
		  } else {
		  	var schoolsObject = new Array();
	  		Course.find({
	  			where: {
	  				or: getConditionFromIDs(user.schools)
	  			}
	  		}).done(function(err, schools) {
	  			if (!err && schools) {
	  				for (var index in schools)
	  					schoolsObject.push(schools[index]);
						var schoolsJSON = JSON.stringify(schoolsObject);
				  	return res.send(schoolsJSON);
	  			} else
		    		return res.send(404, { message: "No School Found Error" });
	  		});
		  }
		});
	},

	join_school: function(req, res) {
		res.contentType('application/json');
		var username = req.param('username');
		var school_id = req.param('school_id');
		
		User.findOne({
			username: username
		}).done(function(err, user) {
			// Error handling
			if (err) {
				console.log(err);
		    return res.send(500, { message: "User Find Error" });

		  // No User found
		  } else if (!user) {
		    return res.send(404, { message: "No User Found Error" });

		  // Found User!
		  } else {
		  	if (!user.schools) user.schools = new Array();

		  	var school = parseInt(school_id);
		  	if (isNaN(school)) return res.send(500, { message: "School id is NaN Error" });

      	// add school if user doesn't have school
		  	if (user.schools.indexOf(school) == -1)
			  	user.schools.push(school);
      	// save new values
	      user.save(function(err) {
					// Error handling
					if (err) {
						console.log(err);
				    return res.send(500, { message: "User Save Error" });
				  }
			  	// return UserJSON
					var userJSON = JSON.stringify(user);
			  	return res.send(userJSON);
	      });
		  }
		});
	},

	join_course: function(req, res) {
		res.contentType('application/json');
		var username = req.param('username');
		var course_id = req.param('course_id');
		
		User.findOne({
			username: username
		}).done(function(err, user) {
			// Error handling
			if (err) {
				console.log(err);
		    return res.send(500, { message: "User Find Error" });
		  // No User found
		  } else if (!user) {
		    return res.send(404, { message: "No User Found Error" });
		  // Found User!
		  } else {
		  	if (!user.courses) user.courses = new Array();

      	// add course if user doesn't have course
		  	if (user.courses.indexOf(Number(course_id)) == -1)
			  	user.courses.push(Number(course_id));
      	// save new values
	      user.save(function(err) {
					// Error handling
					if (err) {
						console.log(err);
				    return res.send(500, { message: "User Save Error" });
				  }
			  	// return UserJSON
					var userJSON = JSON.stringify(user);
			  	return res.send(userJSON);
	      });

	      Course.findOne(Number(course_id)).done(function(err, course) {
	      	if (!err && course) {
	      		if (!course.students) course.students = new Array();

	      		if (course.students.indexOf(user.id) == -1)
	      			course.students.push(user.id);
	      		course.save(function(err) {});
	      	}
	      });
		  }
		});
	},

	feed: function(req, res) {
		res.contentType('application/json');
		var username = req.param('username');
		var page = req.param('page');
		
		User.findOne({
			username: username
		}).done(function(err, user) {
			// Error handling
			if (err) {
				console.log(err);
		    return res.send(500, { message: "User Find Error" });
		  // No User found
		  } else if (!user) {
		    return res.send(404, { message: "No User Found Error" });
		  // Found User!
		  } else {
	  		Course.find({
	  			where: {
	  				or: getConditionFromIDs(user.courses)
	  			}
	  		}).done(function(err, courses) {
	  			if (!err && courses) {
	  				var postsArray = new Array();
	  				for (var index in courses)
	  					postsArray = postsArray.concat(courses[index].posts);

				  	var postsObject = new Array();
			  		Post.find({
			  			where: {
			  				or: getConditionFromIDs(postsArray)
			  			}
			  		}).sort('id DESC').done(function(err, posts) {
			  			if (!err && posts) {
			  				for (var index in posts)
			  					postsObject.push(posts[index]);
								var postsJSON = JSON.stringify(postsObject);
						  	return res.send(postsJSON);
			  			} else
				    		return res.send(404, { message: "No Post Found Error" });
			  		});

	  			} else
		    		return res.send(404, { message: "No School Found Error" });
	  		});
		  }
		});
	},

	notification: function(req, res) {
		res.contentType('application/json');
		var username = req.param('username');

		console.log("notification");
		
		User.findOne({
			username: username
		}).done(function(err, user) {
			// Error handling
			if (err) {
				console.log(err);
		    return res.send(500, { message: "User Find Error" });
		  // No User found
		  } else if (!user) {
		    return res.send(404, { message: "No User Found Error" });
		  // Found User!
		  } else {
		  	sendNotification(user, "Hello", "World");
		  }
		});
	}
};

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
var sendNotification = function(user, title, message) {
	if (!user.notification_key)
		return;

	console.log("start notification");
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
		var apns = require('apn');

		var options = { cert: "./Certification/aps_development.pem",
										certData: null,
										key: "./Certification/APN_Key.pem",
										keyData: null,
										passphrase: "bttendanceutopia",
										ca: null,
										gateway: "gateway.sandbox.push.apple.com",
										port: 2195,
										enhanced: true,
										errorCallback: undefined,
										cacheLength: 100 };

    var apnConnection = new apns.Connection(options);
		var myDevice = new apns.Device(user.notification_key); //for token
		var note = new apns.Notification();

		console.log("iPhone notification start");

		note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
		note.badge = 1;
		note.sound = "ping.aiff";
		note.alert = "\uD83D\uDCE7 \u2709 You have a new message";
		note.payload = {'messageFrom': 'Caroline'};
		note.device = myDevice;

		// apnConnection.pushNotification(note, myDevice);
		apnConnection.sendNotification(note);
		console.log("iphone notification finished");
	}
}

// Function for signin API
var checkPass = function(res, err, user, password, uuid) {

	// Error handling
	if (err) {
		console.log(err);
    return res.send(500, { message: "User Find Error" });

  // No User found
  } else if (!user) {
    return res.send(404, { message: "No User Found Error" });

  // Found User!
  } else if (!passwordHash.verify(password, user.password)) {
	  return res.send(404, { message: "Password doesn't match Error" });
  } else if (user.device_uuid != uuid) {
	  return res.send(406, { message: "UUID doesn't match Error" });
  } else {
		var userJSON = JSON.stringify(user);
		// Add Password
		// var userObj = JSON.parse(userJSON);
		// userObj.password = user.password;
		// userJSON = JSON.stringify(userObj);
  	return res.send(userJSON);
  }
}

