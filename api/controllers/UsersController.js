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
		var locale = req.param('locale');
		if (!locale || locale != 'ko')
			locale = 'en';

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
				return res.send(500, Error.log(req, "Sign Up Error", "Deivce Find Error"));

		  if (device && device.owner)
				return res.send(500, Error.alert(req, "Sign Up Error", "Your deivce already has been registered."));

		  Users
		  .findOneByEmail(email.toLowerCase())
		  .exec(function callback(err, user) {
		  	if (err && !user)
					return res.send(500, Error.log(req, "Sign Up Error", "User Find Error"));
			  if (user && user.email == email)
					return res.send(500, Error.alert(req, "Sign Up Error", "Email is already taken."));

			  if (device) {
					Users.create({
						username: username,
						password: password,
						email: email,
						full_name: full_name,
						locale: locale,
						device: device.id				
					}).exec(function callback(err, new_user) {
						if (err || !new_user)
							return res.send(500, Error.alert(req, "Sign Up Error", "User Create Error. Please try sign up again."));

					  Devices.update({ id: device.id }, { owner: new_user.id }).exec(function callback(err, updated_device) {
							if (err || !updated_device)
								return res.send(500, Error.alert(req, "Sign Up Error", "Deivce Save Error. Please try sign up again."));

					    Users
							.findOneById(new_user.id)
							.populateAll()
							.exec(function callback(err, user_new) {
								if (err || !user_new)
									return res.send(500, Error.log(req, "Sign Up Error", "No User Found Error"));

							  // create reusable transport method (opens pool of SMTP connections)
								var smtpTransport = Nodemailer.createTransport({
								    service: "Gmail",
								    auth: {
								        user: "no-reply@bttendance.com",
								        pass: "N0n0r2ply"
								    }
								});

								var path;

								if (!locale || locale != 'ko')
									locale = 'en';

								if(locale == 'ko') {
									path = Path.resolve(__dirname, '../../assets/emails/Welcome_KO.html');
								} else {
									path = Path.resolve(__dirname, '../../assets/emails/Welcome_EN.html');
								}

								FS.readFile(path, 'utf8', function (err, file) {
								  if (err)
					  				return res.send(500, { message: "File Read Error" });

									// setup e-mail data with unicode symbols
									var mailOptions = {
									    from: "Bttendance<no-reply@bttendance.com>", // sender address
									    to: user_new.email, // list of receivers
									    subject: sails.__({ phrase: "Welcome to BTTENDANCE!", locale: locale }), // Subject line
									    html: file, // plaintext body
									}

									// send mail with defined transport object
									smtpTransport.sendMail(mailOptions, function(error, info) {
									});
								});

								UserCache.updateFromCache(user_new);
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
							locale: locale,
							device: new_device.id			
						}).exec(function callback(err, new_user) {
							if (err || !new_user)
								return res.send(500, Error.alert(req, "Sign Up Error",  "User Create Error. Please try sign up again."));

						  Devices.update({ id: new_device.id }, { owner: new_user.id }).exec(function callback(err, updated_device) {
								if (err || !updated_device)
									return res.send(500, Error.alert(req, "Sign Up Error",  "Deivce Save Error. Please try sign up again."));

						    Users
								.findOneById(new_user.id)
								.populateAll()
								.exec(function callback(err, user_new) {
									if (err || !user_new)
										return res.send(500, Error.log(req, "Sign Up Error", "No User Found Error"));
									
								  // create reusable transport method (opens pool of SMTP connections)
									var smtpTransport = Nodemailer.createTransport({
									    service: "Gmail",
									    auth: {
									        user: "no-reply@bttendance.com",
									        pass: "N0n0r2ply"
									    }
									});

									var path;
									if (!locale || locale != 'ko')
										locale = 'en';
									if(locale == 'ko') {
										path = Path.resolve(__dirname, '../../assets/emails/Welcome_KO.html');
									} else {
										path = Path.resolve(__dirname, '../../assets/emails/Welcome_EN.html');
									}

									FS.readFile(path, 'utf8', function (err, file) {
									  if (err)
						  				return res.send(500, { message: "File Read Error" });

										// setup e-mail data with unicode symbols
										var mailOptions = {
										    from: "Bttendance<no-reply@bttendance.com>", // sender address
										    to: user_new.email, // list of receivers
										    subject: sails.__({ phrase: "Welcome to BTTENDANCE!", locale: locale }), // Subject line
										    html: file, // plaintext body
										}

										// send mail with defined transport object
										smtpTransport.sendMail(mailOptions, function(error, info) {
										});
									});

									UserCache.updateFromCache(user_new);
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
		var locale = req.param('locale');
		var device_uuid = req.param('device_uuid');
		var device_type = req.param('device_type');
		var app_version = req.param('app_version');
		if (!locale || locale != 'ko')
			locale = 'en';

		UserCache
		.findFromCache(email, function callback(err, user) {
			if (err || !user)
		    return res.send(401, Error.alert(req, "Auto Sign Out", "User doesn't exist."));

		  if (password != user.password)
		    return res.send(401, Error.alert(req, "Auto Sign Out", "Password is incorrect."));

		  if (device_uuid != user.device.uuid)
		    return res.send(401, Error.alert(req, "Auto Sign Out", "User has been signed-in other device."));

	    if (parseFloat(app_version) < 1)
		    return res.send(442, Error.alert(req, sails.__({ phrase: "Update Available", locale: locale }), sails.__({ phrase: "New version of Bttendance has been updated. Please update the app for new features.", locale: locale })));
	    
	    // if (device_type == 'android' && parseFloat(app_version) < 1.1)
		   //  return res.send(441, Error.alert(req, sails.__({ phrase: "Update Available", locale: locale }), sails.__({ phrase: "New version of Bttendance has been updated. Please update the app for new features.", locale: locale })));
	    
	  	return res.send(user);
		});
	},

	signin: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var username = req.param('username');
		var email = req.param('email');
		var password = req.param('password');
		var device_uuid = req.param('device_uuid');
		var device_type = req.param('device_type');

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
		.populateAll()
		.exec(function callback(err, user) {
			if (err || !user)
		    return res.send(500, Error.alert(req, "Sign In Error", "Please check your USERNAME or EMAIL address again."));

			if (email == "apple0@apple.com"
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
						return res.send(500, Error.log(req, "Sign In Error", "Device Found Error"));

					if (!device) {
						user.device.uuid = device_uuid;
						user.device.save(function callback(err) {
					   	if (err)
								return res.send(500, Error.log(req, "Sign In Error", "Device Save Error"));

							UserCache.updateFromCache(user);
					  	return res.send(user.toWholeObject());
						});
					} else if (device.uuid != user.device.uuid) {
						device.owner = user.id;
						device.save(function callback(err) {
							if (err)
								return res.send(500, Error.log(req, "Sign In Error", "Device Save Error"));

						  user.device.uuid = device_uuid;
						  console.log(user);
						  user.device.save(function callback(err) {
								if (err)
									return res.send(500, Error.log(req, "Sign In Error", "Device Save Error"));

								UserCache.updateFromCache(user);
						  	return res.send(user.toWholeObject());
						  })
						});
					} else {
						UserCache.updateFromCache(user);
				  	return res.send(user.toWholeObject());
					}
				});
			} else {
				if (!PasswordHash.verify(password, user.password)) {
				  return res.send(500, Error.alert(req, "Sign In Error", "Please check your PASSWORD again."));
			  } else if (user.device.uuid != device_uuid) {

					Devices
					.findOneByUuid(device_uuid)
					.populate('owner')
					.exec(function callback(err, device) {
						if (err)
							return res.send(500, Error.log(req, "Sign In Error", "Device Found Error"));

						if (!device) {
							Devices
							.create({
								type: device_type,
								uuid: device_uuid,
								owner: user.id
							}).exec(function callback(err, new_device) {
								if (err || !new_device) {
									console.log(err);
									console.log(new_device);
									return res.send(500, Error.log(req, "Sign In Error", "Device Create Error"));
								}

								user.device.owner = null;
								user.device.save();

								user.device = new_device;
								user.save(function(err, updated_user) {
									if (err || !updated_user)
										return res.send(500, Error.log(req, "Sign In Error", "User Update Error"));

									Users.findOneById(updated_user.id).populateAll().exec(function callback(err, user) {
										if (err || !user)
											return res.send(500, Error.log(req, "Sign In Error", "User Found Error"));

										UserCache.updateFromCache(user);
								  	return res.send(user.toWholeObject());
									});
								});
							});
						} else if (device.owner && device.owner != null) {
						  return res.send(500, Error.alert(req, "Sign In Error", "We doesn't support multi devices for now. If you have changed your phone, please contact us via contact@bttendance.com."));
						} else {
							user.device.owner = null;
							user.device.save();

							device.owner = user;
							device.save();

							user.device = device;
							user.save(function(err, updated_user) {
								if (err || !updated_user)
									return res.send(500, Error.log(req, "Sign In Error", "User Update Error"));

								Users.findOneById(updated_user.id).populateAll().exec(function callback(err, user) {
									if (err || !user)
										return res.send(500, Error.log(req, "Sign In Error", "User Found Error"));

									UserCache.updateFromCache(user);
							  	return res.send(user.toWholeObject());
								});
							});
						}
					});
			  } else {
					UserCache.updateFromCache(user);
			  	return res.send(user.toWholeObject());
			  }
			}
		});
	},

	forgot_password: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var email = req.param('email');
		var locale = req.param('locale');
		if (!locale || locale != 'ko')
			locale = 'en';

		Users
		.findOneByEmail(email)
		.populateAll()
		.exec(function callback(err, user) {
			if (err || !user)
		    return res.send(500, Error.alert(req, "Password Recovery Error", "Please check your email address again."));

		  var password = Random.string(8);
		  user.password = PasswordHash.generate(password);

			// create reusable transport method (opens pool of SMTP connections)
			var smtpTransport = Nodemailer.createTransport({
			    service: "Gmail",
			    auth: {
			        user: "no-reply@bttendance.com",
			        pass: "N0n0r2ply"
			    }
			});

			var path;
			if(locale == 'ko')
				path = Path.resolve(__dirname, '../../assets/emails/ForgotPassword_KO.html');
			else
				path = Path.resolve(__dirname, '../../assets/emails/ForgotPassword_EN.html');

			FS.readFile(path, 'utf8', function (err, file) {
			  if (err)
				  return res.send(500, Error.alert(req, "Sending Email Error", "Oh uh, error occurred. Please try it again."));

  			file = file.replace('#fullname', user.full_name);
  			file = file.replace('#password', password);

				// setup e-mail data with unicode symbols
				var mailOptions = {
				    from: "Bttendance<no-reply@bttendance.com>", // sender address
				    to: user.email, // list of receivers
				    subject: sails.__({ phrase: "Password Recovery", locale: locale }), // Subject line
				    html: file, // plaintext body
				}

				user.save(function callback(err, user) {
		  		if (err || !user)
						return res.send(400, Error.alert(req, "Password Recovery Error", "Password recovery has been failed."));

					// send mail with defined transport object
					smtpTransport.sendMail(mailOptions, function(error, info) {
				    if(error)
						  return res.send(500, Error.alert(req, "Sending Email Error", "Oh uh, error occurred. Please try it again."));

						UserCache.updateFromCache(user);
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
		var locale = req.param('locale');
		if (!locale || locale != 'ko')
			locale = 'en';

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
		.populateAll()
		.exec(function callback(err, user) {
			if (err || !user)
				return res.send(500, Error.alert(req, "Password Update Error", "User doesn't exist."));

			if (!PasswordHash.verify(password_old, user.password))
			  return res.send(500, Error.alert(req, "Password Update Error", "Please check your old password again."));

	    user.password = PasswordHash.generate(password_new);

			// create reusable transport method (opens pool of SMTP connections)
			var smtpTransport = Nodemailer.createTransport({
			    service: "Gmail",
			    auth: {
			        user: "no-reply@bttendance.com",
			        pass: "N0n0r2ply"
			    }
			});

			var path;
			if(locale == 'ko')
				path = Path.resolve(__dirname, '../../assets/emails/UpdatePassword_KO.html');
			else
				path = Path.resolve(__dirname, '../../assets/emails/UpdatePassword_EN.html');

			FS.readFile(path, 'utf8', function (err, file) {
			  if (err)
				  return res.send(500, Error.alert(req, "Sending Email Error", "Oh uh, error occurred. Please try it again."));

  			file = file.replace('#fullname', user.full_name);
  			file = file.replace('#password', password_new);

				// setup e-mail data with unicode symbols
				var mailOptions = {
				    from: "Bttendance<no-reply@bttendance.com>", // sender address
				    to: user.email, // list of receivers
				    subject: sails.__({ phrase: "Password Update", locale: locale }), // Subject line
				    html: file, // plaintext body
				}

				user.save(function callback(err, user) {
		  		if (err || !user)
						return res.send(400, Error.alert(req, "Password Update Error", "Updating password has been failed."));

					// send mail with defined transport object
					smtpTransport.sendMail(mailOptions, function(error, info) {
				    if(error)
						  return res.send(500, Error.alert(req, "Sending Email Error", "Oh uh, error occurred. Please try it again."));

						UserCache.updateFromCache(user);
		        return res.send(user.toWholeObject());
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
		.populateAll()
		.exec(function callback(err, user) {
			if (err || !user)
				return res.send(500, Error.alert(req, "FullName Update Error", "User doesn't exist."));

	  	user.full_name = full_name;
	  	user.save(function callback(err, updated_user) {
	  		if (err || !updated_user)
					return res.send(400, Error.alert(req, "FullName Update Error", "Updating full name has been failed."));

				UserCache.updateFromCache(updated_user);
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
			.populateAll()
			.exec(function callback(err, user) {
				if (err || !user)
					return res.send(500, Error.alert(req, "Email Update Error", "User doesn't exist."));

		  	user.email = email;
		  	user.save(function callback(err, updated_user) {
		  		if (err || !updated_user)
						return res.send(400, Error.alert(req, "Email Update Error", "Email already registered to other user."));

				UserCache.updateFromCache(updated_user);
			  	return res.send(updated_user.toWholeObject());
		  	});
			});
		} else {
			if (!email_new)
				return res.send(400, Error.alert(req, "Email Update Error", "New email is required."));

			Users
			.findOneByEmail(email)
			.populateAll()
			.exec(function callback(err, user) {
				if (err || !user)
					return res.send(500, Error.alert(req, "Email Update Error", "User doesn't exist."));

		  	user.email = email_new;
		  	user.save(function callback(err, updated_user) {
		  		if (err || !updated_user)
						return res.send(400, Error.alert(req, "Email Update Error", "Email already registered to other user."));
					
					UserCache.updateFromCache(updated_user);
			  	return res.send(updated_user.toWholeObject());
		  	});
			});
		}
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
		  or: [{username: search_id}, {email: search_id}]
		})
		.populateAll()
		.exec(function callback(err, user) {
			if (err || !user)
		    return res.send(404, Error.alert(req, "Searching User Error", "Fail to find a user \"%s\".\nPlease check User ID of Email again.", search_id));

		  if (user.email == email)
		    return res.send(400, Error.alert(req, "Busted", "HaHa, trying to find yourself? Got You! :)"));

	  	return res.send(user);
		});
	},

	feed: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var username = req.param('username');
		var page = req.param('page');
		
		Users
		.findOneByUsername(username)
		.populateAll()
		.exec(function callback(err, user) {
			if (err || !user) 
				return res.send(500, Error.log(req, "User Feed Error", "User doesn't exist."));

	  	var supervising_courses = Arrays.getIds(user.supervising_courses);
	  	var attending_courses = Arrays.getIds(user.attending_courses);
	  	var total_courses = supervising_courses.concat(attending_courses);

  		Courses
  		.findById(total_courses)
			.populateAll()
  		.exec(function callback(err, courses) {
  			if (err || !courses)
	    		return res.send(new Array());

				var total_posts = new Array();
				for (var i = 0; i < courses.length; i++)
					for (var j = 0; j < courses[i].posts.length; j++)
						total_posts.push(courses[i].posts[j].id);

	  		Posts
	  		.findById(total_posts)
				.populateAll()
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
							var locale = user.locale;
							if (!locale || locale != 'ko')
								locale = 'en';

							grade = Number(( (posts[i].attendance.checked_students.length + posts[i].attendance.late_students.length) / students_count * 100).toFixed());
		  				if (grade < 0 || isNaN(grade)) grade = 0;
		  				if (grade > 100) grade = 100;

		  				if (supervising_courses.indexOf(posts[i].course.id) >= 0)
		  					message = (posts[i].attendance.checked_students.length + posts[i].attendance.late_students.length) + "/" + students_count + " (" + grade + "%) " + sails.__({ phrase: "students has been attended.", locale: locale });
		  				else {
		  					if (posts[i].attendance.checked_students.indexOf(user.id) >= 0)
		  						message = sails.__({ phrase: "Attendance Checked", locale: locale })
		  					else if (posts[i].attendance.late_students.indexOf(user.id) >= 0)
		  						message = sails.__({ phrase: "Attendance Late", locale: locale })
		  					else if (Moment().diff(Moment(posts[i].createdAt)) < 60 * 1000 && posts[i].attendance.type == 'auto') 
		  					 	message = sails.__({ phrase: "Attendance Checking", locale: locale })
	  						else
		  					 	message = sails.__({ phrase: "Attendance Failed", locale: locale })
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
		var email = req.param('email');
		var username = req.param('username');

		UserCache
		.findFromCache(email, function callback(err, user) {
			if (err || !user) 
				return res.send(500, Error.log(req, "Courses Error", "User doesn't exist."));

	  	var supervising_courses = Arrays.getIds(user.supervising_courses);
	  	var attending_courses = Arrays.getIds(user.attending_courses);
	  	var total_courses = supervising_courses.concat(attending_courses);

			CourseCache
			.findManyFromCache(total_courses, function callback(err, courses) {
  			if (err || !courses)
		    		return res.send(JSON.stringify(new Array()));

				var total_posts = new Array();
				for (var i = 0; i < courses.length; i++)
					for (var j = 0; j < courses[i].posts.length; j++)
						total_posts.push(courses[i].posts[j].id);

	    	Posts
	  		.findById(total_posts)
				.populate('attendance')
				.populate('clicker')
				.populate('notice')
	  		.sort('id DESC')
	  		.exec(function callback(err, posts) {
	  			if (!posts) {
						for (var i = 0; i < courses.length; i++) {
							courses[i].grade = 0;
							courses[i].attendance_rate = 0;
							courses[i].clicker_rate = 0;
							courses[i].notice_unseen = 0;
						}
				  	return res.send(courses);
	  			}
					
					for (var i = 0; i < courses.length; i++) {

						// Attendance
						var attendance_rate = 0; //전체 출석률 or 본인의 출석률
						var attd_last = undefined; //가장 마지막 attendance
						var attd_checks = new Array(); //checked_students late_students를 모두 합한 Array
						var attd_usage = 0; //attd check을 여태까지 몇번했는지
						var attd_checked_count = 0; //본인이 attd check이 몇번 되었는지 (강의자의 경우 attd check을 한것으로 인정)

						// Clicker
						var clicker_rate = 0; //전체 참여율 or 본인의 참여율
						var clicker_last = undefined; //가장 마지막 clicker
						var clicker_checks = new Array(); //a_students, b_students, c_students, d_students, e_students를 모두 합한 Array
						var clicker_usage = 0; //clicker를 여태까지 몇번 사용 했는지
						var clicker_checked_count = 0; //본인이 clicker를 몇번 참여했는지 (강의자의 경우 참여 안한 것으로 간주)

						// Notice
						var notice_unseen = 0;
						var notice_last = undefined; //가장 마지막 attendance
						var notice_usage = 0; //notice를 post한 횟수
						var notice_seen_count = 0; //본인이 notice를 몇개 보았는지 (강의자의 경우 안본 것으로 간주)

						for (var j = 0; j < posts.length; j++) {

							// Attendance Count
							if (posts[j].course == courses[i].id && posts[j].type == "attendance") {
								if (posts[j].attendance.checked_students.indexOf(user.id) >= 0)
									attd_checked_count++;

								if (!attd_last)
									attd_last = posts[j].attendance;

								attd_checks = attd_checks.concat(posts[j].attendance.checked_students);
								attd_checks = attd_checks.concat(posts[j].attendance.late_students);

								attd_usage++;
							}

							// Clicker Count
							if (posts[j].course == courses[i].id && posts[j].type == "clicker") {
								if (posts[j].clicker.a_students.indexOf(user.id) >= 0)
									clicker_checked_count++;
								if (posts[j].clicker.b_students.indexOf(user.id) >= 0)
									clicker_checked_count++;
								if (posts[j].clicker.c_students.indexOf(user.id) >= 0)
									clicker_checked_count++;
								if (posts[j].clicker.d_students.indexOf(user.id) >= 0)
									clicker_checked_count++;
								if (posts[j].clicker.e_students.indexOf(user.id) >= 0)
									clicker_checked_count++;

								clicker_checks = clicker_checks.concat(posts[j].clicker.a_students);
								clicker_checks = clicker_checks.concat(posts[j].clicker.b_students);
								clicker_checks = clicker_checks.concat(posts[j].clicker.c_students);
								clicker_checks = clicker_checks.concat(posts[j].clicker.d_students);
								clicker_checks = clicker_checks.concat(posts[j].clicker.e_students);

								clicker_usage++;
							}

							// Notice Count
							if (posts[j].course == courses[i].id && posts[j].type == "notice") {
								if (posts[j].notice.seen_students.indexOf(user.id) >= 0)
									notice_seen_count++;

								if (!notice_last)
									notice_last = posts[j].notice;

								notice_usage++;
							}
						}

	  				if (supervising_courses.indexOf(courses[i].id) >= 0) {
							attendance_rate = Number( ( attd_checks.length / attd_usage / courses[i].students_count * 100).toFixed() );
							clicker_rate = Number( ( clicker_checks.length / clicker_usage / courses[i].students_count * 100).toFixed() );
							if (notice_last)
								notice_unseen = courses[i].students_count - notice_last.seen_students.length;
							else
								notice_unseen = courses[i].students_count;
	  				} else {
							attendance_rate = Number( (attd_checked_count / attd_usage * 100).toFixed() );
							clicker_rate = Number( (clicker_checked_count / clicker_usage * 100).toFixed() );
							notice_unseen = notice_usage - notice_seen_count;
	  				}

	  				// Attendance Rate >= 0 & < 100
  					if (attendance_rate < 0 || attd_usage == 0 || isNaN(attendance_rate)) attendance_rate = 0;
  					if (attendance_rate > 100) attendance_rate = 100;

	  				// Attendance Rate >= 0 & < 100
  					if (clicker_rate < 0 || clicker_usage == 0 || isNaN(clicker_rate)) clicker_rate = 0;
  					if (clicker_rate > 100) clicker_rate = 100;

  					courses[i].grade = attendance_rate;
  					courses[i].attendance_rate = attendance_rate;
  					courses[i].clicker_rate = clicker_rate;
  					courses[i].notice_unseen = notice_unseen;
  					courses[i].clicker_usage = clicker_usage;
  					courses[i].notice_usage = notice_usage;
  					if (attd_last)
	  					courses[i].attdCheckedAt = attd_last.createdAt;

					}
			  	return res.send(courses);
	  		});
  		});
		});
	}
	
};
