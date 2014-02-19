/**
 * CourseController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

var MemJS = require('memjs').Client

module.exports = {

	feed: function(req, res) {
		res.contentType('application/json');
		var course_id = req.param('course_id');
		var page = req.param('page');

		Course.findOne(Number(course_id)).done(function(err, course) {
			if (err || !course)
    		return res.send(404, { message: "No Course Found Error" });

  		Post.find({
  			where: {
  				or: getConditionFromIDs(course.posts)
  			}
  		}).sort('id DESC').done(function(err, posts) {
  			if (err || !posts)
  				return res.send(404, { message: "No Post Found Error" });

		  	var postsObject = new Array();
				for (var index in posts)
					postsObject.push(posts[index]);
				var postsJSON = JSON.stringify(postsObject);
		  	return res.send(postsJSON);

  		});
		});
	},

	students: function(req, res) {
    res.contentType('application/json');
    var course_id = req.param('course_id');
   
    Course.findOne(Number(course_id)).done(function(err, course) {
      if (err || !course)
        return res.send(404, { message: "No Course Found Error" });

      User.find({
        where: {
          or: getConditionFromIDs(course.students)
        }
      }).sort('full_name DESC').done(function(err, users) {
        if (err || !users)
          return res.send(404, { message: "No User Found Error" }); 

        var usersObject = new Array();
        for (var index in users)
          usersObject.push(users[index]);
        var usersJSON = JSON.stringify(usersObject);
        return res.send(usersJSON);
      });
    });
	},

	grades: function(req, res) {
    res.contentType('application/json');
    var course_id = req.param('course_id');

    Course.findOne(Number(course_id)).done(function(err, course) {
      if (err || !course)
        return res.send(404, { message: "No Course Found Error" });

      User.find()
      .where({ or: getConditionFromIDs(course.students) })
      .sort('full_name DESC')
      .done(function(err, users) {
        if (err || !users)
          return res.send(404, { message: "No User Found Error" });

	  		Post.find()
	  		.where({ or: getConditionFromIDs(course.posts) })
	  		.sort('id DESC')
	  		.done(function(err, posts) {
	  			if (err || !posts) {
	  				return res.send(404, { message: "No Post Found Error" });
	  			}

			  	var postsObject = new Array();
					for (var index in posts) {
						if (posts[index].type == "attendance")
							postsObject.push(posts[index]);
					}

					var total_grade = postsObject.length;

	        var gradesObject = new Array();
	        for (var index in users) {
	        	var grade = 0;
	        	for (var i = 0; i < postsObject.length; i++) {
	        		for (var j = 0; j < postsObject[i].checks.length; j++) {
	        			if (postsObject[i].checks[j] == users[index].id)
	        				grade++;
	        		}
	        	}
	        	var gradeObject = new Object();
	        	gradeObject.id = users[index].id;
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
    res.contentType('application/json');
    var course_id = req.param('course_id');
    var username = req.param('username');
    var manager = req.param('manager');

    Course.findOne(Number(course_id)).done(function(err, course) {
      if (err || !course)
        return res.send(404, { message: "No Course Found Error" });

      User.findOne({
      	username: username
      }).done(function(err, user) {
        if (err || !user)
          return res.send(404, { message: "No User Found Error" });

        if (user.supervising_courses.indexOf(course.id) == -1)
          return res.send(404, { message: "User is not supervising course error" });

	      User.findOne({
	      	username: manager
	      }).done(function(err, mang) {
	        if (err || !mang)
	          return res.send(404, { message: "No User Found Error" });

		      if (!mang.supervising_courses) mang.supervising_courses = new Array();
		      if (mang.supervising_courses.indexOf(course.id) == -1)
		        mang.supervising_courses.push(course.id);

		      if (course.managers.indexOf(mang.id) == -1)
		      	course.managers.push(mang.id);

		      mang.save(function(err) {
			      course.save(function(err) {
							var courseJSON = JSON.stringify(course);
					  	return res.send(courseJSON);
			      });
		      });
	      });
      });
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
	return returnArray;
}
