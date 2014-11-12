/**
 * CommentsController
 *
 * @description :: Server-side logic for managing comments
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var Error = require('../utils/errors');
var Arrays = require('../utils/arrays');

module.exports = {

	curious: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var curious_id = req.param('curious_id');

		Curiouses
		.findOneById(curious_id)
		.populate('comments')
		.exec(function callback(err, curious) {
			if (err || !curious)
				return res.send(500, Error.log(req, "Get Comments Error", "Curious doesn't exist."));

  		Comments
  		.findById(Arrays.getIds(curious.comments))
			.sort('id DESC')
  		.populateAll()
  		.exec(function callback(err, comments) {
  			if (err || !comments)
					return res.send(500, Error.log(req, "Get Comments Error", "Comment doesn't exist."));

				for (var i = 0; i < comments.length; i++)
  				comments[i] = comments[i].toWholeObject();

		  	return res.send(comments);
  		});
		});
	},

	create: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var email = req.param('email');
		var message = req.param('message');
		var post_id = req.param('post_id');

		Users
		.findOneByEmail(email)
		.exec(function callback(err, user) {
			if (err || !user)
				return res.send(500, Error.log(req, "Comment Create Error", "User doesn't exist."));

			Comments
			.create({
				author: user.id,
				message: message,
				post: post_id
			}).exec(function callback(err, comment) {
				if (err || !comment)
					return res.send(500, Error.alert(req, "Comment Create Error", "Fail to create comment."));

				Comments
				.findOneById(comment.id)
				.populateAll()
				.exec(function callback(err, comment) {
					if (err || !comment)
						return res.send(500, Error.log(req, "Comment Create Error", "Fail to find comment."));

					return res.send(comment.toWholeObject());
				});
			});
		});
	},

	edit: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var message = req.param('message');
		var comment_id = req.param('comment_id');

		Comments
		.findOneById(comment_id)
		.populateAll()
		.exec(function callback(err, comment) {
			if (err || !comment)
				return res.send(500, Error.log(req, "Comment Update Error", "Fail to find comment."));

			comment.message = message;
			comment.save(function callback(err) {
				if (err)
					return res.send(500, Error.alert(req, "Comment Update Error", "Fail to update comment."));

				return res.send(comment.toWholeObject());
			});
		});
	},

	remove: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var message = req.param('message');
		var comment_id = req.param('comment_id');

		Comments
		.findOneById(comment_id)
		.populateAll()
		.exec(function callback(err, comment) {
			if (err || !comment)
				return res.send(500, Error.log(req, "Comment Update Error", "Fail to find comment."));

			comment.post = null;
			comment.save(function callback(err) {
				if (err)
					return res.send(500, Error.alert(req, "Comment Update Error", "Fail to delete comment."));

				return res.send(comment.toWholeObject());
			});
		});
	}

};

