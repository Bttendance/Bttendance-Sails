/**
 * SocketsController
 *
 * @description :: Server-side logic for managing sockets
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	connect: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var email = req.param('email');

		console.log('Socket Connect Called : ' + email);

    Clickers.unwatch(req.socket);
    Attendances.unwatch(req.socket);
    Notices.unwatch(req.socket);

		Users
		.findOneByEmail(email)
		.populateAll()
		.exec(function callback(err, user) {
			if (err || !user)
				return res.send(500, Error.log(req, "Socket Connect Error", "User Find Error"));

			for (var i = 0; i < user.supervising_courses; i++)
		    sails.sockets.join(req.socket, 'Course#' + user.supervising_courses[i].id);

			for (var i = 0; i < user.attending_courses; i++)
		    sails.sockets.join(req.socket, 'Course#' + user.attending_courses[i].id);
		  
	  	return res.send(user_new.toWholeObject());
		});
	}
	
};

