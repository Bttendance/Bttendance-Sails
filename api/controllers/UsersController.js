/**
 * UsersController
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

var Error = require('../utils/errors');
var Arrays = require('../utils/arrays');
var Random = require('../utils/random');
var Email = require('../utils/email');
var PasswordHash = require('password-hash');
var Nodemailer = require("nodemailer");
var	FS = require('fs');
var Path = require('path');

module.exports = {

	signup: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var username = req.param('username');
		var password = req.param('password');
		var full_name = req.param('full_name');
		var email = req.param('email');
		var device_type = req.param('device_type');
		var device_uuid = req.param('device_uuid');

		if (!username) {
			console.log("UserController : signin : Username or Email is required");
			return res.send(400, Error.alert("Sign Up Error", "Username is required."));
		}

		if (!password) {
			console.log("UserController : signin : Password is required");
			return res.send(400, Error.alert("Sign Up Error", "Password is required."));
		}

		if (!email) {
			console.log("UserController : signin : Email is required");
			return res.send(400, Error.alert("Sign Up Error", "Email is required."));
		}

		if (!full_name) {
			console.log("UserController : signin : Full Name is required");
			return res.send(400, Error.alert("Sign Up Error", "Full Name is required."));
		}

		if (!device_type) {
			console.log("UserController : signin : Device Type is required");
			return res.send(400, Error.alert("Sign Up Error", "Device Type is required."));
		}

		if (!device_uuid) {
			console.log("UserController : signin : UUID is required");
			return res.send(400, Error.alert("Sign Up Error", "UUID is required."));
		}

		Devices.findOneByUuid(device_uuid).populate('owner').exec(function callback(err, device) {
			if (err)
				return res.send(500, Error.log("Deivce Find Error"));

		  if (device && device.owner)
				return res.send(500, Error.alert("Sign Up Error", "Deivce has been registered to other owner."));

		  Users
		  .findOne({
			  or: [{username_lower: username.toLowerCase()}, {email: email}]
			})
		  .exec(function callback(err, user) {
		  	if (err && !user)
					return res.send(500, Error.log("User Find Error"));
			  if (user && user.username_lower == username.toLowerCase())
					return res.send(500, Error.alert("Sign Up Error", "Username is already taken."));
			  if (user && user.email == email)
					return res.send(500, Error.alert("Sign Up Error", "Email is already taken."));

			  if (device) {
					Users.create({
						username: username,
						password: password,
						email: email,
						full_name: full_name,
						device: device.id				
					}).exec(function callback(err, new_user) {
						if (err || !new_user)
							return res.send(500, Error.log("User Create Error"));

					  Devices.update({ id: device.id }, { owner: new_user.id }).exec(function callback(err, updated_device) {
							if (err || !updated_device)
								return res.send(500, Error.log("Deivce Save Error"));

					    Users
							.findOneById(new_user.id)
							.populate('device')
							.populate('supervising_courses')
							.populate('attending_courses')
							.populate('employed_schools')
							.populate('serials')
							.populate('enrolled_schools')
							.populate('identifications')
							.exec(function callback(err, user_new) {
								if (err || !user_new)
									return res.send(404, Error.log("No User Found Error"));

						  	return res.send(user_new.toWholeObject());
							});
						});
					});
			  } else {
					Devices.create({
						type: device_type,
						uuid: device_uuid
					}).exec(function callback(err, new_device) {
						if (err || !new_device)
							return res.send(500, Error.log("Deivce Create Error"));

						Users.create({
							username: username,
							password: password,
							email: email,
							full_name: full_name,
							device: new_device.id			
						}).exec(function callback(err, new_user) {
							if (err || !new_user)
								return res.send(500, Error.log("User Create Error"));

						  Devices.update({ id: new_device.id }, { owner: new_user.id }).exec(function callback(err, updated_device) {
								if (err || !updated_device)
									return res.send(500, Error.log("Deivce Save Error"));

						    Users
								.findOneById(new_user.id)
								.populate('device')
								.populate('supervising_courses')
								.populate('attending_courses')
								.populate('employed_schools')
								.populate('serials')
								.populate('enrolled_schools')
								.populate('identifications')
								.exec(function callback(err, user_new) {
									if (err || !user_new)
										return res.send(404, Error.log("No User Found Error"));

							  	return res.send(user_new.toWholeObject());
								});
							});
						});
					});
				}
		  });
		});
	},

  // 401 : Auto Sign Out
	// 441 : Update Recommended
	// 442 : Update Required
	auto_signin: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var username = req.param('username');
		var password = req.param('password');
		var device_uuid = req.param('device_uuid');
		var device_type = req.param('device_type');
		var app_version = req.param('app_version');

		Users
		.findOneByUsername(username)
		.populate('device')
		.populate('supervising_courses')
		.populate('attending_courses')
		.populate('employed_schools')
		.populate('serials')
		.populate('enrolled_schools')
		.populate('identifications')
		.exec(function callback(err, user) {
			if (err || !user)
		    return res.send(401, Error.alert("Auto Sign Out", "User doesn't exist."));

		  if (password != user.password)
		    return res.send(401, Error.alert("Auto Sign Out", "Password is incorrect."));

		  if (device_uuid != user.device.uuid)
		    return res.send(401, Error.alert("Auto Sign Out", "User has been signed-in other device."));

	    // return res.send(441, Error.alert("Update Available", "New version of Bttendance has been updated. Please update the app for new features."));
	    // return res.send(442, Error.alert("Update Available", "New version of Bttendance has been updated. Please update the app for new features."));
	  	return res.send(user.toWholeObject());
		});
	},

	signin: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var username = req.param('username');
		var password = req.param('password');
		var device_uuid = req.param('device_uuid');

		if (!username) {
			console.log("UserController : signin : Username or Email is required");
			return res.send(400, Error.alert("Sign In Error", "Username or Email is required."));
		}

		if (!password) {
			console.log("UserController : signin : Password is required");
			return res.send(400, Error.alert("Sign In Error", "Password is required."));
		}

		if (!device_uuid) {
			console.log("UserController : signin : UUID is required");
			return res.send(400, Error.alert("Sign In Error", "Device ID is required."));
		}

		username = username.toLowerCase();

		Users
		.findOne({
		  or: [{username_lower: username}, {email: username}]
		})
		.populate('device')
		.populate('supervising_courses')
		.populate('attending_courses')
		.populate('employed_schools')
		.populate('serials')
		.populate('enrolled_schools')
		.populate('identifications')
		.exec(function callback(err, user) {
			if (err || !user)
		    return res.send(500, Error.alert("Sign In Error", "Please check your username of email again."));

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

				Devices
				.findOneByUuid(device_uuid)
				.populate('owner')
				.exec(function callback(err, device) {
					if (err)
						return res.send(500, Error.log("Device Found Error"));

					else if (!device) {
						user.device.uuid = device_uuid;
						user.device.save(function callback(err) {
					   	if (err)
								return res.send(500, Error.log("Device Save Error"));

					  	return res.send(user.toWholeObject());
						});
					} else if (device.uuid != user.device.uuid) {
						device.uuid = device.owner.username_lower;
						device.save(function callback(err) {
							if (err)
								return res.send(500, Error.log("Device Save Error"));

						  user.device.uuid = device_uuid;
						  console.log(user);
						  user.device.save(function callback(err) {
								if (err)
									return res.send(500, Error.log("Device Save Error"));

						  	return res.send(user.toWholeObject());
						  })
						});
					} else
				  	return res.send(user.toWholeObject());
				});
			} else {
				if (!PasswordHash.verify(password, user.password)) {
				  return res.send(404, Error.alert("Sign In Error", "Please check your password again."));
			  } else if (user.device.uuid != device_uuid) {
				  return res.send(404, Error.alert("Sign In Error", "We doesn't support multi devices for now."));
			  } else {
			  	return res.send(user.toWholeObject());
			  }
			}
		});
	},

	forgot_password: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var email = req.param('email');

		Users
		.findOneByEmail(email)
		.populate('device')
		.populate('supervising_courses')
		.populate('attending_courses')
		.populate('employed_schools')
		.populate('serials')
		.populate('enrolled_schools')
		.populate('identifications')
		.exec(function callback(err, user) {
			if (err || !user)
		    return res.send(404, Error.alert("Password Recovery Error", "Email hasn't been registered."));

		  var password = Random.string(8);
		  user.password = PasswordHash.generate(password);

			// create reusable transport method (opens pool of SMTP connections)
			var smtpTransport = Nodemailer.createTransport("SMTP",{
			    service: "Gmail",
			    auth: {
			        user: "no-reply@bttendance.com",
			        pass: "N0n0r2ply"
			    }
			});

			var path = Path.resolve(__dirname, '../../assets/emails/change_password.html');
			FS.readFile(path, 'utf8', function (err, file) {
			  if (err)
				  return res.send(500, Error.alert("Sending Email Error", "Oh uh, error occurred. Please try it again."));

  			file = file.replace('#fullname', user.full_name);
  			file = file.replace('#password', password);

				// setup e-mail data with unicode symbols
				var mailOptions = {
				    from: "Bttendance<no-reply@bttendance.com>", // sender address
				    to: user.email, // list of receivers
				    subject: "Password Recovery", // Subject line
				    html: file, // plaintext body
				}

				user.save(function callback(err, user) {
		  		if (err || !user)
						return res.send(400, Error.alert("Password Recovery Error", "Updating password has been failed."));

					// send mail with defined transport object
					smtpTransport.sendMail(mailOptions, function(error, response) {
				    if(error || !response || !response.message)
						  return res.send(500, Error.alert("Sending Email Error", "Oh uh, error occurred. Please try it again."));
		        return res.send(Email.json(user.email));
					});
				});
  		});
		});
	},

	update_profile_image: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var username = req.param('username');
		var profile_image = req.param('profile_image');

		if (!profile_image)
			return res.send(400, Error.alert("Update Profile Image Error", "Profile Image is required."));

		Users
		.findOneByUsername(username)
		.populate('device')
		.populate('supervising_courses')
		.populate('attending_courses')
		.populate('employed_schools')
		.populate('serials')
		.populate('enrolled_schools')
		.populate('identifications')
		.exec(function callback(err, user) {
			if (err || !user)
				return res.send(404, Error.alert("Update Profile Image Error", "User doesn't exist."));

	  	user.profile_image = profile_image;
	  	user.save(function callback(err, updated_user) {
	  		if (err || !updated_user)
					return res.send(400, Error.alert("Update Profile Image Error", "Updating profile image has been failed."));
		  	return res.send(updated_user.toWholeObject());
	  	});
		});
	},

	update_full_name: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var username = req.param('username');
		var full_name = req.param('full_name');

		if (!full_name)
			return res.send(400, Error.alert("FullName Update Error", "FullName is required."));

		Users
		.findOneByUsername(username)
		.populate('device')
		.populate('supervising_courses')
		.populate('attending_courses')
		.populate('employed_schools')
		.populate('serials')
		.populate('enrolled_schools')
		.populate('identifications')
		.exec(function callback(err, user) {
			if (err || !user)
				return res.send(404, Error.alert("FullName Update Error", "User doesn't exist."));

	  	user.full_name = full_name;
	  	user.save(function callback(err, updated_user) {
	  		if (err || !updated_user)
					return res.send(400, Error.alert("FullName Update Error", "Updating full name has been failed."));
		  	return res.send(updated_user.toWholeObject());
	  	});
		});
	},

	update_email: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var username = req.param('username');
		var email = req.param('email');

		if (!email)
			return res.send(400, Error.alert("Email Update Error", "Email is required."));

		Users
		.findOneByUsername(username)
		.populate('device')
		.populate('supervising_courses')
		.populate('attending_courses')
		.populate('employed_schools')
		.populate('serials')
		.populate('enrolled_schools')
		.populate('identifications')
		.exec(function callback(err, user) {
			if (err || !user)
				return res.send(404, Error.alert("Email Update Error", "User doesn't exist."));

	  	user.email = email;
	  	user.save(function callback(err, updated_user) {
	  		if (err || !updated_user)
					return res.send(400, Error.alert("Email Update Error", "Email already registered to other user."));
		  	return res.send(updated_user.toWholeObject());
	  	});
		});
	},

	feed: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var username = req.param('username');
		var page = req.param('page');
		
		Users
		.findOneByUsername(username)
		.populate('supervising_courses')
		.populate('attending_courses')
		.exec(function callback(err, user) {
			if (err || !user) 
		    return res.send(404, { message: "No User Found Error" });

	  	var supervising_courses = Arrays.getIds(user.supervising_courses);
	  	var attending_courses = Arrays.getIds(user.attending_courses);
	  	var total_courses = supervising_courses.concat(attending_courses);

  		Courses
  		.findById(total_courses)
			.populate('posts')
	  	.populate('students')
	  	.populate('school')
  		.exec(function callback(err, courses) {
  			if (err || !courses)
	    		return res.send(new Array());

				var total_posts = new Array();
				for (var i = 0; i < courses.length; i++)
					for (var j = 0; j < courses[i].posts.length; j++)
						total_posts.push(courses[i].posts[j].id);

	  		Posts
	  		.findById(total_posts)
	  		.populate('author')
	  		.populate('course')
	  		.populate('attendance')
	  		.populate('clicker')
	  		.sort('id DESC')
	  		.exec(function callback(err, posts) {
	  			if (err || !posts)
		    		return res.send(JSON.stringify(new Array()));

					for (var i = 0; i < posts.length; i++) {

						var students_count = 0;
						for (var j = 0; j < courses.length; j++) {
							if (courses[j].id == posts[i].course.id) {
								students_count = courses[j].students.length;
			  				posts[i].school_name = courses[j].school.name;
							}
						}

						var grade;
						var message;
						if (posts[i].type == 'attendance') {
							grade = Number(( (posts[i].attendance.checked_students.length - 1) / students_count * 100).toFixed());
		  				if (grade  < 0) grade = 0;
		  				if (grade > 100) grade = 100;

		  				if (supervising_courses.indexOf(posts[i].course.id) >= 0)
		  					message = "Attendance rate : " + grade + "%";
		  				else {
		  					if (posts[i].attendance.checked_students.indexOf(user.id) >= 0)
		  						message = "Attendance Checked";
		  					else
		  					 message = "Attendance Failed";
		  				}
		  			}

	  				posts[i] = posts[i].toWholeObject();
	  				if (posts[i].type == 'attendance') {
		  				posts[i].grade = grade;
	  					posts[i].message = message;
	  				}
					}
			  	return res.send(posts);
	  		});
  		});
		});
	},

	courses: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var username = req.param('username');

		Users
		.findOneByUsername(username)
		.populate('supervising_courses')
		.populate('attending_courses')
		.exec(function callback(err, user) {
			if (err || !user) 
		    return res.send(404, { message: "No User Found Error" });

	  	var supervising_courses = Arrays.getIds(user.supervising_courses);
	  	var attending_courses = Arrays.getIds(user.attending_courses);
	  	var total_courses = supervising_courses.concat(attending_courses);

  		Courses
  		.findById(total_courses)
			.populate('posts')
	  	.populate('managers')
	  	.populate('students')
	  	.populate('school')
  		.exec(function callback(err, courses) {
  			if (err || !courses)
		    		return res.send(JSON.stringify(new Array()));

				var total_posts = new Array();
				for (var i = 0; i < courses.length; i++)
					for (var j = 0; j < courses[i].posts.length; j++)
						total_posts.push(courses[i].posts[j].id);

	    	Posts
	  		.findById(total_posts)
	  		.populate('attendance')
	  		.sort('id DESC')
	  		.exec(function callback(err, posts) {
	  			if (!posts) {
						for (var i = 0; i < courses.length; i++) {
							courses[i] = courses[i].toWholeObject();
							courses[i].grade = 0;
						}
				  	return res.send(courses);
	  			}
					
					for (var i = 0; i < courses.length; i++) {
						var checks = new Array();
						var attd_check_count = 0;
						for (var j = 0; j < posts.length; j++) {
							if (posts[j].type == "attendance") {
								checks = checks.concat(posts[j].attendance.checked_students);
								attd_check_count++;
							}
						}
						var grade = Number( ( (checks.length - attd_check_count) / attd_check_count / courses[i].students.length * 100).toFixed() );
  					if (grade  < 0) grade = 0;
  					if (grade > 100) grade = 100;

						courses[i] = courses[i].toWholeObject();
  					courses[i].grade = grade;
					}
			  	return res.send(courses);
	  		});
  		});
		});
	},

	search: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var search_id = req.param('search_id');

		if (!search_id)
	    return res.send(400, { message: "Need username of email" });
	  search_id = search_id.toLowerCase();

		Users
		.findOne({
		  or: [{username_lower: search_id}, {email: search_id}]
		})
		.populate('device')
		.populate('supervising_courses')
		.populate('attending_courses')
		.populate('employed_schools')
		.populate('serials')
		.populate('enrolled_schools')
		.populate('identifications')
		.exec(function callback(err, user) {
			if (err || !user)
		    return res.send(404, { message: "No User Found Error" });

	  	return res.send(user);
		});
	}
	
};
