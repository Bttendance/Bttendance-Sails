/**
 * CourseController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {
  
	feed: function(req, res) {
		res.contentType('application/json');
		var username = req.param('username');
		var course_id = req.param('course_id');
		var page = req.param('page');
		
		User.findOne({
			username: username
		}).done(function(err, user) {
			// Error handling
			if (err) {
				console.log(err);
		    return res.send(500, { message: "User Find Error" });
		  // No User found
		  } else if (!user) {
		    return res.send(404, { message: "No User Found Error" });
		  // Found User!
		  } else {
	  		Course.findOne(Number(course_id)).done(function(err, course) {
	  			if (!err && course) {
				  	var postsObject = new Array();
			  		Post.find({
			  			where: {
			  				or: getConditionFromIDs(course.posts)
			  			}
			  		}).sort('id DESC').done(function(err, posts) {
			  			if (!err && posts) {
			  				for (var index in posts)
			  					postsObject.push(posts[index]);
								var postsJSON = JSON.stringify(postsObject);
						  	return res.send(postsJSON);
			  			} else
				    		return res.send(404, { message: "No Course Found Error" });
			  		});

	  			} else
		    		return res.send(404, { message: "No School Found Error" });
	  		});
		  }
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
