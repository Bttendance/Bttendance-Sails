/**
 * CourseController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {
  
	feed: function(req, res) {
		res.contentType('application/json');
		var course_id = req.param('course_id');
		var page = req.param('page');
		
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
		    		return res.send(404, { message: "No Post Found Error" });
	  		});

			} else
    		return res.send(404, { message: "No Course Found Error" });
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
