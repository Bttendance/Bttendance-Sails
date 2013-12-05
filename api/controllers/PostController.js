/**
 * PostController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

	attendance_start: function(req, res) {
		res.contentType('application/json');
		var username = req.param('username');
		var course_id = req.param('course_id');

		User.findOne({
			username: username
		}).done(function(err, user) {
			if (!err && user) {
				Post.create({
				  author: user.id,
				  author_name: user.full_name,
				  course: course_id,
				  type: 'attendance'
				}).done(function(err, post) {
				  // Error handling
				  if (err) {
				  	console.log(err);
		    		return res.send(404, { message: "Post Create Error" });
				  // The User was created successfully!
				  } else {
						var postJSON = JSON.stringify(post);
				  	return res.send(postJSON);
				  }
				});
			} else
    		return res.send(404, { message: "No User Found Error" });
		});

	},

	attendance_check: function(req, res) {
		res.contentType('application/json');
		var username = req.param('username');
		var course_id = req.param('course_id');

		User.findOne({
			username: username
		}).done(function(err, user) {
			if (!err && user) {
				Post.create({
				  author: user.id,
				  author_name: user.full_name,
				  course: course_id,
				  type: 'attendance'
				}).done(function(err, post) {
				  // Error handling
				  if (err) {
				  	console.log(err);
		    		return res.send(404, { message: "Post Create Error" });
				  // The User was created successfully!
				  } else {
						var postJSON = JSON.stringify(post);
				  	return res.send(postJSON);
				  }
				});
			} else
    		return res.send(404, { message: "No User Found Error" });
		});

	},

	student_list: function(req, res) {
		res.contentType('application/json');
		var post_id = req.param('post_id');

		Post.findOne(Number(post_id)).done(function(err, post) {
			if (!err && post) {
				Course.findOne(post.course).done(function(err, course) {
					if (!err && course) {
				  	var studentsObject = new Array();
			  		User.find({
			  			where: {
			  				or: getConditionFromIDs(course.students)
			  			}
			  		}).sort('id DESC').done(function(err, students) {
			  			if (!err && students) {
			  				for (var index in students) {
			  					var student = students[index];
			  					if (post.checks.indexOf(student.id) == -1)
			  						student["check"] = false;
			  					else
			  						student["check"] = true;
			  					studentsObject.push(students[index]);
			  				}
								var studentsJSON = JSON.stringify(studentsObject);
						  	return res.send(studentsJSON);
			  			} else
				    		return res.send(404, { message: "No Studnet Found Error" });
			  		});
					} else
						return res.send(404, { message: "No Course Found Error" });
				});
			} else 
				return res.send(404, { message: "No Post Found Error" });
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
