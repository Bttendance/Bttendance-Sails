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

module.exports = {

	create: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var username = req.param('username');
		var name = req.param('name');
		var number = req.param('number');
		var school_id = req.param('school_id');
		var professor_name = req.param('professor_name');

		Courses.create({
			name: name,
			number: number,
			school: school_id,
			professor_name: professor_name
		}).exec(function callback(err, course) {
			if (err || !course) 
				return res.send(500, {message: "Course create Error"});

			Users.findOneByUsername(username).exec(function callback(err, user) {
				if (err || !user) 
			    return res.send(404, { message: "No User Found Error" });

				user.supervising_courses.add(course.id);

				user.save(function callback(err) {
					if (err) 
				    return res.send(500, { message: "User Save Error" });
				  
				  Courses
				  .findOneById(course.id)
					.populate('posts')
			  	.populate('managers')
			  	.populate('students')
			  	.populate('school')
			  	.exec(function callback(err, new_course) {
		        return res.send(new_course.toWholeObject());
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

		  var supervising_courses = getIds(user.supervising_courses);
		  if (supervising_courses.indexOf(Number(course_id)) != -1)
		    return res.send(404, { message: "User is supervising this course" });

		  var attending_courses = getIds(user.attending_courses);
		  if (attending_courses.indexOf(Number(course_id)) != -1)
		    return res.send(user.toWholeObject());

		  Courses.findOneById(course_id).exec(function callback(err, course) {
		  	if (err || !course)
		    	return res.send(404, { message: "No Course Found Error" });

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

	  	var supervising_courses = getIds(user.supervising_courses);

			Courses
			.findOneById(course_id)
			.populate('posts')
			.populate('students')
			.exec(function callback(err, course) {
				if (err || !course)
	    		return res.send(404, { message: "Course Found Error" });

	  		Posts
	  		.findById(getIds(course.posts))
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
      .findById(getIds(course.students))
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

      if (getUsernames(course.managers).indexOf(username) == -1)
        return res.send(404, { message: "User is not supervising course error" });

      if (getUsernames(course.students).indexOf(manager) >= 0)
      	return res.send(404, { message: "User is already attending current course"});

      if (getUsernames(course.managers).indexOf(manager) >= 0)
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
      .findById(getIds(course.students))
  		.populate('identifications')
      .sort('full_name DESC')
      .exec(function callback(err, users) {
        if (err || !users)
          return res.send(404, { message: "User Found Error" });

	  		Posts
	  		.findById(getIds(course.posts))
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
	        	gradeObject.grade = "" + grade + "/" + total_grade;
	          gradesObject.push(gradeObject);
	        }

	        var gradeJSON = JSON.stringify(gradesObject);
	        return res.send(gradeJSON);
	  		});
      });
    });
	},

};
