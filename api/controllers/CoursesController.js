/**
 * CoursesController
 *
 * @module      :: CoursesController
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
var Noti = require('../utils/notifications');
var Email = require('../utils/email');
var Xlsx = require('xlsx');
var Nodemailer = require("nodemailer");
var Moment = require('moment');
var Url = require('url');
var QueryString = require('querystring');
var	FS = require('fs');
var Path = require('path');
var Random = require('../utils/random');

module.exports = {

	create_request: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var username = req.param('username');
		var name = req.param('name');
		var number = req.param('number');
		var school_id = req.param('school_id');
		var professor_name = req.param('professor_name');

		var params = req.params.all('httpParam');
		var query = QueryString.stringify(params);

		Users
		.findOneByUsername(username)
		.exec(function callback(err, user) {
			if (err || !user)
		    return res.send(500, Error.log(req, "Course Create Request Error", "User doesn't exist."));

		  Schools
		  .findOneById(school_id)
		  .exec(function callback(err, school) {
				if (err || !school) 
			    return res.send(500, Error.log(req, "Course Create Request Error", "School doesn't exist."));

				Tokens.create({
					action: 'createCourse',
					params: query
				}).exec(function callback(err, token) {
					if (err || !token) 
				    return res.send(500, Error.log(req, "Course Create Request Error", "Token creation has been failed."));

				  var link = 'http://' + Url.parse(req.baseUrl).hostname + "/verify/" + token.key;

					// create reusable transport method (opens pool of SMTP connections)
					var smtpTransport = Nodemailer.createTransport({
					    service: "Gmail",
					    auth: {
					        user: "no-reply@bttendance.com",
					        pass: "N0n0r2ply"
					    }
					});

					var path = Path.resolve(__dirname, '../../assets/emails/create_course_verification.html');
					FS.readFile(path, 'utf8', function (err, file) {
					  if (err)
		  				return res.send(500, { message: "File Read Error" });

		  			file = file.replace('#fullname', user.full_name);
		  			file = file.replace('#courseTitle', name);
		  			file = file.replace('#courseID', number);
		  			file = file.replace('#profname', professor_name);
		  			file = file.replace('#schoolname', school.name);
		  			file = file.replace('#schoolname', school.name);
		  			file = file.replace('#validationLink', link);

						// setup e-mail data with unicode symbols
						var mailOptions = {
						    from: "Bttendance<no-reply@bttendance.com>", // sender address
						    to: user.email, // list of receivers
						    subject: "Course Creation Verification Email", // Subject line
						    html: file, // plaintext body
						}

						// send mail with defined transport object
						smtpTransport.sendMail(mailOptions, function(error, info) {
					    if(error)
							  return res.send(500, Error.alert(req, "Sending Email Error", "Oh uh, error occurred. Please try it again."));
			        return res.send(Email.json(user.email));
						});
					});
				});
		  });
		});
	},

	create_instant: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var email = req.param('email');
		var name = req.param('name');
		var school_id = req.param('school_id');
		var professor_name = req.param('professor_name');
		var locale = req.param('locale');
		if (!locale)
			locale = 'en';

		Users
		.findOneByEmail(email)
		.populateAll()
		.exec(function callback(err, user) {
			if (err || !user)
		    return res.send(500, Error.log(req, "Course Create Error", "User doesn't exist."));

		  Schools
		  .findOneById(school_id)
		  .exec(function callback(err, school) {
				if (err || !school) 
			    return res.send(500, Error.log(req, "Course Create Error", "School doesn't exist."));

			  var code = Random.string(4);
				Courses.create({
					name: name,
					school: school_id,
					professor_name: professor_name,
					code: code
				}).exec(function callback(err, course) {
					if (err || !course) 
				    return res.send(500, Error.log(req, "Course Create Error", "Fail to create a course."));

				  var employed_schools = Arrays.getIds(user.employed_schools);
				  if (employed_schools.indexOf(Number(school_id)) == -1)
				    user.employed_schools.add(school_id);

					user.supervising_courses.add(course.id);
					user.save(function callback(err) {
						if (err) 
					    return res.send(500, Error.log(req, "Course Create Error", "User save error."));

				    Users
						.findOneByEmail(email)
						.populateAll()
						.exec(function callback(err, user_new) {
							if (err || !user_new)
						    return res.send(500, Error.log(req, "Course Create Error", "User doesn't exist."));

						  Courses
						  .findOneById(course.id)
						  .populateAll()
						  .exec(function callback(err, course) {

								// create reusable transport method (opens pool of SMTP connections)
								var smtpTransport = Nodemailer.createTransport({
								    service: "Gmail",
								    auth: {
								        user: "no-reply@bttendance.com",
								        pass: "N0n0r2ply"
								    }
								});

								var path;
								var guide;
								if(locale == 'ko') {
									path = Path.resolve(__dirname, '../../assets/emails/create_course.html');
									guide = Path.resolve(__dirname, '../../assets/manual/manual_prof_kr.pdf');
								} else {
									path = Path.resolve(__dirname, '../../assets/emails/create_course_en.html');
									guide = Path.resolve(__dirname, '../../assets/manual/manual_prof_en.pdf');
								}

								var clickerlink = 'http://www.bttd.co/tutorial/clicker?device_type=' + user_new.device.type + '&locale=' + locale;
								var attendancelink = 'http://www.bttd.co/tutorial/attendance?device_type=' + user_new.device.type + '&locale=' + locale;
								var noticelink = 'http://www.bttd.co/tutorial/notice?device_type=' + user_new.device.type + '&locale=' + locale;

								FS.readFile(path, 'utf8', function (err, file) {
								  if (err)
					  				return res.send(500, { message: "File Read Error" });

					  			file = file.replace('#fullname', user_new.full_name);
					  			file = file.replace('#schoolname', course.school.name);
					  			file = file.replace('#courseTitle', course.name);
					  			file = file.replace('#classCode', course.code);
					  			file = file.replace('#profname', course.professor_name);
					  			file = file.replace('#schoolname', course.school.name);
					  			file = file.replace('#ClickerTutorialLink', clickerlink);
					  			file = file.replace('#AttendanceTutorialLink', attendancelink);
					  			file = file.replace('#NoticeTutorialLink', noticelink);

									// setup e-mail data with unicode symbols
									var mailOptions = {
									    from: "Bttendance<no-reply@bttendance.com>", // sender address
									    to: user.email, // list of receivers
									    subject: sails.__({ phrase: "Course %s Creation Finished", locale: locale }, course.name), // Subject line
									    html: file, // plaintext body
									    attachments: [{   // file on disk as an attachment
		            				fileName: "Bttendance Manual Version 1.0.pdf",
		            				filePath: guide // stream this file
		        					}]
									}

									// send mail with defined transport object
									smtpTransport.sendMail(mailOptions, function(error, info) {
									});

							  	return res.send(user_new.toWholeObject());
								});
						  });
						});
					});
				});
		  });
		});
	},

	search: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var course_code = req.param('course_code');
		var course_id = req.param('course_id');
		course_code = course_code.toLowerCase();

		Courses
		.findOne({
		  or : [
		    { id: course_id },
		    { code: course_code }
		  ]
		})
		.populateAll()
		.exec(function callback(err, course) {
			if (err || !course)
		    return res.send(500, Error.alert(req, "Course Find Error", "Course doesn't exist."));

	  	return res.send(course.toWholeObject());
		});
	},

	attend: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var email = req.param('email');
		var username = req.param('username');
		var course_id = req.param('course_id');

		Courses.findOneById(course_id).exec(function callback(err, course) {
			if (err || !course)
			    return res.send(500, Error.log(req, "Course Attend Error", "Course doesn't exist."));

			if (!course.opened)
			    return res.send(500, Error.alert(req, "Course Attend Error", "Current course is closed."));
		
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
			    return res.send(500, Error.log(req, "Course Attend Error", "User doesn't exist."));

			  var supervising_courses = Arrays.getIds(user.supervising_courses);
			  if (supervising_courses.indexOf(Number(course_id)) != -1)
			    return res.send(500, Error.alert(req, "Course Attend Error", "You are already supervising current course."));

			  var attending_courses = Arrays.getIds(user.attending_courses);
			  if (attending_courses.indexOf(Number(course_id)) != -1)
			    return res.send(500, Error.alert(req, "Course Attend Error", "You are already attending current course."));

				user.attending_courses.add(course_id);
				user.save(function callback(err) {
					if (err)
				    return res.send(500, Error.log(req, "Course Attend Error", "Fail to save user."));

			    Users
					.findOne({
					  or : [
					    { email: email },
					    { username: username }
					  ]
					})
					.populateAll()
					.exec(function callback(err, user_new) {
						if (err || !user_new)
					    return res.send(500, Error.log(req, "Course Attend Error", "User doesn't exist."));

				  	return res.send(user_new.toWholeObject());
					});
			  });
			});
		});
	},

	dettend: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var email = req.param('email');
		var username = req.param('username');
		var course_id = req.param('course_id');

		Courses.findOneById(course_id).exec(function callback(err, course) {
			if (err || !course)
			    return res.send(500, Error.log(req, "Course Unjoin Error", "Course doesn't exist."));

			if (!course.opened)
			    return res.send(500, Error.alert(req, "Course Unjoin Error", "Current course is closed."));
		
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
			    return res.send(500, Error.log(req, "Course Unjoin Error", "User doesn't exist."));

			  var supervising_courses = Arrays.getIds(user.supervising_courses);
			  if (supervising_courses.indexOf(Number(course_id)) != -1)
			    return res.send(500, Error.log(req, "Course Unjoin Error", "User is supervising this course."));

			  var attending_courses = Arrays.getIds(user.attending_courses);
			  if (attending_courses.indexOf(Number(course_id)) == -1)
			    return res.send(500, Error.log(req, "Course Unjoin Error", "User is not attending this course"));

				user.attending_courses.remove(course_id);
				user.save(function callback(err) {
					if (err)
				    return res.send(500, Error.log(req, "Course Unjoin Error", "Fail to save user."));

			    Users
					.findOne({
					  or : [
					    { email: email },
					    { username: username }
					  ]
					})
					.populateAll()
					.exec(function callback(err, user_new) {
						if (err || !user_new)
					    return res.send(500, Error.log(req, "Course Unjoin Error", "User doesn't exist."));

				  	return res.send(user_new.toWholeObject());
					});
			  });
			});
		});
	},

	feed: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var email = req.param('email');
		var username = req.param('username');
		var course_id = req.param('course_id');
		var page = req.param('page');

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
		    return res.send(500, Error.log(req, "Course Feed Error", "User doesn't exist."));

	  	var supervising_courses = Arrays.getIds(user.supervising_courses);

			Courses
			.findOneById(course_id)
			.populate('posts')
			.populate('students')
			.populate('managers')
			.exec(function callback(err, course) {
				if (err || !course)
		    return res.send(500, Error.log(req, "Course Feed Error", "Course doesn't exist."));

	  		Posts
	  		.findById(Arrays.getIds(course.posts))
				.populateAll()
	  		.sort('id DESC').exec(function(err, posts) {
	  			if (err || !posts)
				    return res.send(500, Error.log(req, "Course Feed Error", "Posts doesn't exist."));

					for (var i = 0; i < posts.length; i++) {

						var grade;
						var message;
						if (posts[i].type == 'attendance') {
							var locale = user.locale;
							if (!locale)
								locale = 'en';

							grade = Number(( (posts[i].attendance.checked_students.length + posts[i].attendance.late_students.length) / course.students.length * 100).toFixed());
		  				if (grade < 0 || isNaN(grade)) grade = 0;
		  				if (grade > 100) grade = 100;

		  				if (supervising_courses.indexOf(posts[i].course.id) >= 0)
		  					message = (posts[i].attendance.checked_students.length + posts[i].attendance.late_students.length) + "/" + course.students.length + " (" + grade + "%) " + sails.__({ phrase: "students has been attended.", locale: locale });
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

	open: function(req, res) {
    res.contentType('application/json; charset=utf-8');
    var email = req.param('email');
    var course_id = req.param('course_id');

    Courses
    .update({ id : course_id }, { opened : true })
    .exec(function callback(err, course) {
      if (err || !course)
		    return res.send(500, Error.alert(req, "Course Open Error", "Course update error."));

		  Users
		  .findOneByEmail(email)
		  .populateAll()
		  .exec(function callback(err, user) {
	      if (err || !user)
			    return res.send(500, Error.log(req, "Course Open Error", "Fail to find user."));

			  	return res.send(user.toWholeObject());
		  });
    });
	},

	close: function(req, res) {
    res.contentType('application/json; charset=utf-8');
    var email = req.param('email');
    var course_id = req.param('course_id');

    Courses
    .update({ id : course_id }, { opened : false })
    .exec(function callback(err, course) {
      if (err || !course)
		    return res.send(500, Error.alert(req, "Course Open Error", "Course update error."));

		  Users
		  .findOneByEmail(email)
		  .populateAll()
		  .exec(function callback(err, user) {
	      if (err || !user)
			    return res.send(500, Error.log(req, "Course Open Error", "Fail to find user."));

			  	return res.send(user.toWholeObject());
		  });
    });
	},

	students: function(req, res) {
    res.contentType('application/json; charset=utf-8');
    var course_id = req.param('course_id');
   
    Courses
    .findOneById(course_id)
    .populateAll()
    .exec(function callback(err, course) {
      if (err || !course)
		    return res.send(500, Error.log(req, "Course Students Error", "Course doesn't exist."));

      Users
      .findById(Arrays.getIds(course.students))
			.populateAll()
      .exec(function callback(err, users) {
        if (err || !users)
		    return res.send(500, Error.log(req, "Course Students Error", "User doesn't exist."));

        for (var index in users) {  
        	for (var i = 0; i < users[index].identifications.length; i++) 
        		if (users[index].identifications[i].school == course.school.id)
        			users[index].student_id = users[index].identifications[i].identity;
      	}

        users.sort(function(a, b) {
        	if (!a.student_id)
        		return true;
        	if (!b.student_id)
        		return false;
        	return a.student_id.localeCompare(b.student_id);
        });

		  	return res.send(users);
      });
    });
	},

	add_manager: function(req, res) {
    res.contentType('application/json; charset=utf-8');
    var course_id = req.param('course_id');
    var email = req.param('email');
    var username = req.param('username');
    var manager = req.param('manager');

    Courses
    .findOneById(course_id)
    .populateAll()
    .exec(function callback(err, course) {
      if (err || !course)
        return res.send(500, Error.alert(req, "Adding Manager Error", "Course doesn't exist."));

			if (!course.opened)
			    return res.send(500, Error.alert(req, "Adding Manager Error", "Current course is closed."));
 
      if (Arrays.getUsernames(course.managers).indexOf(username) == -1 && Arrays.getEmails(course.managers).indexOf(email) == -1)
        return res.send(500, Error.alert(req, "Adding Manager Error", "You are not supervising current course."));

      if (Arrays.getUsernames(course.students).indexOf(manager) >= 0 || Arrays.getEmails(course.students).indexOf(manager) >= 0)
        return res.send(500, Error.alert(req, "Adding Manager Error", "User is already attending current course."));

      Users
			.findOne({
			  or : [
			    { email: manager },
			    { username: manager }
			  ]
			})
      .populateAll()
      .exec(function callback(err, mang) {
        if (err || !mang)
	        return res.send(500, Error.alert(req, "Adding Manager Error", "Fail to add a user %s as a manager.\nPlease check User ID of Email again.", manager));

	      if (Arrays.getUsernames(course.managers).indexOf(manager) >= 0)
	        return res.send(500, Error.alert(req, "Adding Manager Error", "%s is already supervising current course.", mang.full_name));

			  var employed_schools = Arrays.getIds(mang.employed_schools);
			  if (employed_schools.indexOf(Number(course.school.id)) == -1)
			    mang.employed_schools.add(course.school.id);

			  mang.supervising_courses.add(course.id);

				mang.save(function callback(err) {
					console.log(err);
					if (err)
		        return res.send(500, Error.alert(req, "Adding Manager Error", "Oh uh, fail to save %s as a manager.\nPlease try again.", mang.full_name));

					Noti.send(mang, course.name, "You have been added as a manager.", "added_as_manager", course.id);
	        return res.send(course.toWholeObject());
				});

      });
    });
	},

	attendance_grades: function(req, res) {
    res.contentType('application/json; charset=utf-8');
    var course_id = req.param('course_id');

    Courses
    .findOneById(course_id)
    .populateAll()
    .exec(function callback(err, course) {
      if (err || !course)
        return res.send(500, Error.log(req, "Attendance Grades Error", "Course doesn't exist."));

      Users
      .findById(Arrays.getIds(course.students))
	    .populateAll()
      .sort('full_name DESC')
      .exec(function callback(err, users) {
        if (err || !users)
	        return res.send(500, Error.alert(req, "Attendance Grades Error", "Current course has no student."));

	  		Posts
	  		.findById(Arrays.getIds(course.posts))
		    .populateAll()
	  		.sort('id DESC')
	  		.exec(function callback(err, posts) {
	  			if (err || !posts)
		        return res.send(500, Error.alert(req, "Attendance Grades Error", "Fail to load posts."));

			  	var postsObject = new Array();
					for (var index in posts)
						if (posts[index].type == "attendance")
							postsObject.push(posts[index]);

					var total_grade = postsObject.length;
					if (total_grade <= 0)
		        return res.send(500, Error.alert(req, "Attendance Grades Error", "Current course has no attendance records."));

	        for (var index in users) {
	        	var grade = 0;
	        	for (var i = 0; i < postsObject.length; i++) {
	        		for (var j = 0; j < postsObject[i].attendance.checked_students.length; j++) {
	        			if (postsObject[i].attendance.checked_students[j] == users[index].id)
	        				grade++;
	        		}
	        	}
	        
	        	for (var i = 0; i < users[index].identifications.length; i++) 
	        		if (users[index].identifications[i].school == course.school.id)
	        			users[index].student_id = users[index].identifications[i].identity;
	        	users[index].grade = grade + "/" + total_grade;
	        }

	        users.sort(function(a, b) {
	        	if (!a.student_id)
	        		return true;
	        	if (!b.student_id)
	        		return false;
	        	return a.student_id.localeCompare(b.student_id);
	        });

	        return res.send(users);
	  		});
      });
    });
	},

	clicker_grades: function(req, res) {
    res.contentType('application/json; charset=utf-8');
    var course_id = req.param('course_id');

    Courses
    .findOneById(course_id)
    .populateAll()
    .exec(function callback(err, course) {
      if (err || !course)
        return res.send(500, Error.log(req, "Clicker Grades Error", "Course doesn't exist."));

      Users
      .findById(Arrays.getIds(course.students))
	    .populateAll()
      .sort('full_name DESC')
      .exec(function callback(err, users) {
        if (err || !users)
	        return res.send(500, Error.alert(req, "Clicker Grades Error", "Current course has no student."));

	  		Posts
	  		.findById(Arrays.getIds(course.posts))
		    .populateAll()
	  		.sort('id DESC')
	  		.exec(function callback(err, posts) {
	  			if (err || !posts)
		        return res.send(500, Error.alert(req, "Clicker Grades Error", "Fail to load posts."));

			  	var postsObject = new Array();
					for (var index in posts)
						if (posts[index].type == "clicker")
							postsObject.push(posts[index]);

					var total_grade = postsObject.length;
					if (total_grade <= 0)
		        return res.send(500, Error.alert(req, "Clicker Grades Error", "Current course has no clicker records."));

	        for (var index in users) {
	        	var grade = 0;
	        	for (var i = 0; i < postsObject.length; i++) {
	        		for (var j = 0; j < postsObject[i].clicker.a_students.length; j++)
	        			if (postsObject[i].clicker.a_students[j] == users[index].id)
	        				grade++;
	        		for (var j = 0; j < postsObject[i].clicker.b_students.length; j++)
	        			if (postsObject[i].clicker.b_students[j] == users[index].id)
	        				grade++;
	        		for (var j = 0; j < postsObject[i].clicker.c_students.length; j++)
	        			if (postsObject[i].clicker.c_students[j] == users[index].id)
	        				grade++;
	        		for (var j = 0; j < postsObject[i].clicker.d_students.length; j++)
	        			if (postsObject[i].clicker.d_students[j] == users[index].id)
	        				grade++;
	        		for (var j = 0; j < postsObject[i].clicker.e_students.length; j++)
	        			if (postsObject[i].clicker.e_students[j] == users[index].id)
	        				grade++;
	        	}
	        
	        	for (var i = 0; i < users[index].identifications.length; i++) 
	        		if (users[index].identifications[i].school == course.school.id)
	        			users[index].student_id = users[index].identifications[i].identity;
	        	users[index].grade = grade + "/" + total_grade;
	        }

	        users.sort(function(a, b) {
	        	if (!a.student_id)
	        		return true;
	        	if (!b.student_id)
	        		return false;
	        	return a.student_id.localeCompare(b.student_id);
	        });

	        return res.send(users);
	  		});
      });
    });
	},

	export_grades: function(req, res) {
    res.contentType('application/json; charset=utf-8');
    var email = req.param('email');
    var username = req.param('username');
    var course_id = req.param('course_id');
		var locale = req.param('locale');
		if (!locale)
			locale = 'en';

    Courses
    .findOneById(course_id)
    .populateAll()
    .exec(function callback(err, course) {
      if (err || !course)
        return res.send(500, Error.alert(req, "Export Grades Error", "Fail to find current course."));

      Users
      .findById(Arrays.getIds(course.students))
  		.populateAll()
      .sort('full_name DESC')
      .exec(function callback(err, users) {
        if (err || !users)
          return res.send(500, Error.alert(req, "Export Grades Error", "Current course has no student."));

	  		Posts
	  		.findById(Arrays.getIds(course.posts))
	  		.populateAll()
	  		.sort('id DESC')
	  		.exec(function callback(err, posts) {
	  			if (err || !posts)
	          return res.send(500, Error.alert(req, "Export Grades Error", "Current course has no post."));

			  	var postsObject = new Array();
					for (var index in posts)
						if (posts[index].type == "attendance")
							postsObject.push(posts[index]);

					var total_grade = postsObject.length;

	        // var data = new Array();

	        // // Student Name, Student ID, username, date#1, date#2, ... , date#n, Total Grade
	        // var headline = new Array();
	        // headline.push("Students Name");
	        // headline.push("Students ID");
	        // headline.push("username");
	        // for (var i = 0; i < postsObject.length; i++)
	        // 	headline.push(Moment(postsObject[i].createdAt).format("YYYY/MM/DD"));
	        // headline.push("Total Grade");

	        // data.push(headline);

	        // var grades = new Array();
	        // for (var index in users) {
	        // 	var gradeObject = new Array();
	        // 	gradeObject.push(users[index].full_name); // Student Name
	        // 	for (var i = 0; i < users[index].identifications.length; i++) 
	        // 		if (users[index].identifications[i].school == course.school)
	        // 			gradeObject.push(users[index].identifications[i].identity.trim()); // Student Id

	        // 	if (gradeObject.length < 2)
	        // 		gradeObject.push("Student has no ID");

	        // 	gradeObject.push(users[index].username); // Username

	        // 	var grade = 0;
	        // 	for (var i = 0; i < postsObject.length; i++) {
	        // 		var check = 0;
	        // 		for (var j = 0; j < postsObject[i].attendance.checked_students.length; j++) {
	        // 			if (postsObject[i].attendance.checked_students[j] == users[index].id) {
	        // 				grade++;
	        // 				check++;
	        // 			}
	        // 		}
	        // 		gradeObject.push(check);
	        // 	}

	        // 	gradeObject.push(grade + "/" + total_grade);
	        //   grades.push(gradeObject);
	        // }

	        // grades.sort(function(a, b) {
	        // 	if (!a[1])
	        // 		return true;
	        // 	if (!b[1])
	        // 		return false;
	        // 	return a[1].localeCompare(b[1]);
	        // });

	        // data = data.concat(grades);

	        function Workbook() {
						if(!(this instanceof Workbook)) return new Workbook();
						this.SheetNames = [];
						this.Sheets = {};
					}

	        /* add workbook */
	        var wb = new Workbook();
					wb.SheetNames = [];
					wb.Sheets = {};

					var ws_name = 'test';

					/* add worksheet to workbook */
					wb.SheetNames.push(ws_name);
					wb.Sheets[ws_name] = {};

					/* write file */
					var buffer = Xlsx.writeFile(wb, 'test.xlsx');

	        Users
					.findOne({
					  or : [
					    { email: email },
					    { username: username }
					  ]
					})
					.exec(function callback(err, user) {
		        if (err || !user)
		          return res.send(500, Error.alert(req, "Export Grades Error", "Fail to find user."));

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
							path = Path.resolve(__dirname, '../../assets/emails/export_grades.html');
						else
							path = Path.resolve(__dirname, '../../assets/emails/export_grades_en.html');

						FS.readFile(path, 'utf8', function (err, file) {
						  if (err)
			          return res.send(500, Error.alert(req, "Export Grades Error", "Fail to read email format file."));

							var today = new Date();
							var dd = today.getDate();
							var mm = today.getMonth()+1; //January is 0!
							var yyyy = today.getFullYear();

							if(dd<10) {
							    dd='0'+dd
							} 

							if(mm<10) {
							    mm='0'+mm
							} 

							today = yyyy+'/'+mm+'/'+dd;

			  			file = file.replace('#fullname', user.full_name);
			  			file = file.replace('#firstdate', Moment(course.createdAt).format("YYYY/MM/DD"));
			  			file = file.replace('#lastdate', today);

							// setup e-mail data with unicode symbols
							var mailOptions = {
							    from: "Bttendance<no-reply@bttendance.com>", // sender address
							    to: user.email, // list of receivers
							    subject: sails.__({ phrase: "Grade of %s", locale: locale }, course.name), // Subject line
							    html: file,
							    attachments: [
								    {   
								    	// binary buffer as an attachment
						          filename: course.name + " Grade " + today + ".xlsx",
						          content: buffer
						        }
							    ]
							}

							// send mail with defined transport object
							smtpTransport.sendMail(mailOptions, function(error, info) {
							    if(error)
									  return res.send(500, Error.alert(req, "Sending Email Error", "Oh uh, error occurred. Please try it again."));
					        return res.send(Email.json(user.email));
							});
						});
	        });
	  		});
      });
    });
	}

};
