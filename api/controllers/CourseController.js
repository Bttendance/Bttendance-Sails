/**
 * CourseController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

var MemJS = require('memjs').Client
var Moment = require('moment');
var Noti = require('../utils/notifications');

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
		        return res.send(new_course.toOldObject());
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
	  		.sort('id DESC').exec(function(err, posts) {
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

		  			if (post[i].type == 'clicker') {
		  				post[i].type = 'attendance';
		  				post[i].title = 'Update Required';
		  				post[i].message = 'Current version doesn\'t support clicker.';
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
					users[i] = users[i].toOldObject();
		  	return res.send(users);
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
        return res.send(course.toOldObject());

      Users
      .findOneByUsername(manager)
      .populate('device')
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
						Noti.send(mang, new_course.name, "You have been added as a manager.", "added_as_manager");
		        return res.send(new_course.toOldObject());
				  });
	      })
      });
    });
	},

	// remove: function(req, res) {
 //    res.contentType('application/json; charset=utf-8');
 //    var course_id = req.param('course_id');

	// 	Course.findOne(course_id).done(function(err, course) {
	// 		if (err || !course)
 //        return res.send(404, { message: "No Course Found Error" });

 //      School.findOne(course.school).done(function(err, school) {
	//     	for (var i = 0; i < school.courses.length; i++)
	//     		if (Number(course_id) == school.courses[i]) {
	//     			school.courses.splice(i, 1);
	//     			break;
	//     		}
	//     	school.save(function(err) {});
 //      });

 //      User.find()
 //      .where({ or: getConditionFromIDs(course.students) })
 //      .sort('full_name DESC')
 //      .done(function(err, users) {
 //        if (err || !users)
 //          return;

 //        for (var i = 0; i < users.length; i++) {
 //        	if (users[i].attending_courses.indexOf(Number(course_id)) != -1) {
	//         	users[i].attending_courses.splice(users[i].attending_courses.indexOf(Number(course_id)), 1);
	//         	users[i].save(function(err) {});
	//         }
 //        }
 //      });

 //      User.find()
 //      .where({ or: getConditionFromIDs(course.managers) })
 //      .sort('full_name DESC')
 //      .done(function(err, users) {
 //        if (err || !users)
 //          return;

 //        for (var i = 0; i < users.length; i++) {
 //        	if (users[i].supervising_courses.indexOf(Number(course_id)) != -1) {
	//         	users[i].supervising_courses.splice(users[i].supervising_courses.indexOf(Number(course_id)), 1);
	//         	users[i].save(function(err) {});
 //        	}
 //        }
 //      });

 //      //Course에 포함된 Post지우는게 없음!!!

 //      course.destroy(function(err) {});
	// 		var courseJSON = JSON.stringify(course);
	//   	return res.send(courseJSON);
	// 	})
	// }
};

var getIds = function(jsonArray) {
	if (!jsonArray)
		return new Array();

  var ids = new Array();
  for (var i = 0; i < jsonArray.length; i++)
  	ids.push(jsonArray[i].id);
	return ids;
}

var getUsernames = function(jsonArray) {
	if (!jsonArray)
		return new Array();

  var ids = new Array();
  for (var i = 0; i < jsonArray.length; i++)
  	ids.push(jsonArray[i].username);
	return ids;
}
