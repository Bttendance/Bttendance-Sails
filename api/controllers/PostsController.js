/**
 * PostsController
 *
 * @module      :: Controller
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

	all: function(req, res) {
		res.contentType('application/json; charset=utf-8');

		Posts
		.find()
		.populate('author')
		.populate('course')
		.populate('attendance')
		.populate('clicker')
		.sort('id ASC')
		.exec(function callback(err, posts) {
			for (var i = 0; i < posts.length; i++)
				posts[i] = posts[i].toWholeObject();
	  	return res.send(posts);
		});
	}
};
