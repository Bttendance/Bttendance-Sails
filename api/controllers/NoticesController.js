/**
 * NoticesController
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

		Users
		.findOneByEmail(email)
		.exec(function callback(err, user) {
			if (err || !user)
  			return res.send(500, Error.log(req, "Notice Seen Error", "Fail to find user."));

			Notices
			.findOneById(notice_id)
			.populateAll()
			.exec(function callback(err, notice) {
				if (err || !notice)
	  			return res.send(500, Error.log(req, "Notice Seen Error", "Fail to find notice."));

			  var seen_students = Arrays.getIds(notice.seen_students);
			  if (seen_students.indexOf(Number(notice_id)) != -1)
			    return res.send(notice.toWholeObject());

				var seen_students = new Array();
				var has_user = false;
				for (var i = 0; i < notice.seen_students.length; i++) {
					var id = notice.seen_students[i];
					seen_students.push(id);
					if (id == user.id)
						has_user = true;
					seen_students.push(id);
				}

				if (!has_user) {
					notice.seen_students = seen_students;
					notice.save(function callback(err) {
						if (err)
			  			return res.send(500, Error.log(req, "Notice Seen Error", "Updating notice record has been failed."));

				    Notices
						.findOneById(notice_id)
						.populateAll()
						.exec(function callback(err, notice_new) {
							if (err || !notice_new)
				  			return res.send(500, Error.log(req, "Notice Seen Error", "Fail to find updated notice record."));

					  	return res.send(notice_new.toWholeObject());
						});
					});
				} else {
			  	return res.send(notice.toWholeObject());
				}
			});
		});
	}

};

