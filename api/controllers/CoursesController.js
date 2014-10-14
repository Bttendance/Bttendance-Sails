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
var Xlsx = require('node-xlsx');
var Nodemailer = require("nodemailer");
var Moment = require('moment');
var Url = require('url');
var QueryString = require('querystring');
var	FS = require('fs');
var Path = require('path');
var Random = require('../utils/random');

module.exports = {

	info: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var email = req.param('email');
		var username = req.param('username');
		var course_id = req.param('course_id');

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
				return res.send(500, Error.log(req, "Course Info Error", "User doesn't exist."));

  		Courses
  		.findOneById(course_id)
			.populateAll()
  		.sort('id ASC')
  		.exec(function callback(err, course) {
  			if (err || !course)
					return res.send(500, Error.log(req, "Course Info Error", "Course doesn't exist."));

	    	Posts
	  		.findById(Arrays.getIds(course.posts))
				.populateAll()
	  		.sort('id DESC')
	  		.exec(function callback(err, posts) {
	  			if (err || !posts) {
							course = course.toWholeObject();
							course.grade = 0;
							course.attendance_rate = 0;
							course.clicker_rate = 0;
							course.notice_unseen = 0;
				  	return res.send(course);
	  			}

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
						if (posts[j].type == "attendance") {
							if (posts[j].attendance.checked_students.indexOf(user.id) >= 0)
								attd_checked_count++;

							if (!attd_last)
								attd_last = posts[j].attendance;

							attd_checks = attd_checks.concat(posts[j].attendance.checked_students);
							attd_checks = attd_checks.concat(posts[j].attendance.late_students);

							attd_usage++;
						}

						// Clicker Count
						if (posts[j].type == "clicker") {
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
						if (posts[j].type == "notice") {
							if (posts[j].notice.seen_students.indexOf(user.id) >= 0)
								notice_seen_count++;

							if (!notice_last)
								notice_last = posts[j].notice;

							notice_usage++;
						}
					}

  				if (Arrays.getIds(user.supervising_courses).indexOf(course.id) >= 0) {
						attendance_rate = Number( ( attd_checks.length / attd_usage / course.students.length * 100).toFixed() );
						clicker_rate = Number( ( clicker_checks.length / clicker_usage / course.students.length * 100).toFixed() );
						if (notice_last)
							notice_unseen = course.students.length - notice_last.seen_students.length;
						else
							notice_unseen = course.students.length;
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

					course = course.toWholeObject();
					course.grade = attendance_rate;
					course.attendance_rate = attendance_rate;
					course.clicker_rate = clicker_rate;
					course.notice_unseen = notice_unseen;
					course.clicker_usage = clicker_usage;
					course.notice_usage = notice_usage;
					if (attd_last)
  					course.attdCheckedAt = attd_last.createdAt;

			  	return res.send(course);
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
		if (!locale || locale != 'ko')
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
									path = Path.resolve(__dirname, '../../assets/emails/CreateCourse_KO.html');
									guide = Path.resolve(__dirname, '../../assets/manual/manual_prof_ko.pdf');
								} else {
									path = Path.resolve(__dirname, '../../assets/emails/CreateCourse_EN.html');
									guide = Path.resolve(__dirname, '../../assets/manual/manual_prof_en.pdf');
								}

								FS.readFile(path, 'utf8', function (err, file) {
								  if (err)
					  				return res.send(500, { message: "File Read Error" });

					  			file = file.replace('#fullname', user_new.full_name);
					  			file = file.replace('#schoolname', course.school.name);
					  			file = file.replace('#courseTitle', course.name);
					  			file = file.replace('#classCode', course.code);
					  			file = file.replace('#profname', course.professor_name);
					  			file = file.replace('#schoolname', course.school.name);

									// setup e-mail data with unicode symbols
									var mailOptions = {
									    from: "Bttendance<no-reply@bttendance.com>", // sender address
									    to: user.email, // list of receivers
									    subject: sails.__({ phrase: "Course %s Creation Finished", locale: locale }, course.name), // Subject line
									    html: file, // plaintext body
									    attachments: [{   // file on disk as an attachment
		            				filename: sails.__({ phrase: "Bttendance Manual (for Prof).pdf", locale: locale }),
		            				path: guide // stream this file
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
		var locale = req.param('locale');
		if (!locale || locale != 'ko')
			locale = 'en';

		Courses
		.findOneById(course_id)
		.populateAll()
		.exec(function callback(err, course) {
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
				user.save(function callback(err, saved_user) {
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
							path = Path.resolve(__dirname, '../../assets/emails/AttendCourse_KO.html');
							guide = Path.resolve(__dirname, '../../assets/manual/manual_std_ko.pdf');
						} else {
							path = Path.resolve(__dirname, '../../assets/emails/AttendCourse_EN.html');
							guide = Path.resolve(__dirname, '../../assets/manual/manual_std_en.pdf');
						}

						FS.readFile(path, 'utf8', function (err, file) {
						  if (err)
			  				return res.send(500, { message: "File Read Error" });

			  			var studentID = '';
			  			for (var i = 0; i < user.identifications.length; i++)
			  				if (user.identifications[i].school == course.school.id)
			  					studentID = user.identifications[i].identity;

			  			file = file.replace('#fullname', user_new.full_name);
			  			file = file.replace('#courseTitle', course.name);
			  			file = file.replace('#courseTitle', course.name);
			  			file = file.replace('#classCode', course.code);
			  			file = file.replace('#profName', course.professor_name);
			  			file = file.replace('#schoolName', course.school.name);
			  			file = file.replace('#schoolName', course.school.name);
			  			file = file.replace('#studentID', studentID);

							// setup e-mail data with unicode symbols
							var mailOptions = {
							    from: "Bttendance<no-reply@bttendance.com>", // sender address
							    to: user.email, // list of receivers
							    subject: sails.__({ phrase: "You are successfully registered in course %s!", locale: locale }, course.name), // Subject line
							    html: file, // plaintext body
							    attachments: [{   // file on disk as an attachment
            				filename: sails.__({ phrase: "Bttendance Manual (for Std).pdf", locale: locale }),
            				path: guide // stream this file
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
							if (!locale || locale != 'ko')
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
	        users[index].student_id = "";
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

	      if (Arrays.getUsernames(course.managers).indexOf(manager) >= 0 || Arrays.getEmails(course.managers).indexOf(manager) >= 0)
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

			    Courses
			    .findOneById(course_id)
			    .populateAll()
			    .exec(function callback(err, course) {
			      if (err || !course)
			        return res.send(500, Error.alert(req, "Adding Manager Error", "Course doesn't exist."));

		        return res.send(course.toWholeObject());
			    });
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
	        	users[index].grade = grade + "/" + total_grade;
	        	
		        users[index].student_id = "";
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
	        	users[index].grade = grade + "/" + total_grade;
	        
		        users[index].student_id = "";
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
    });
	},

	export_grades: function(req, res) {
    res.contentType('application/json; charset=utf-8');
    var email = req.param('email');
    var username = req.param('username');
    var course_id = req.param('course_id');
		var locale = req.param('locale');
		if (!locale || locale != 'ko')
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

	        var data_clicker = new Array();
	        {
				  	var postsObject = new Array();
						for (var index in posts)
							if (posts[index].type == "clicker")
								postsObject.push(posts[index]);

		        // empty, empty, empty, message#1, message#2, ... , message#n
		        var message = new Array();
		        message.push(sails.__({ phrase: "Clicker Message", locale: locale })); // empty
		        message.push(""); // empty
		        message.push(""); // empty
		        for (var i = 0; i < postsObject.length; i++)
			        	message.push(postsObject[i].message);
		        data_clicker.push(message);

		        // empty, empty, empty, choice_count#1, choice_count#2, ... , choice_count#n
		        var choice_count = new Array();
		        choice_count.push(sails.__({ phrase: "Choice Count", locale: locale })); // empty
		        choice_count.push(""); // empty
		        choice_count.push(""); // empty
		        for (var i = 0; i < postsObject.length; i++)
			        	choice_count.push(sails.__({ phrase: "%s Choice", locale: locale }, postsObject[i].clicker.choice_count));
		        data_clicker.push(choice_count);

		        // Student Name, Student Identity, empty, date#1, date#2, ... , date#n
		        var headline = new Array();
		        headline.push(sails.__({ phrase: "Student Name", locale: locale }));
		        headline.push(sails.__({ phrase: "Student Identity", locale: locale }));
		        headline.push(""); // empty
		        for (var i = 0; i < postsObject.length; i++)
		        	headline.push(Moment(postsObject[i].createdAt).format("YYYY-MM-DD hh:mm"));
		        data_clicker.push(headline);

		        var grades = new Array();
		        for (var index in users) {
		        	var gradeObject = new Array();
		        	gradeObject.push(users[index].full_name); // Student Name
		        	for (var i = 0; i < users[index].identifications.length; i++) 
		        		if (users[index].identifications[i].school == course.school.id 
		        			&& users[index].identifications[i].identity 
		        			&& users[index].identifications[i].identity != null)
		        			gradeObject.push(users[index].identifications[i].identity.trim()); // Student Id

		        	if (gradeObject.length < 2)
		        		gradeObject.push("Student has no ID");
		        	gradeObject.push(""); // empty

		        	for (var i = 0; i < postsObject.length; i++) {

		        		var choice = 0;

		        		for (var j = 0; j < postsObject[i].clicker.a_students.length; j++)
		        			if (postsObject[i].clicker.a_students[j] == users[index].id)
		        				choice = 1;

		        		for (var j = 0; j < postsObject[i].clicker.b_students.length; j++)
		        			if (postsObject[i].clicker.b_students[j] == users[index].id)
		        				choice = 2;

		        		for (var j = 0; j < postsObject[i].clicker.c_students.length; j++)
		        			if (postsObject[i].clicker.c_students[j] == users[index].id)
		        				choice = 3;

		        		for (var j = 0; j < postsObject[i].clicker.d_students.length; j++)
		        			if (postsObject[i].clicker.d_students[j] == users[index].id)
		        				choice = 4;

		        		for (var j = 0; j < postsObject[i].clicker.e_students.length; j++)
		        			if (postsObject[i].clicker.e_students[j] == users[index].id)
		        				choice = 5;

		        		if (choice == 0)
			        		gradeObject.push(sails.__({ phrase: "Didn't Participated", locale: locale }));
			        	else if (choice == 1)
			        		gradeObject.push("A");
			        	else if (choice == 2)
			        		gradeObject.push("B");
			        	else if (choice == 3)
			        		gradeObject.push("C");
			        	else if (choice == 4)
			        		gradeObject.push("D");
			        	else
			        		gradeObject.push("E");
		        	}

		          grades.push(gradeObject);
		        }

		        grades.sort(function(a, b) {
		        	if (!a[1])
		        		return true;
		        	if (!b[1])
		        		return false;
		        	return a[1].localeCompare(b[1]);
		        });

		        data_clicker = data_clicker.concat(grades);
		      }

	        var data_attendance = new Array();
	        {
				  	var postsObject = new Array();
						for (var index in posts)
							if (posts[index].type == "attendance")
								postsObject.push(posts[index]);

		        // empty, empty, empty, type#1, type#2, ... , type#n
		        var info = new Array();
		        info.push(sails.__({ phrase: "Attendance Type", locale: locale })); // empty
		        info.push(""); // empty
		        info.push(""); // empty
		        for (var i = 0; i < postsObject.length; i++)
		        	if (postsObject[i].attendance.type == "auto")
			        	info.push(sails.__({ phrase: "Auto Check", locale: locale }));
			        else
			        	info.push(sails.__({ phrase: "Manual Check", locale: locale }));
		        data_attendance.push(info);

		        // Student Name, Student Identity, empty, date#1, date#2, ... , date#n, empty, Present, Tardy, Absent
		        var headline = new Array();
		        headline.push(sails.__({ phrase: "Student Name", locale: locale }));
		        headline.push(sails.__({ phrase: "Student Identity", locale: locale }));
		        headline.push(""); // empty
		        for (var i = 0; i < postsObject.length; i++)
		        	headline.push(Moment(postsObject[i].createdAt).format("YYYY-MM-DD hh:mm"));
		        headline.push("");
		        headline.push(sails.__({ phrase: "Present", locale: locale }));
		        headline.push(sails.__({ phrase: "Tardy", locale: locale }));
		        headline.push(sails.__({ phrase: "Absent", locale: locale }));
		        data_attendance.push(headline);

		        var grades = new Array();
		        for (var index in users) {
		        	var gradeObject = new Array();
		        	gradeObject.push(users[index].full_name); // Student Name
		        	for (var i = 0; i < users[index].identifications.length; i++) 
		        		if (users[index].identifications[i].school == course.school.id
		        			&& users[index].identifications[i].identity
		        			&& users[index].identifications[i].identity != null)
		        			gradeObject.push(users[index].identifications[i].identity.trim()); // Student Id

		        	if (gradeObject.length < 2)
		        		gradeObject.push("Student has no ID");
		        	gradeObject.push(""); // empty

		        	var present = 0;
		        	var tardy = 0;
		        	var absent = 0;
		        	for (var i = 0; i < postsObject.length; i++) {

		        		var check = 0;

		        		for (var j = 0; j < postsObject[i].attendance.checked_students.length; j++) {
		        			if (postsObject[i].attendance.checked_students[j] == users[index].id) {
		        				present++;
		        				check = 1;
		        			}
		        		}

		        		for (var j = 0; j < postsObject[i].attendance.late_students.length; j++) {
		        			if (postsObject[i].attendance.late_students[j] == users[index].id) {
		        				tardy++;
		        				check = 2;
		        			}
		        		}

		        		if (check == 0) {
			        		gradeObject.push(sails.__({ phrase: "Absent", locale: locale }));
			        		absent++;
		        		} else if (check == 1)
			        		gradeObject.push(sails.__({ phrase: "Present", locale: locale }));
			        	else
			        		gradeObject.push(sails.__({ phrase: "Tardy", locale: locale }));
		        	}

		        	gradeObject.push(""); // empty
		        	gradeObject.push(present); // Present
		        	gradeObject.push(tardy); // Tardy
		        	gradeObject.push(absent); // Absent
		          grades.push(gradeObject);
		        }

		        grades.sort(function(a, b) {
		        	if (!a[1])
		        		return true;
		        	if (!b[1])
		        		return false;
		        	return a[1].localeCompare(b[1]);
		        });

		        data_attendance = data_attendance.concat(grades);
		      }

	        var data_notice = new Array();
	        {
				  	var postsObject = new Array();
						for (var index in posts)
							if (posts[index].type == "notice")
								postsObject.push(posts[index]);

		        // empty, empty, empty, type#1, type#2, ... , type#n
		        var info = new Array();
		        info.push(sails.__({ phrase: "Notice Message", locale: locale })); // empty
		        info.push(""); // empty
		        info.push(""); // empty
		        for (var i = 0; i < postsObject.length; i++)
		        	info.push(postsObject[i].message);
		        data_notice.push(info);

		        // Student Name, Student Identity, empty, date#1, date#2, ... , date#n, empty, Read, Unread
		        var headline = new Array();
		        headline.push(sails.__({ phrase: "Student Name", locale: locale }));
		        headline.push(sails.__({ phrase: "Student Identity", locale: locale }));
		        headline.push(""); // empty
		        for (var i = 0; i < postsObject.length; i++)
		        	headline.push(Moment(postsObject[i].createdAt).format("YYYY-MM-DD hh:mm"));
		        headline.push("");
		        headline.push(sails.__({ phrase: "Read", locale: locale }));
		        headline.push(sails.__({ phrase: "Unread", locale: locale }));
		        data_notice.push(headline);

		        var grades = new Array();
		        for (var index in users) {
		        	var gradeObject = new Array();
		        	gradeObject.push(users[index].full_name); // Student Name
		        	for (var i = 0; i < users[index].identifications.length; i++) 
		        		if (users[index].identifications[i].school == course.school.id
		        			&& users[index].identifications[i].identity
		        			&& users[index].identifications[i].identity != null)
		        			gradeObject.push(users[index].identifications[i].identity.trim()); // Student Id

		        	if (gradeObject.length < 2)
		        		gradeObject.push("Student has no ID");
		        	gradeObject.push(""); // empty

		        	var read = 0;
		        	var unread = 0;
		        	for (var i = 0; i < postsObject.length; i++) {

		        		var seen = false;
		        		for (var j = 0; j < postsObject[i].notice.seen_students.length; j++)
		        			if (postsObject[i].notice.seen_students[j] == users[index].id)
		        				seen = true;


		        		if (seen) {
			        		gradeObject.push(sails.__({ phrase: "Read", locale: locale }));
			        		read++;
		        		} else {
			        		gradeObject.push(sails.__({ phrase: "Unread", locale: locale }));
			        		unread++;
		        		}
		        	}

		        	gradeObject.push(""); // empty
		        	gradeObject.push(read); // Read
		        	gradeObject.push(unread); // Unread
		          grades.push(gradeObject);
		        }

		        grades.sort(function(a, b) {
		        	if (!a[1])
		        		return true;
		        	if (!b[1])
		        		return false;
		        	return a[1].localeCompare(b[1]);
		        });

		        data_notice = data_notice.concat(grades);
		      }

	        var buffer = Xlsx.build({
        		worksheets: [
				  		{
				  			"name": sails.__({ phrase: "Clicker", locale: locale }), 
				  			"data": data_clicker
				  		},
				  		{
				  			"name": sails.__({ phrase: "Attendance", locale: locale }), 
				  			"data": data_attendance
				  		},
				  		{
				  			"name": sails.__({ phrase: "Notice", locale: locale }), 
				  			"data": data_notice
				  		}
				  	]
					});

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
							path = Path.resolve(__dirname, '../../assets/emails/ExportGrades_KO.html');
						else
							path = Path.resolve(__dirname, '../../assets/emails/ExportGrades_EN.html');

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

							var todayDate = yyyy+'/'+mm+'/'+dd;
							var todayDate_ = yyyy+'_'+mm+'_'+dd;

			  			file = file.replace('#fullname', user.full_name);
			  			file = file.replace('#firstdate', Moment(course.createdAt).format("YYYY/MM/DD"));
			  			file = file.replace('#lastdate', todayDate);

			  			var filename = course.name + " Records " + todayDate_ + ".xlsx";

							// setup e-mail data with unicode symbols
							var mailOptions = {
							    from: "Bttendance<no-reply@bttendance.com>", // sender address
							    to: user.email, // list of receivers
							    subject: sails.__({ phrase: "Grade of %s", locale: locale }, course.name), // Subject line
							    html: file,
							    attachments: [{   
						          filename: filename,
						          content: buffer
					        }]
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
