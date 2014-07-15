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
var Moment = require('moment');
var Validator = require('validator');

module.exports = {

	signup: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var username = req.param('username');
		var password = req.param('password');
		var full_name = req.param('full_name');
		var email = req.param('email');
		var device_type = req.param('device_type');
		var device_uuid = req.param('device_uuid');

		if (!password) 
			return res.send(400, Error.alert(req, "Sign Up Error", "Password is required."));

		if (password.length < 6) 
			return res.send(400, Error.alert(req, "Sign Up Error", "Password is too short. (should be longer than 6 letters)"));

		if (!email)
			return res.send(400, Error.alert(req, "Sign Up Error", "Email is required."));

		if (!Validator.isEmail(email))
			return res.send(400, Error.alert(req, "Sign Up Error", "Email is wrong formed."));

		if (!full_name || full_name.length == 0)
			return res.send(400, Error.alert(req, "Sign Up Error", "Full Name is required."));

		if (!device_type)
			return res.send(400, Error.alert(req, "Sign Up Error", "Device Type is required."));

		if (!device_uuid)
			return res.send(400, Error.alert(req, "Sign Up Error", "Device ID is required."));

		Devices.findOneByUuid(device_uuid).populate('owner').exec(function callback(err, device) {
			if (err)
				return res.send(500, Error.log(req, "Deivce Find Error"));

		  if (device && device.owner)
				return res.send(500, Error.alert(req, "Sign Up Error", "Your deivce already has been registered."));

		  Users
		  .findOneByEmail(email.toLowerCase())
		  .exec(function callback(err, user) {
		  	if (err && !user)
					return res.send(500, Error.log(req, "User Find Error"));
			  if (user && user.email == email)
					return res.send(500, Error.alert(req, "Sign Up Error", "Email is already taken."));

			  if (device) {
					Users.create({
						username: username,
						password: password,
						email: email,
						full_name: full_name,
						device: device.id				
					}).exec(function callback(err, new_user) {
						if (err || !new_user)
							return res.send(500, Error.alert(req, "Sign Up Error", "User Create Error. Please try sign up again."));

					  Devices.update({ id: device.id }, { owner: new_user.id }).exec(function callback(err, updated_device) {
							if (err || !updated_device)
								return res.send(500, Error.alert(req, "Sign Up Error", "Deivce Save Error. Please try sign up again."));

					    Users
							.findOneById(new_user.id)
							.populate('device')
							.populate('supervising_courses')
							.populate('attending_courses')
							.populate('employed_schools')
							.populate('enrolled_schools')
							.populate('identifications')
							.exec(function callback(err, user_new) {
								if (err || !user_new)
									return res.send(404, Error.log(req, "No User Found Error"));

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
							return res.send(500, Error.alert(req, "Sign Up Error",  "Deivce Create Error"));

						Users.create({
							username: username,
							password: password,
							email: email,
							full_name: full_name,
							device: new_device.id			
						}).exec(function callback(err, new_user) {
							if (err || !new_user)
								return res.send(500, Error.alert(req, "Sign Up Error",  "User Create Error. Please try sign up again."));

						  Devices.update({ id: new_device.id }, { owner: new_user.id }).exec(function callback(err, updated_device) {
								if (err || !updated_device)
									return res.send(500, Error.alert(req, "Sign Up Error",  "Deivce Save Error. Please try sign up again."));

						    Users
								.findOneById(new_user.id)
								.populate('device')
								.populate('supervising_courses')
								.populate('attending_courses')
								.populate('employed_schools')
								.populate('enrolled_schools')
								.populate('identifications')
								.exec(function callback(err, user_new) {
									if (err || !user_new)
										return res.send(404, Error.log(req, "No User Found Error"));

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
		var email = req.param('email');
		var password = req.param('password');
		var device_uuid = req.param('device_uuid');
		var device_type = req.param('device_type');
		var app_version = req.param('app_version');

		Users
		.findOne({
		  or : [
		    { email: email },
		    { username: username }
		  ]
		})
		.populate('device')
		.populate('supervising_courses')
		.populate('attending_courses')
		.populate('employed_schools')
		.populate('enrolled_schools')
		.populate('identifications')
		.exec(function callback(err, user) {
			if (err || !user)
		    return res.send(401, Error.alert(req, "Auto Sign Out", "User doesn't exist."));

		  if (password != user.password)
		    return res.send(401, Error.alert(req, "Auto Sign Out", "Password is incorrect."));

		  if (device_uuid != user.device.uuid)
		    return res.send(401, Error.alert(req, "Auto Sign Out", "User has been signed-in other device."));

	    // return res.send(441, Error.alert(req, "Update Available", "New version of Bttendance has been updated. Please update the app for new features."));
	    // return res.send(442, Error.alert(req, "Update Available", "New version of Bttendance has been updated. Please update the app for new features."));
	  	return res.send(user.toWholeObject());
		});
	},

	signin: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var username = req.param('username');
		var email = req.param('email');
		var password = req.param('password');
		var device_uuid = req.param('device_uuid');

		if (!username && !email)
			return res.send(400, Error.alert(req, "Sign In Error", "Username or Email is required."));

		if (!password)
			return res.send(400, Error.alert(req, "Sign In Error", "Password is required."));

		if (!device_uuid) 
			return res.send(400, Error.alert(req, "Sign In Error", "Device ID is required."));

		Users
		.findOne({
		  or : [
		    { email: email },
		    { username: username }
		  ]
		})
		.populate('device')
		.populate('supervising_courses')
		.populate('attending_courses')
		.populate('employed_schools')
		.populate('enrolled_schools')
		.populate('identifications')
		.exec(function callback(err, user) {
			if (err || !user)
		    return res.send(500, Error.alert(req, "Sign In Error", "Please check your username of email address again."));

			if (username == "appletest0"
		|| username == "appletest1" 
		|| username == "appletest2"
		|| username == "appletest3"
		|| username == "appletest4"
		|| username == "appletest5"
		|| username == "appletest6"
		|| username == "appletest7"
		|| username == "appletest8"
		|| username == "appletest9"
		|| email == "apple0@apple.com"
		|| email == "apple1@apple.com"
		|| email == "apple2@apple.com"
		|| email == "apple3@apple.com"
		|| email == "apple4@apple.com"
		|| email == "apple5@apple.com"
		|| email == "apple6@apple.com"
		|| email == "apple7@apple.com"
		|| email == "apple8@apple.com"
		|| email == "apple9@apple.com") {

				Devices
				.findOneByUuid(device_uuid)
				.populate('owner')
				.exec(function callback(err, device) {
					if (err)
						return res.send(500, Error.log(req, "Device Found Error"));

					else if (!device) {
						user.device.uuid = device_uuid;
						user.device.save(function callback(err) {
					   	if (err)
								return res.send(500, Error.log(req, "Device Save Error"));

					  	return res.send(user.toWholeObject());
						});
					} else if (device.uuid != user.device.uuid) {
						device.uuid = device.owner.username_lower;
						device.save(function callback(err) {
							if (err)
								return res.send(500, Error.log(req, "Device Save Error"));

						  user.device.uuid = device_uuid;
						  console.log(user);
						  user.device.save(function callback(err) {
								if (err)
									return res.send(500, Error.log(req, "Device Save Error"));

						  	return res.send(user.toWholeObject());
						  })
						});
					} else
				  	return res.send(user.toWholeObject());
				});
			} else {
				if (!PasswordHash.verify(password, user.password)) {
				  return res.send(404, Error.alert(req, "Sign In Error", "Please check your password again."));
			  } else if (user.device.uuid != device_uuid) {
				  return res.send(404, Error.alert(req, "Sign In Error", "We doesn't support multi devices for now. If you have changed your phone, please contact us via contact@bttendance.com."));
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
		.populate('enrolled_schools')
		.populate('identifications')
		.exec(function callback(err, user) {
			if (err || !user)
		    return res.send(404, Error.alert(req, "Password Recovery Error", "Please check your email address again."));

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
				  return res.send(500, Error.alert(req, "Sending Email Error", "Oh uh, error occurred. Please try it again."));

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
						return res.send(400, Error.alert(req, "Password Recovery Error", "Password recovery has been failed."));

					// send mail with defined transport object
					smtpTransport.sendMail(mailOptions, function(error, response) {
				    if(error || !response || !response.message)
						  return res.send(500, Error.alert(req, "Sending Email Error", "Oh uh, error occurred. Please try it again."));
		        return res.send(Email.json(user.email));
					});
				});
  		});
		});
	},

	update_password: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var email = req.param('email');
		var password_old = req.param('password_old');
		var password_new = req.param('password_new');

		if (!email)
			return res.send(400, Error.alert(req, "Password Update Error", "Email is required."));

		if (!password_old)
			return res.send(400, Error.alert(req, "Password Update Error", "Old Password is required."));

		if (!password_new)
			return res.send(400, Error.alert(req, "Password Update Error", "New password is required."));

		if (password_new.length < 6) 
			return res.send(400, Error.alert(req, "Password Update Error", "New Password is too short. (should be longer than 6 letters)"));

		Users
		.findOneByEmail(email)
		.populate('device')
		.populate('supervising_courses')
		.populate('attending_courses')
		.populate('employed_schools')
		.populate('enrolled_schools')
		.populate('identifications')
		.exec(function callback(err, user) {
			if (err || !user)
				return res.send(404, Error.alert(req, "Password Update Error", "User doesn't exist."));

			if (!PasswordHash.verify(password_old, user.password))
			  return res.send(404, Error.alert(req, "Password Update Error", "Please check your old password again."));

	    user.password = PasswordHash.generate(password_new);

			// create reusable transport method (opens pool of SMTP connections)
			var smtpTransport = Nodemailer.createTransport("SMTP",{
			    service: "Gmail",
			    auth: {
			        user: "no-reply@bttendance.com",
			        pass: "N0n0r2ply"
			    }
			});

			var path = Path.resolve(__dirname, '../../assets/emails/update_password.html');
			FS.readFile(path, 'utf8', function (err, file) {
			  if (err)
				  return res.send(500, Error.alert(req, "Sending Email Error", "Oh uh, error occurred. Please try it again."));

  			file = file.replace('#fullname', user.full_name);
  			file = file.replace('#password', password_new);

				// setup e-mail data with unicode symbols
				var mailOptions = {
				    from: "Bttendance<no-reply@bttendance.com>", // sender address
				    to: user.email, // list of receivers
				    subject: "Password Update", // Subject line
				    html: file, // plaintext body
				}

				user.save(function callback(err, user) {
		  		if (err || !user)
						return res.send(400, Error.alert(req, "Password Update Error", "Updating password has been failed."));

					// send mail with defined transport object
					smtpTransport.sendMail(mailOptions, function(error, response) {
				    if(error || !response || !response.message)
						  return res.send(500, Error.alert(req, "Sending Email Error", "Oh uh, error occurred. Please try it again."));
		        return res.send(Email.json(user.email));
					});
				});
  		});
		});
	},

	update_full_name: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var username = req.param('username');
		var email = req.param('email');
		var full_name = req.param('full_name');

		if (!full_name)
			return res.send(400, Error.alert(req, "FullName Update Error", "FullName is required."));

		Users
		.findOne({
		  or : [
		    { email: email },
		    { username: username }
		  ]
		})
		.populate('device')
		.populate('supervising_courses')
		.populate('attending_courses')
		.populate('employed_schools')
		.populate('enrolled_schools')
		.populate('identifications')
		.exec(function callback(err, user) {
			if (err || !user)
				return res.send(404, Error.alert(req, "FullName Update Error", "User doesn't exist."));

	  	user.full_name = full_name;
	  	user.save(function callback(err, updated_user) {
	  		if (err || !updated_user)
					return res.send(400, Error.alert(req, "FullName Update Error", "Updating full name has been failed."));
		  	return res.send(updated_user.toWholeObject());
	  	});
		});
	},

	update_email: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var username = req.param('username');
		var email = req.param('email');
		var email_new = req.param('email_new');

		if (!email)
			return res.send(400, Error.alert(req, "Email Update Error", "Email is required."));

		if (username) {
			Users
			.findOneByUsername(username)
			.populate('device')
			.populate('supervising_courses')
			.populate('attending_courses')
			.populate('employed_schools')
			.populate('enrolled_schools')
			.populate('identifications')
			.exec(function callback(err, user) {
				if (err || !user)
					return res.send(404, Error.alert(req, "Email Update Error", "User doesn't exist."));

		  	user.email = email;
		  	user.save(function callback(err, updated_user) {
		  		if (err || !updated_user)
						return res.send(400, Error.alert(req, "Email Update Error", "Email already registered to other user."));
			  	return res.send(updated_user.toWholeObject());
		  	});
			});
		} else {
			if (!email_new)
				return res.send(400, Error.alert(req, "Email Update Error", "New email is required."));

			Users
			.findOneByEmail(email)
			.populate('device')
			.populate('supervising_courses')
			.populate('attending_courses')
			.populate('employed_schools')
			.populate('enrolled_schools')
			.populate('identifications')
			.exec(function callback(err, user) {
				if (err || !user)
					return res.send(404, Error.alert(req, "Email Update Error", "User doesn't exist."));

		  	user.email = email_new;
		  	user.save(function callback(err, updated_user) {
		  		if (err || !updated_user)
						return res.send(400, Error.alert(req, "Email Update Error", "Email already registered to other user."));
			  	return res.send(updated_user.toWholeObject());
		  	});
			});
		}
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
	  		.populate('notice')
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
		  				if (grade < 0 || isNaN(grade)) grade = 0;
		  				if (grade > 100) grade = 100;

		  				if (supervising_courses.indexOf(posts[i].course.id) >= 0)
		  					message = "Attendance rate : " + grade + "%";
		  				else {
		  					if (posts[i].attendance.checked_students.indexOf(user.id) >= 0)
		  						message = "Attendance Checked";
		  					else if (Moment().diff(Moment(posts[i].createdAt)) < 3 * 60 * 1000) 
		  					 	message = "Attendance Checking";
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
		.findOne({
		  or : [
		    { email: email },
		    { username: username }
		  ]
		})
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
  		.sort('id ASC')
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
							courses[i].attendance_rate = 0;
							courses[i].clicker_rate = 0;
							courses[i].notice_unseen = 0;
						}
				  	return res.send(courses);
	  			}
					
					for (var i = 0; i < courses.length; i++) {
						var checks = new Array();
						var attd_check_count = 0;
						var attd_checked_count = 0;
						for (var j = 0; j < posts.length; j++) {
							if (posts[j].course == courses[i].id && posts[j].type == "attendance") {
								if (posts[j].attendance.checked_students.indexOf(user.id) >= 0)
									attd_checked_count++;
								checks = checks.concat(posts[j].attendance.checked_students);
								attd_check_count++;
							}
						}

						var attendance_rate = 0;
						var clicker_rate = 0;
						var notice_unseen = 0;

	  				if (supervising_courses.indexOf(courses[i].id) >= 0) {
							attendance_rate = Number( ( (checks.length - attd_check_count) / attd_check_count / courses[i].students.length * 100).toFixed() );
	  				} else {
							attendance_rate = Number( (attd_checked_count / attd_check_count * 100).toFixed() );
	  				}

	  				// Attendance Rate >= 0 & < 100
  					if (attendance_rate < 0 || attd_check_count == 0) attendance_rate = 0;
  					if (attendance_rate > 100) attendance_rate = 100;

						courses[i] = courses[i].toWholeObject();
  					courses[i].grade = grade;
  					courses[i].attendance_rate = attendance_rate;
  					courses[i].clicker_rate = attendance_rate;
  					courses[i].notice_unseen = attendance_rate;
					}
			  	return res.send(courses);
	  		});
  		});
		});
	},

	search: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var search_id = req.param('search_id');
		var username = req.param('username');
		var email = req.param('email');

		if (!search_id)
	    return res.send(400, Error.alert(req, "Searching User Error", "Username or email is required." ));
	  search_id = search_id.toLowerCase();

		Users
		.findOne({
		  or: [{username_lower: search_id}, {email: search_id}]
		})
		.populate('device')
		.populate('supervising_courses')
		.populate('attending_courses')
		.populate('employed_schools')
		.populate('enrolled_schools')
		.populate('identifications')
		.exec(function callback(err, user) {
			if (err || !user)
		    return res.send(404, Error.alert(req, "Searching User Error", "Fail to find a user \"" + search_id + "\".\nPlease check User ID of Email again."));

		  if (user.username == username || user.email == email)
		    return res.send(400, Error.alert(req, "Busted", "HaHa, trying to find yourself? Got You! :)"));

	  	return res.send(user);
		});
	}
	
};
