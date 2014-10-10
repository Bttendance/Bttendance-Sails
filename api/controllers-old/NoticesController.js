/**
 * NoticeController
 *
 * @description :: Server-side logic for managing notices
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var Error = require('../utils/errors');
var Arrays = require('../utils/arrays');

module.exports = {
	
	seen: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var email = req.param('email');
		var notice_id = req.param('notice_id');

		User
		.findOneByEmail(email)
		.exec(function callback(err, user) {
			if (err || !user)
  			return res.send(500, Error.log(req, "Notice Seen Error", "Fail to find user."));

			Notice
			.findOneById(notice_id)
			.populateAll()
			.exec(function callback(err, notice) {
				if (err || !notice)
	  			return res.send(500, Error.log(req, "Notice Seen Error", "Fail to find notice."));

	  		if (notice.seen_students.indexOf(user.id) != -1)
				  return res.send(notice.toWholeObject());

				notice.seen_students.push(user.id);
				notice.save();
			  return res.send(notice.toWholeObject());
			});
		});
	}

};

