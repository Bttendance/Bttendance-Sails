/**
 * Allow any authenticated user.
 */
module.exports = function hasPost (req, res, ok) {

	var username = req.param('username');
	var post_id = req.param('post_id');

	if (!username || !post_id) {
		console.log("haspost : Username and post is required");
		return res.send(400, { message: "Username and post is required"});
	}

	Post.findOne(post_id).done(function(err, post) {

		// Error handling
		if (err) {
	    console.log(err);
	    return res.send(500, { message: "Post Find Error" });

	  // No User found
	  } else if (!post) {
	    return res.send(404, { message: "No Post Found Error" });
	  } else {
    	console.log("Post found : " + post);
    	Course.findOne(post.course).done(function(err, course) {
    		if (!err && course) {
    			User.findOne({
    				username : username
    			}).done(function(err, user) {
		    		if (!err && user) {
		    			if (course.students.indexOf(user.id) == -1 || course.)
						} else 
	    				return res.send(404, { message: "No User Found Error" });
    			});
    		} else 
	    		return res.send(404, { message: "No Course Found Error" });
    	});
	  }
	});
};