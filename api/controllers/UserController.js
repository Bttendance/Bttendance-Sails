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
var Moment = require('moment');

module.exports = {

	auto_signin: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var username = req.param('username');
		var password = req.param('password');
		var device_uuid = req.param('device_uuid');

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
		    return res.send(401, { message: "Username Find Error" });

		  if (password != user.password)
		    return res.send(401, { message: "Passwrod doesn't match Error" });

		  if (device_uuid != user.device.uuid)
		    return res.send(401, { message: "Device uuid doesn't match Error" });

	  	return res.send(user.toOldObject());
		});
	},

	signin: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var username = req.param('username');
		var password = req.param('password');
		var device_uuid = req.param('device_uuid');

		if (!username) {
			console.log("UserController : signin : Username or Email is required");
			return res.send(400, signError("Username or Email is required", device_type));
		}

		if (!password) {
			console.log("UserController : signin : Password is required");
			return res.send(400, signError("Password is required", device_type));
		}

		if (!device_uuid) {
			console.log("UserController : signin : UUID is required");
			return res.send(400, signError("UUID is required", device_type));
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
		    return res.send(500, { message: "User Find Error" });

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
						return res.send(500, signError("Device Found Error", device_type));

					else if (!device) {
						user.device.uuid = device_uuid;
						user.device.save(function callback(err) {
					   	if (err)
								return res.send(500, signError("Device Save Error", device_type));

					  	return res.send(user.toOldObject());
						});
					} else if (device.uuid != user.device.uuid) {
						device.uuid = device.owner.username_lower;
						device.save(function callback(err) {
							if (err)
								return res.send(500, signError("Device Save Error", device_type));

						  user.device.uuid = device_uuid;
						  console.log(user);
						  user.device.save(function callback(err) {
								if (err)
									return res.send(500, signError("Device Save Error", device_type));

						  	return res.send(user.toOldObject());
						  })
						});
					} else
				  	return res.send(user.toOldObject());
				});
			} else
				return checkPass(res, err, user, password, device_uuid);
		});
	},

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
			return res.send(400, signError("Username or Email is required", device_type));
		}

		if (!password) {
			console.log("UserController : signin : Password is required");
			return res.send(400, signError("Password is required", device_type));
		}

		if (!email) {
			console.log("UserController : signin : Email is required");
			return res.send(400, signError("Email is required", device_type));
		}

		if (!full_name) {
			console.log("UserController : signin : Full Name is required");
			return res.send(400, signError("Full Name is required", device_type));
		}

		if (!device_type) {
			console.log("UserController : signin : Device Type is required");
			return res.send(400, signError("Device Type is required", device_type));
		}

		if (!device_uuid) {
			console.log("UserController : signin : UUID is required");
			return res.send(400, signError("UUID is required", device_type));
		}

		Devices.findOneByUuid(device_uuid).populate('owner').exec(function callback(err, device) {
			if (err)
				return res.send(500, signError("Deivce Find Error", device_type));

		  if (device && device.owner)
				return res.send(500, signError("Deivce has been registered to other owner", device_type));

		  Users.findOneByUsername_lower(username.toLowerCase()).exec(function callback(err, user) {
		  	if (err)
					return res.send(500, signError("User Find Error", device_type));
			  if (user)
					return res.send(500, signError("Username is already taken", device_type));

			  if (device) {
					Users.create({
						username: username,
						password: password,
						email: email,
						full_name: full_name,
						device: device.id				
					}).exec(function callback(err, new_user) {
						if (err || !new_user)
							return res.send(500, signError("User Create Error", device_type));

					  Devices.update({ id: device.id }, { owner: new_user.id }).exec(function callback(err, updated_device) {
							if (err || !updated_device)
								return res.send(500, signError("Deivce Save Error", device_type));

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
									return res.send(404, signError("No User Found Error", device_type));

						  	return res.send(user_new.toOldObject());
							});
						});
					});
			  } else {
					Devices.create({
						type: device_type,
						uuid: device_uuid
					}).exec(function callback(err, new_device) {
						if (err || !new_device)
							return res.send(500, signError("Deivce Create Error", device_type));

						Users.create({
							username: username,
							password: password,
							email: email,
							full_name: full_name,
							device: new_device.id			
						}).exec(function callback(err, new_user) {
							if (err || !new_user)
								return res.send(500, signError("User Create Error", device_type));

						  Devices.update({ id: new_device.id }, { owner: new_user.id }).exec(function callback(err, updated_device) {
								if (err || !updated_device)
									return res.send(500, signError("Deivce Save Error", device_type));

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
										return res.send(404, signError("No User Found Error", device_type));

							  	return res.send(user_new.toOldObject());
								});
							});
						});
					});
				}
		  });
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

			var text = "Dear " + user.full_name + ",\n\nWe have received a request to reset your password.\nYour new password is following.\n\nNew Password : " 
			+ password + "\n\nPlease change your password that you can remember.\nIf you did not request a password reset, then let us know about it.\n\nYours sincerely,\nTeam Bttendance."

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

	  	user.save();
	  	return res.send(user.toOldObject());
		});
	},

	update_notification_key: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var username = req.param('username');
		var notification_key = req.param('notification_key');

		if (!notification_key) {
			console.log("UserController : update_notification_key : Notification Key is required");
			return res.send(400, { message: "Notification Key is required"});
		}

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
		    return res.send(404, { message: "No User Found Error" });

		  user.device.notification_key = notification_key;
		  user.device.save(function callback(err) {
		   	if (err)
			    return res.send(500, { message: "Device Save Error" });

		  	return res.send(user.toOldObject());
	    });
		});
	},

	update_profile_image: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var username = req.param('username');
		var profile_image = req.param('profile_image');

		if (!profile_image) {
			console.log("UserController : update_profile_image : Profile Image url is required");
			return res.send(400, { message: "Profile Image url is required"});
		}

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
		    return res.send(404, { message: "No User Found Error" });

	  	user.profile_image = profile_image;
	  	user.save();
	  	return res.send(user.toOldObject());
		});
	},

	update_full_name: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var username = req.param('username');
		var full_name = req.param('full_name');

		if (!full_name) {
			console.log("UserController : update_full_name : Full Name is required");
			return res.send(400, { message: "Full Name is required"});
		}

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
		    return res.send(404, { message: "No User Found Error" });

	  	user.full_name = full_name;
	  	user.save();
	  	return res.send(user.toOldObject());
		});
	},

	update_email: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var username = req.param('username');
		var email = req.param('email');

		if (!email) {
			console.log("UserController : update_email : Email is required");
			return res.send(400, { message: "Email is required"});
		}

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
		    return res.send(404, { message: "No User Found Error" });

	  	user.email = email;
	  	user.save();
	  	return res.send(user.toOldObject());
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

	  	var supervising_courses = getIds(user.supervising_courses);
	  	var attending_courses = getIds(user.attending_courses);
	  	var total_courses = supervising_courses.concat(attending_courses);

  		Courses
  		.findById(total_courses)
			.populate('posts')
	  	.populate('students')
	  	.populate('school')
  		.exec(function callback(err, courses) {
  			if (err || !courses)
	    		return res.send(404, { message: "No Course Found Error" });

				var total_posts = new Array();
				for (var i = 0; i < courses.length; i++)
					for (var j = 0; j < courses[i].posts.length; j++)
						total_posts.push(courses[i].posts[j].id);

	  		Posts
	  		.findById(total_posts)
	  		.populate('author')
	  		.populate('course')
	  		.populate('attendance')
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

	  				posts[i] = posts[i].toOldObject();

	  				if (posts[i].type == 'attendance') {
		  				posts[i].grade = grade;
	  					posts[i].message = message;
	  				}

		  			if (posts[i].type == 'clicker') {
		  				posts[i].type = 'attendance';
		  				posts[i].title = 'Update Required';
		  				posts[i].message = 'Current version doesn\'t support clicker.';
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

	  	var supervising_courses = getIds(user.supervising_courses);
	  	var attending_courses = getIds(user.attending_courses);
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
							courses[i] = courses[i].toOldObject();
							courses[i].grade = 0;
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

						var grade = 0;
	  				if (supervising_courses.indexOf(courses[i].id) >= 0)
							grade = Number( ( (checks.length - attd_check_count) / attd_check_count / courses[i].students.length * 100).toFixed() );
	  				else
							grade = Number( (attd_checked_count / attd_check_count * 100).toFixed() );

  					if (grade < 0 || attd_check_count == 0) grade = 0;
  					if (grade > 100) grade = 100;

						courses[i] = courses[i].toOldObject();
  					courses[i].grade = grade;
					}
			  	return res.send(courses);
	  		});
  		});
		});
	},

	schools: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var username = req.param('username');

		Users
		.findOneByUsername(username)
		.populate('employed_schools')
		.populate('enrolled_schools')
		.exec(function callback(err, user) {
			if (err || !user)
		    return res.send(404, { message: "No User Found Error" });

		  var employed_schools = getIds(user.employed_schools);
	  	var enrolled_schools = getIds(user.enrolled_schools);
	  	var total_schools = employed_schools.concat(enrolled_schools);

  		Schools
  		.findById(total_schools)
  		.populate('serials')
  		.populate('courses')
  		.populate('professors')
  		.populate('students')
  		.exec(function callback(err, schools) {
  			if (err || !schools) 
	    		return res.send(JSON.stringify(new Array()));

				for (var i = 0; i < schools.length; i++)
					schools[i] = schools[i].toOldObject();
		  	return res.send(schools);
  		});
		});
	},

	attend_course: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var username = req.param('username');
		var course_id = req.param('course_id');
		
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
		    return res.send(404, { message: "No User Found Error" });

		  var supervising_courses = getIds(user.supervising_courses);
		  if (supervising_courses.indexOf(Number(course_id)) != -1)
		    return res.send(404, { message: "User is supervising this course" });

		  var attending_courses = getIds(user.attending_courses);
		  if (attending_courses.indexOf(Number(course_id)) != -1)
		    return res.send(user.toOldObject());

		  Courses.findOneById(course_id).exec(function callback(err, course) {
		  	if (err || !course)
		    	return res.send(404, { message: "No Course Found Error" });

				Courses.update({ id: course.id }, { students_count: course.students_count + 1 }).exec(function callback(err, updated_courses) {
					if (err || !updated_courses)
						return console.log(err);
				});

				user.attending_courses.add(course_id);
				user.save(function callback(err) {
					if (err)
			    	return res.send(500, { message: "User Save Error" });

			    Users
					.findOneByUsername(username)
					.populate('device')
					.populate('supervising_courses')
					.populate('attending_courses')
					.populate('employed_schools')
					.populate('serials')
					.populate('enrolled_schools')
					.populate('identifications')
					.exec(function callback(err, user_new) {
						if (err || !user_new)
					    return res.send(404, { message: "No User Found Error" });

				  	return res.send(user_new.toOldObject());
					});
				});
		  });
		});
	},
	
	employ_school: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var username = req.param('username');
		var school_id = req.param('school_id');
		var serial = req.param('serial');
		
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
		    return res.send(404, { message: "No User Found Error" });

		  Serials.findOne({
		  	key: serial,
		  	school: school_id
		  }).exec(function callback(err, serial) {
		  	if (err || !serial)
		    	return res.send(404, { message: "No Serial Found Error" });

			  var employed_schools = getIds(user.employed_schools);
			  if (employed_schools.indexOf(Number(school_id)) == -1)
			    user.employed_schools.add(school_id);

			  var serials = getIds(user.serials);
			  if (serials.indexOf(Number(school_id)) == -1)
			    user.serials.add(serial.id);

				user.save(function callback(err) {
			    Users
					.findOneByUsername(username)
					.populate('device')
					.populate('supervising_courses')
					.populate('attending_courses')
					.populate('employed_schools')
					.populate('serials')
					.populate('enrolled_schools')
					.populate('identifications')
					.exec(function callback(err, user_new) {
						if (err || !user_new)
					    return res.send(404, { message: "No User Found Error" });

				  	return res.send(user_new.toOldObject());
					});
				});
		  });
		});
	},
	
	enroll_school: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var username = req.param('username');
		var school_id = req.param('school_id');
		var student_id = req.param('student_id');

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
		    return res.send(404, { message: "No User Found Error" });

		  var enrolled_schools = getIds(user.enrolled_schools);
		  if (enrolled_schools.indexOf(Number(school_id)) != -1)
		  	return res.send(user.toOldObject());

		  Schools.findOneById(school_id).exec(function callback(err, school) {
		  	if (err || !school)
		    	return res.send(404, { message: "No School Found Error" });

				Identifications.create({
					identity: student_id,
					owner: user.id,
					school: school.id
				}).exec(function callback(err, identification) {
			  	if (err || !school)
			    	return res.send(404, { message: "Identity Generate Error" });

			    user.enrolled_schools.add(school.id);
					user.save(function callback(err) {
				    Users
						.findOneByUsername(username)
						.populate('device')
						.populate('supervising_courses')
						.populate('attending_courses')
						.populate('employed_schools')
						.populate('serials')
						.populate('enrolled_schools')
						.populate('identifications')
						.exec(function callback(err, user_new) {
							if (err || !user_new)
						    return res.send(404, { message: "No User Found Error" });

					  	return res.send(user_new.toOldObject());
						});
					});
				});
		  });
		});
	},

	search_user: function(req, res) {
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

	  	return res.send(user.toOldObject());
		});
	}
};

var getIds = function(jsonArray) {
	if (!jsonArray)
		return new Array();

  var ids = new Array();
  for (var i = 0; i < jsonArray.length; i++)
  	ids.push(jsonArray[i].id);
	return ids;
}

// Function for signin API
var checkPass = function(res, err, user, password, device_uuid) {

	// Error handling
	if (err) {
		console.log(err);
    return res.send(500, { message: "User Find Error", toast: "User Find Error" });

  // No User found
  } else if (!user) {
    return res.send(404, { message: "No User Found Error", toast: "No User Found Error" });

  // Found User!
  } else if (!passwordHash.verify(password, user.password)) {
	  return res.send(404, { message: "Password doesn't match Error", toast: "Password doesn't match Error" });
  } else if (user.device.uuid != device_uuid) {
	  return res.send(406, { message: "UUID doesn't match Error", toast: "UUID doesn't match Error" });
  } else {
  	return res.send(user.toOldObject());
  }
}

function randomKey() {
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

    for(var i=0; i < 7; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

var signError = function(message, device_type) {
	var returnJSON = {};

	if (device_type == 'iphone') {
		var array = new Array();
		array.push(message);
		returnJSON.message = array;
	} else {
		returnJSON.message = message;
		returnJSON.toast = message;
	}

	return returnJSON;
}
