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

	feed: function(req, res) {
		res.contentType('application/json');
		var username = req.param('username');
		var page = req.param('page');
		
		User.findOne({
			username: username
		}).done(function(err, user) {
			if (err || !user) 
		    return res.send(404, { message: "No User Found Error" });

	  	var total_courses = new Array();
	  	for (var i = 0; i < user.supervising_courses.length; i++)
	  		total_courses.push(user.supervising_courses[i]);
	  	for (var i = 0; i < user.attending_courses.length; i++)
	  		total_courses.push(user.attending_courses[i]);

  		Course.find({
  			where: {
  				or: getConditionFromIDs(total_courses)
  			}
  		}).done(function(err, courses) {
  			if (err || !courses)
	    		return res.send(404, { message: "No Course Found Error" });

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
		    		return res.send(JSON.stringify(new Array()));
	  		});
  		});
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
		  	var total_courses = new Array();
		  	for (var i = 0; i < user.supervising_courses.length; i++)
		  		total_courses.push(user.supervising_courses[i]);
		  	for (var i = 0; i < user.attending_courses.length; i++)
		  		total_courses.push(user.attending_courses[i]);

	  		Course.find({
	  			where: {
	  				or: getConditionFromIDs(total_courses)
	  			}
	  		}).done(function(err, courses) {
	  			if (!err && courses) {
		  			var coursesObject = new Array();
	  				for (var index in courses)
	  					coursesObject.push(courses[index]);
						var coursesJSON = JSON.stringify(coursesObject);
				  	return res.send(coursesJSON);
	  			} else
		    		return res.send(JSON.stringify(new Array()));
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
		  	var total_schools = new Array();
		  	for (var i = 0; i < user.employed_schools.length; i++)
		  		total_schools.push(user.employed_schools[i]);
		  	for (var i = 0; i < user.enrolled_schools.length; i++)
		  		total_schools.push(user.enrolled_schools[i]);

	  		School.find({
	  			where: {
	  				or: getConditionFromIDs(total_schools)
	  			}
	  		}).done(function(err, schools) {
	  			if (!err && schools) {
		  			var schoolsObject = new Array();
	  				for (var index in schools)
	  					schoolsObject.push(schools[index]);
						var schoolsJSON = JSON.stringify(schoolsObject);
				  	return res.send(schoolsJSON);
	  			} else
		    		return res.send(JSON.stringify(new Array()));
	  		});
		  }
		});
	},

	attend_course: function(req, res) {
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
		  	if (!user.attending_courses) user.attending_courses = new Array();

      	// add course if user doesn't have course
		  	if (user.attending_courses.indexOf(Number(course_id)) == -1)
			  	user.attending_courses.push(Number(course_id));

	      Course.findOne(Number(course_id)).done(function(err, course) {
	      	if (!err && course) {
	      		if (!course.students) course.students = new Array();

	      		if (course.students.indexOf(user.id) == -1)
	      			course.students.push(user.id);
	      		course.save(function(err) {});

			      user.save(function(err) {
							if (err)
						    return res.send(500, { message: "User Save Error" });

							var userJSON = JSON.stringify(user);
					  	return res.send(userJSON);
			      });
	      	}
	      });
		  }
		});
	},
	
	employ_school: function(req, res) {
		res.contentType('application/json');
		var username = req.param('username');
		var school_id = req.param('school_id');
		var serial = req.param('serial');

		User.findOne({
			username: username
		}).done(function(err, user) {
			if (err || !user)
		    return res.send(500, { message: "User Find Error" });

	  	Serial.findOne({
	  		key: serial
	  	}).done(function(err, serial) {
	  		if (err || !serial)
		    	return res.send(500, { message: "Serial Find Error" });

		    if (serial.school != school_id)
		    	return res.send(500, { message: "School doesn't match Error" });

		  	if (!user.employed_schools) user.employed_schools = new Array();

	    	var school_serial = new Array();
	    	school_serial.push(Number(school_id));
	    	school_serial.push(serial);
			  user.employed_schools.push(school_serial);

      	// save new values
	      user.save(function(err) {
					if (err)
				    return res.send(500, { message: "User Save Error" });

					var userJSON = JSON.stringify(user);
			  	return res.send(userJSON);
	      });
	  	});
		});
	},
	
	enroll_school: function(req, res) {
		res.contentType('application/json');
		var username = req.param('username');
		var school_id = req.param('school_id');
		var identity = req.param('identity');

		User.findOne({
			username: username
		}).done(function(err, user) {
			if (err || !user)
		    return res.send(500, { message: "User Find Error" });

	  	if (!user.enrolled_schools) user.enrolled_schools = new Array();

    	var school_identity = new Array();
    	school_identity.push(Number(school_id));
    	school_identity.push(identity);
		  user.enrolled_schools.push(school_identity);

    	// save new values
      user.save(function(err) {
				if (err)
			    return res.send(500, { message: "User Save Error" });

				var userJSON = JSON.stringify(user);
		  	return res.send(userJSON);
      });
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
  	return res.send(userJSON);
  }
}

