/**
 * ClickersController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var Error = require('../utils/errors');

module.exports = {

	click: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var username = req.param('username');
		var clicker_id = req.param('clicker_id');
		var choice_number = req.param('choice_number');

		Users
		.findOneByUsername(username)
		.exec(function callback(err, user) { 
			if (err || !user)
		    return res.send(404, Error.log("User doesn't exitst."));

		  Clickers
		  .findOneById(clicker_id)
		  .populate('post')
		  .exec(function callback(err, clicker) {
		  	if (err || !clicker)
			    return res.send(404, Error.log("Clicker doesn't exitst."));

		  	if (choice_number > clicker.choice_count)
			    return res.send(404, Error.log("Clicker choice is out of bound."));

			  if(choice_number == 1)
			  	clicker.a_students.push(user.id);
			  if(choice_number == 2)
			  	clicker.b_students.push(user.id);
			  if(choice_number == 3)
			  	clicker.c_students.push(user.id);
			  if(choice_number == 4)
			  	clicker.d_students.push(user.id);
			  if(choice_number == 5)
			  	clicker.e_students.push(user.id);

			  clicker.save();

			  Clickers.publishUpdate(clicker_id, { 
			  	a_students:clicker.a_students,  
			  	b_students:clicker.b_students,  
			  	c_students:clicker.c_students,  
			  	d_students:clicker.d_students,  
			  	e_students:clicker.e_students 
			  });

			  return res.send(clicker.toWholeObject());
		  });
		});
	},

	connect: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var username = req.param('username');
		var password = req.param('password');
		var socket_id = req.param('socket_id');
		var clicker_id = req.param('clicker_id');

		var socket = sails.io.sockets.sockets[socket_id];

		Clickers
		.findOneById(clicker_id)
		.exec(function callback(err, clicker){
      Clickers.subscribe(socket, clicker, ['update']);
	  	return res.send(clicker.toWholeObject());
    });
	}
	
};
