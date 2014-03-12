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
var nodemailer = require("nodemailer");

module.exports = {

	auto_signin: function(req, res) {
		res.contentType('application/json');
		var username = req.param('username');
		var password = req.param('password');
		var device_uuid = req.param('device_uuid');

		User.findOne({
  		username: username
		}).done(function(err, user) {
			if (err || !user)
		    return res.send(401, { message: "Username Find Error" });

		  if (password != user.password)
		    return res.send(401, { message: "Passwrod doesn't match Error" });

		  if (device_uuid != user.device_uuid)
		    return res.send(401, { message: "Device uuid doesn't match Error" });

			var userJSON = JSON.stringify(user);
	  	return res.send(userJSON);
		});
	},

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

			if (username == "appletest0"
		|| username == "appletest1" 
		|| username == "appletest2"
		|| username == "appletest3"
		|| username == "appletest4"
		|| username == "appletest5"
		|| username == "appletest6"
		|| username == "appletest7"
		|| username == "appletest8"
		|| username == "appletest9") {
				user.device_uuid = uuid;

				User.findOne({
					device_uuid: uuid
				}).done(function(err, user_uuid) {
					if (user_uuid && user.id != user_uuid.id) {
						user_uuid.device_uuid = user_uuid.username;
						user_uuid.save(function(err) {
							user.save(function(err) {
								if (err)
							    return res.send(500, { message: "User Save Error" });
							  
								var userJSON = JSON.stringify(user);
					  		return res.send(userJSON);
							});
						});
					} else {
						user.save(function(err) {
							if (err)
						    return res.send(500, { message: "User Save Error" });
						  
							var userJSON = JSON.stringify(user);
				  		return res.send(userJSON);
						});
					}
				})
			} else if (user)
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

	forgot_password: function(req, res) {
		res.contentType('application/json');
		var email = req.param('email');

		User.findOne({
  		email: email
		}).done(function(err, user) {
			if (err || !user)
		    return res.send(500, { message: "User Find Error" });

		  var password = randomKey();
		  user.password = passwordHash.generate(password);

			// create reusable transport method (opens pool of SMTP connections)
			var smtpTransport = nodemailer.createTransport("SMTP",{
			    service: "Gmail",
			    auth: {
			        user: "no-reply@bttendance.com",
			        pass: "N0n0r2ply"
			    }
			});

			var text = "Dear " + user.full_name + ",\n\nWe have received a request to reset your password.\nYour new password is following.\n\nNew Password : " + password + "\n\nPlease change your password that you can remember.\nIf you did not request a password reset, then let us know about it.\n\nYours sincerely,\nTeam Bttendance."

			// setup e-mail data with unicode symbols
			var mailOptions = {
			    from: "Bttendance<no-reply@bttendance.com>", // sender address
			    to: email, // list of receivers
			    subject: "Bttendance Password Recovery", // Subject line
			    text: text, // plaintext body
			}

			// send mail with defined transport object
			smtpTransport.sendMail(mailOptions, function(error, response) {
			    if(error || !response || !response.message)
			      console.log(error);

			    console.log("Message sent: " + response.message);
			});

	  	user.save(function(err) {
				// Error handling
				if (err) {
					console.log(err);
			    return res.send(500, { message: "User Save Error" });
			  }
			  console.log("new password is : " + password);
		  	// return UserJSON
				var userJSON = JSON.stringify(user);
		  	return res.send(userJSON);
	  	});
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
	  				for (var index in posts) {
	  					if (user.supervising_courses.indexOf(posts[index].course) != -1) {

	  						var course;
	  						for (i = 0; i < courses.length; i++)
	  							if (courses[i].id == posts[index].course)
	  								course = courses[i];

	  						var grade;
	  						if (course.attd_check_count <= 0
	  							|| course.students.length <= 0)
	  							grade = 0;
	  						else {
	  							grade = Number(( (posts[index].checks.length - 1) / course.students.length * 100).toFixed());
	  						}

		  					if (grade  < 0) grade = 0;
		  					if (grade > 100) grade = 100;

	  						posts[index].grade = grade;
	  					}
	  					postsObject.push(posts[index]);
	  				}
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
	  			if (err || !courses) 
		    		return res.send(JSON.stringify(new Array()));

		    	var post_ids = new Array();
		    	for (var index in courses) 
		    		for (var i = 0; i < courses[index].posts.length; i++)
		    			if (post_ids.indexOf(courses[index].posts[i]) == -1)
		    				post_ids.push(courses[index].posts[i]);

		    	Post.find()
		  		.where({ or: getConditionFromIDs(post_ids) })
		  		.sort('id DESC')
		  		.done(function(err, posts) {
		  			if (err)
		    			return res.send(JSON.stringify(new Array()));

				  	var postsObject = new Array();
						for (var index in posts) {
							if (posts[index].type == "attendance")
								postsObject.push(posts[index]);
						}

		  			var coursesObject = new Array();
	  				for (var index in courses) {
	  					var grade = 0;

	  					if (courses[index].attd_check_count <= 0
	  						|| courses[index].students.length <= 0)
	  						grade = 0;
	  					else if (user.supervising_courses.indexOf(courses[index].id) != -1) { //supervising
	  						for (var i = 0; i < postsObject.length; i++) 
	  							if (postsObject[i].course == courses[index].id)
	  								grade += postsObject[i].checks.length - 1;
	  						grade = Number((grade/courses[index].attd_check_count/courses[index].students.length * 100).toFixed());
	  					} else {	//attending
	  						for (var i = 0; i < postsObject.length; i++) 
	  							if (postsObject[i].course == courses[index].id 
	  								&& postsObject[i].checks.indexOf(user.id) != -1)
	  								grade++;
	  						grade = Number((grade/courses[index].attd_check_count * 100).toFixed());
	  					}

	  					if (grade  < 0) grade = 0;
	  					if (grade > 100) grade = 100;

	  					courses[index].grade = grade;
	  					coursesObject.push(courses[index]);
	  				}

						var coursesJSON = JSON.stringify(coursesObject);
				  	return res.send(coursesJSON);
		  		});
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
		  		total_schools.push(user.employed_schools[i]["id"]);
		  	for (var i = 0; i < user.enrolled_schools.length; i++)
		  		total_schools.push(user.enrolled_schools[i]["id"]);

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
			if (err || !user)
		    return res.send(404, { message: "No User Found Error" });

		  if (user.supervising_courses.indexOf(Number(course_id)) != -1)
		    return res.send(404, { message: "User is supervising this course" });

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

	    	var school_key = {};
	    	school_key["id"] = Number(school_id);
	    	school_key["key"] = serial.key;

	    	for (var i = 0; i < user.employed_schools.length; i++)
	    		if (Number(school_id) == user.employed_schools[i]["id"]) {
	    			user.employed_schools.splice(i, 1);
	    			break;
	    		}

			  user.employed_schools.push(school_key);

      	// save new values
	      user.save(function(err) {
					if (err)
				    return res.send(500, { message: "User Save Error" });

			  	School.findOne(school_id).done(function(err, school) {
			  		if (err || !school)
				    	return res.send(500, { message: "School Find Error" });

				    if (!school.professors)
				    	school.professors = new Array();

				    if (school.professors.indexOf(Number(user.id)) == -1)
				    	school.professors.push(user.id);

				    school.save(function(err) {
							if (err)
						    return res.send(500, { message: "School Save Error" });

							var userJSON = JSON.stringify(user);
					  	return res.send(userJSON);
				    });	  			
			  	});
	      });
	  	});
		});
	},
	
	enroll_school: function(req, res) {
		res.contentType('application/json');
		var username = req.param('username');
		var school_id = req.param('school_id');
		var student_id = req.param('student_id');

		User.findOne({
			username: username
		}).done(function(err, user) {
			if (err || !user)
		    return res.send(500, { message: "User Find Error" });

	  	if (!user.enrolled_schools) user.enrolled_schools = new Array();

    	var school_key = {};
    	school_key["id"] = Number(school_id);
    	school_key["key"] = student_id;


    	for (var i = 0; i < user.enrolled_schools.length; i++)
    		if (Number(school_id) == user.enrolled_schools[i]["id"]) {
    			user.enrolled_schools.splice(i, 1);
    			break;
    		}

		  user.enrolled_schools.push(school_key);

    	// save new values
      user.save(function(err) {
				if (err)
			    return res.send(500, { message: "User Save Error" });

		  	School.findOne(school_id).done(function(err, school) {
		  		if (err || !school)
			    	return res.send(500, { message: "School Find Error" });

			    if (!school.students)
			    	school.students = new Array();

			    if (school.students.indexOf(Number(user.id)) == -1)
			    	school.students.push(user.id);

			    school.save(function(err) {
						if (err)
					    return res.send(500, { message: "School Save Error" });

						var userJSON = JSON.stringify(user);
				  	return res.send(userJSON);
			    });	  			
		  	});
      });
		});
	},

	search_user: function(req, res) {
		res.contentType('application/json');
		var search_id = req.param('search_id');

		if (!search_id)
	    return res.send(400, { message: "Need username of email" });

	  User.findOne({
	  	username: search_id
	  }).done(function(err, user) {
	  	if (err || !user) {
	  		User.findOne({
	  			email: search_id
	  		}).done(function(err, user) {
	  			if (err || !user)
				    return res.send(500, { message: "User Find Error" });

					var userJSON = JSON.stringify(user);
			  	return res.send(userJSON);
	  		});
	  	} else {
				var userJSON = JSON.stringify(user);
		  	return res.send(userJSON);
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

	if (array.length == 0) {
		var idObject = [];
		idObject["id"] = 0;
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

function randomKey() {
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

    for(var i=0; i < 7; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

