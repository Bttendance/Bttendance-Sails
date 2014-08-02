/**
 * SocketsController
 *
 * @description :: Server-side logic for managing sockets
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	connect: function(req, res) {
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

			for (var i = 0; i < user.supervising_courses.length; i++) {
		    sails.sockets.join(req.socket, 'Course#' + user.supervising_courses[i].id);
		    console.log(sails.sockets.subscribers('Course#' + user.supervising_courses[i].id));
			}

			for (var i = 0; i < user.attending_courses.length; i++) {
		    sails.sockets.join(req.socket, 'Course#' + user.attending_courses[i].id);
		    console.log(sails.sockets.subscribers('Course#' + user.attending_courses[i].id));
			}
		  
	  	return res.ok();
		});
	}
	
};

