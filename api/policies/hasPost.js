/**
 * Allow any authenticated user.
 */
module.exports = function hasPost (req, res, ok) {

	var username = req.param('username');
	var post_id = req.param('post_id');

	if (!username || !post_id) {
		console.log("haspost : Username and Password and post is required");
		return res.send(400, { error: "Username and Password and post is required"});
	}

	Post.findOne(post_id).done(function(err, post) {

		// Error handling
		if (err) {
	    console.log(err);
	    return res.send(500, { error: "Post Find Error" });

	  // No User found
	  } else if (!post) {
	    return res.send(404, { error: "No Post Found Error" });
	  } else {
    	console.log("Post found : " + post);
    	if (post.professor != 'username') {
	    	return res.send(401, { error: "This post doesn't belong to current professor Error" });
    	} else {
    		ok();
    	}
	  }
	});
};