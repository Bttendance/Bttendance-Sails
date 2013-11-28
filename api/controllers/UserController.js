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

	// update_type: function(req, res) {
	// 	res.contentType('application/json');
	// 	var username = req.param('username');
	// 	var type = req.param('type');

	// 	if (!type) {
	// 		console.log("UserController : update_type : Type is required");
	// 		return res.send(400, { message: "Type is required"});
	// 	}

	// 	// Type Validation
	// 	if (type != 'professor' && type != 'student') {
	// 		console.log("UserController : update_type : Wrong Type : " + type);
	// 		return res.send(400, { message: "Wrong Type"});
	// 	}

	// 	// Serial Validation
	// 	if (type == 'professor') {
	// 		var serial = req.param('serial');
	// 		if (!serial) {
	// 			console.log("UserController : update_type : Serial is required");
	// 			return res.send(400, { message: "Serial is required"});
	// 		}

	// 		if (serial != 'welcome' && serial != 'Welcome') {
	// 			console.log("UserController : update_type : Wrong Serial : " + serial);
	// 			return res.send(400, { message: "Wrong Serial"});
	// 		}
	// 	}

	// 	User.findOne({
	// 		username: username
	// 	}).done(function(err, user) {
	// 		// error handling
	// 		if (err) {
	// 			console.log(err);
	// 	    return res.send(500, { message: "User Find Error" });

	// 	  // No User found
	// 	  } else if (!user) {
	// 	    return res.send(404, { message: "No User Found Error" });

	// 	  // Found User!
	// 	  } else {
	// 	  	// Type is Already Exist!
	// 	  	if (user.type != null)
	// 		    return res.send(401, { message: "User already has type Error" });
	// 		  // Update User
	// 	  	user.type = type;
	// 	  	user.save(function(err) {
	// 				// Error handling
	// 				if (err) {
	// 					console.log(err);
	// 			    return res.send(500, { message: "User Save Error" });
	// 			  }
	// 		  	// return UserJSON
	// 				var userJSON = JSON.stringify(user);
	// 		  	return res.send(userJSON);
	// 	  	});
	// 	  }
	// 	});

	// },

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
		    		return res.send(404, { message: "No Course Found Error" });
	  		});
		  }
		});
	},

	joinableCourses: function(req, res) {
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

		  	var course = parseInt(course_id);
		  	if (isNaN(course)) return res.send(500, { message: "Course id is NaN Error" });
      	// add course if user doesn't have course
		  	if (user.courses.indexOf(course) == -1)
			  	user.courses.push(course);
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

	feed: function(req, res) {
		res.contentType('application/json');
		var username = req.param('username');
		var page = req.param('page');

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
		// Add Password
		// var userObj = JSON.parse(userJSON);
		// userObj.password = user.password;
		// userJSON = JSON.stringify(userObj);
  	return res.send(userJSON);
  }
}

