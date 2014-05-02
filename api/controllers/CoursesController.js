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
var Xlsx = require('node-xlsx');
var Nodemailer = require("nodemailer");
var Moment = require('moment');
var Url = require('url');
var QueryString = require('querystring');
var Email = require('../utils/email');
var	FS = require('fs');
var Path = require('path');

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
		    return res.send(404, Error.log("User doesn't exitst."));

		  Schools
		  .findOneById(school_id)
		  .exec(function callback(err, school) {
				if (err || !school) 
			    return res.send(404, Error.log("School doesn't exitst."));

				Tokens.create({
					action: 'createCourse',
					params: query
				}).exec(function callback(err, token) {
					if (err || !token) 
				    return res.send(404, Error.log("Token creation has been failed."));

				  var link = 'http://' + Url.parse(req.baseUrl).hostname + "/verify/" + token.key;

					// create reusable transport method (opens pool of SMTP connections)
					var smtpTransport = Nodemailer.createTransport("SMTP",{
					    service: "Gmail",
					    auth: {
					        user: "no-reply@bttendance.com",
					        pass: "N0n0r2ply"
					    }
					});

					var path = Path.resolve(__dirname, '../../assets/emails/create_course.html');
					FS.readFile(path, 'utf8', function (err, file) {
					  if (err)
		  				return res.send(404, { message: "File Read Error" });

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
						smtpTransport.sendMail(mailOptions, function(error, response) {
					    if(error || !response || !response.message)
							  return res.send(500, Error.alert("Sending Email Error", "Oh uh, error occurred. Please try it again."));
			        return res.send(Email.json(user.email));
						});
					});
				});
		  });
		});
	},

	attend: function(req, res) {
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

		  var supervising_courses = Arrays.getIds(user.supervising_courses);
		  if (supervising_courses.indexOf(Number(course_id)) != -1)
		    return res.send(404, { message: "User is supervising this course" });

		  var attending_courses = Arrays.getIds(user.attending_courses);
		  if (attending_courses.indexOf(Number(course_id)) != -1)
		    return res.send(user.toWholeObject());

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

				  	return res.send(user_new.toWholeObject());
					});
				});
		  });
		});
	},

	dettend: function(req, res) {
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

		  var supervising_courses = Arrays.getIds(user.supervising_courses);
		  if (supervising_courses.indexOf(Number(course_id)) != -1)
		    return res.send(404, { message: "User is supervising this course" });

		  var attending_courses = Arrays.getIds(user.attending_courses);
		  if (attending_courses.indexOf(Number(course_id)) == -1)
		    return res.send(404, { message: "User is not attending this course" });

		  Courses.findOneById(course_id).exec(function callback(err, course) {
		  	if (err || !course)
		    	return res.send(404, { message: "No Course Found Error" });

				Courses.update({ id: course.id }, { students_count: course.students_count - 1 }).exec(function callback(err, updated_courses) {
					if (err || !updated_courses)
						return console.log(err);
				});

				user.attending_courses.remove(course_id);
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

				  	return res.send(user_new.toWholeObject());
					});
				});
		  });
		});
	},

	feed: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var username = req.param('username');
		var course_id = req.param('course_id');
		var page = req.param('page');

		Users
		.findOneByUsername(username)
		.populate('supervising_courses')
		.populate('attending_courses')
		.exec(function callback(err, user) {
			if (err || !user) 
		    return res.send(404, { message: "No User Found Error" });

	  	var supervising_courses = Arrays.getIds(user.supervising_courses);

			Courses
			.findOneById(course_id)
			.populate('posts')
			.populate('students')
			.exec(function callback(err, course) {
				if (err || !course)
	    		return res.send(404, { message: "Course Found Error" });

	  		Posts
	  		.findById(Arrays.getIds(course.posts))
				.populate('author')
				.populate('course')
				.populate('attendance')
				.populate('clicker')
	  		.sort('id DESC').done(function(err, posts) {
	  			if (err || !posts)
	  				return res.send(404, { message: "Post Found Error" });

					for (var i = 0; i < posts.length; i++) {

						var grade;
						var message;
						if (posts[i].type == 'attendance') {
							grade = Number(( (posts[i].attendance.checked_students.length - 1) / course.students.length * 100).toFixed());
		  				if (grade  < 0 || isNaN(grade)) grade = 0;
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

	students: function(req, res) {
    res.contentType('application/json; charset=utf-8');
    var course_id = req.param('course_id');
   
    Courses
    .findOneById(course_id)
    .populate('students')
    .exec(function callback(err, course) {
      if (err || !course)
        return res.send(404, { message: "Course Found Error" });

      Users
      .findById(Arrays.getIds(course.students))
			.populate('device')
			.populate('supervising_courses')
			.populate('attending_courses')
			.populate('employed_schools')
			.populate('serials')
			.populate('enrolled_schools')
			.populate('identifications')
      .sort('full_name DESC')
      .exec(function callback(err, users) {
        if (err || !users)
          return res.send(404, { message: "User Found Error" });

				for (var i = 0; i < users.length; i++)
					users[i] = users[i].toWholeObject();
		  	return res.send(users);
      });
    });
	},

	add_manager: function(req, res) {
    res.contentType('application/json; charset=utf-8');
    var course_id = req.param('course_id');
    var username = req.param('username');
    var manager = req.param('manager');

    Courses
    .findOneById(course_id)
		.populate('posts')
  	.populate('managers')
  	.populate('students')
  	.populate('school')
    .exec(function callback(err, course) {
      if (err || !course)
        return res.send(404, { message: "Course Found Error" });

      if (Arrays.getUsernames(course.managers).indexOf(username) == -1)
        return res.send(404, { message: "User is not supervising course error" });

      if (Arrays.getUsernames(course.students).indexOf(manager) >= 0)
      	return res.send(404, { message: "User is already attending current course"});

      if (Arrays.getUsernames(course.managers).indexOf(manager) >= 0)
        return res.send(course.toWholeObject());

      Users
      .findOneByUsername(manager)
      .exec(function callback(err, mang) {
        if (err || !mang)
          return res.send(404, { message: "User Found Error" });

	      course.managers.add(mang.id);
	      course.save(function callback(err) {
	      	if (err)
				    return res.send(500, { message: "Course Save Error" });
				  Courses
				  .findOneById(course.id)
					.populate('posts')
			  	.populate('managers')
			  	.populate('students')
			  	.populate('school')
			  	.exec(function callback(err, new_course) {
		        return res.send(new_course.toWholeObject());
				  });
	      })
      });
    });
	},

	grades: function(req, res) {
    res.contentType('application/json; charset=utf-8');
    var course_id = req.param('course_id');

    Courses
    .findOneById(course_id)
    .populate('students')
    .populate('posts')
    .exec(function callback(err, course) {
      if (err || !course)
        return res.send(404, { message: "Course Found Error" });

      Users
      .findById(Arrays.getIds(course.students))
  		.populate('identifications')
      .sort('full_name DESC')
      .exec(function callback(err, users) {
        if (err || !users)
          return res.send(404, { message: "User Found Error" });

	  		Posts
	  		.findById(Arrays.getIds(course.posts))
	  		.populate('attendance')
	  		.sort('id DESC')
	  		.exec(function callback(err, posts) {
	  			if (err || !posts)
	  				return res.send(404, { message: "Post Found Error" });

			  	var postsObject = new Array();
					for (var index in posts)
						if (posts[index].type == "attendance")
							postsObject.push(posts[index]);

					var total_grade = postsObject.length;
					console.log(postsObject);

	        var gradesObject = new Array();
	        for (var index in users) {
	        	var grade = 0;
	        	for (var i = 0; i < postsObject.length; i++) {
	        		for (var j = 0; j < postsObject[i].attendance.checked_students.length; j++) {
	        			if (postsObject[i].attendance.checked_students[j] == users[index].id)
	        				grade++;
	        		}
	        	}
	        	var gradeObject = new Object();
	        	gradeObject.id = users[index].id;
	        	gradeObject.full_name = users[index].full_name;
	        	for (var i = 0; i < users[index].identifications.length; i++) 
	        		if (users[index].identifications[i].school == course.school)
	        			gradeObject.student_id = users[index].identifications[i].identity;
	        	gradeObject.grade = grade + "/" + total_grade;
	          gradesObject.push(gradeObject);
	        }

	        gradesObject.sort(function(a, b) {
	        	if (!a.student_id)
	        		return true;
	        	if (!b.student_id)
	        		return false;
	        	return a.student_id.localeCompare(b.student_id);
	        });

	        var gradeJSON = JSON.stringify(gradesObject);
	        return res.send(gradeJSON);
	  		});
      });
    });
	},

	export_grades: function(req, res) {
    res.contentType('application/json; charset=utf-8');
    var username = req.param('username');
    var course_id = req.param('course_id');

    Courses
    .findOneById(course_id)
    .populate('students')
    .populate('posts')
    .exec(function callback(err, course) {
      if (err || !course)
        return res.send(404, { message: "Course Found Error" });

      Users
      .findById(Arrays.getIds(course.students))
  		.populate('identifications')
      .sort('full_name DESC')
      .exec(function callback(err, users) {
        if (err || !users)
          return res.send(400, Error.alert("Export Grades Error", "Current course has no student."));

	  		Posts
	  		.findById(Arrays.getIds(course.posts))
	  		.populate('attendance')
	  		.sort('id DESC')
	  		.exec(function callback(err, posts) {
	  			if (err || !posts)
	          return res.send(400, Error.alert("Export Grades Error", "Current course has no post."));

			  	var postsObject = new Array();
					for (var index in posts)
						if (posts[index].type == "attendance")
							postsObject.push(posts[index]);

					var total_grade = postsObject.length;

	        var data = new Array();

	        // Student Name, Student ID, username, date#1, date#2, ... , date#n, Total Grade
	        var headline = new Array();
	        headline.push("Students Name");
	        headline.push("Students ID");
	        headline.push("username");
	        for (var i = 0; i < postsObject.length; i++)
	        	headline.push(Moment(postsObject[i].createdAt).format("YYYY/MM/DD"));
	        headline.push("Total Grade");

	        data.push(headline);

	        var grades = new Array();
	        for (var index in users) {
	        	var gradeObject = new Array();
	        	gradeObject.push(users[index].full_name); // Student Name
	        	for (var i = 0; i < users[index].identifications.length; i++) 
	        		if (users[index].identifications[i].school == course.school)
	        			gradeObject.push(users[index].identifications[i].identity.trim()); // Student Id

	        	if (gradeObject.length < 2)
	        		gradeObject.push("Student has no ID");

	        	gradeObject.push(users[index].username); // Username

	        	var grade = 0;
	        	for (var i = 0; i < postsObject.length; i++) {
	        		var check = 0;
	        		for (var j = 0; j < postsObject[i].attendance.checked_students.length; j++) {
	        			if (postsObject[i].attendance.checked_students[j] == users[index].id) {
	        				grade++;
	        				check++;
	        			}
	        		}
	        		gradeObject.push(check);
	        	}

	        	gradeObject.push(grade + "/" + total_grade);
	          grades.push(gradeObject);
	        }

	        grades.sort(function(a, b) {
	        	if (!a[1])
	        		return true;
	        	if (!b[1])
	        		return false;
	        	return a[1].localeCompare(b[1]);
	        });

	        data = data.concat(grades);

	        var buffer = Xlsx.build({
        		worksheets: [
				  		{
				  			"name": course.name, 
				  			"data": data
				  		}
				  	]
					});

	        Users.findOneByUsername(username).exec(function callback(err, user) {
		        if (err || !user)
		          return res.send(404, { message: "User Found Error" });

						// create reusable transport method (opens pool of SMTP connections)
						var smtpTransport = Nodemailer.createTransport("SMTP",{
						    service: "Gmail",
						    auth: {
						        user: "no-reply@bttendance.com",
						        pass: "N0n0r2ply"
						    }
						});

						var path = Path.resolve(__dirname, '../../assets/emails/export_grades.html');
						FS.readFile(path, 'utf8', function (err, file) {
						  if (err)
			  				return res.send(404, { message: "File Read Error" });

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
							    subject: "Grade of " + course.name, // Subject line
							    html: file,
							    attachments: [
								    {   
								    	// binary buffer as an attachment
						          fileName: course.name + " Grade " + today + ".xlsx",
						          contents: buffer
						        }
							    ]
							}

							// send mail with defined transport object
							smtpTransport.sendMail(mailOptions, function(error, response) {
							    if(error || !response || !response.message)
									  return res.send(500, Error.alert("Sending Email Error", "Oh uh, error occurred. Please try it again."));
					        return res.send(Email.json(user.email));
							});
						});
	        });
	  		});
      });
    });
	}

};
