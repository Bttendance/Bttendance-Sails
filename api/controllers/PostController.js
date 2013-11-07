/**
 * PostController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

	destroy: function(req, res) {
		res.contentType('application/json');
		var id = req.param('id');

		Post.findOneById(id).done(function(err, post) {

			if (err) {
				console.log(err);
				return res.send(500, { error: "Post Find Error" });
			} 

			if (!post) {
				console.log('No Post Found (id : ' + id + ')');
				return res.send(404, { error: "No Post Found Error" });
			}

			post.destroy(function(err) {

				if (err) {
					console.log(err);
					return res.send(500, { error: "Post Destroy Error" });
				}

				console.log("Post has been destroyed (id : " + id + ')');
				var postJSON = JSON.stringify(post);
				res.send(postJSON);
				
			});
		});
	}

};
