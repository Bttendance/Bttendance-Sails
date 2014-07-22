/**
 * ClickersController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var Error = require('../utils/errors');
var Serialize = require('node-serialize');

module.exports = {

	click: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var email = req.param('email');
		var username = req.param('username');
		var clicker_id = req.param('clicker_id');
		var choice_number = req.param('choice_number');

		Users
		.findOne({
		  or : [
		    { email: email },
		    { username: username }
		  ]
		})
		.exec(function callback(err, user) { 
			if (err || !user)
		    return res.send(500, Error.log(req, "User doesn't exitst."));

		  Clickers
		  .findOneById(clicker_id)
		  .populateAll()
		  .exec(function callback(err, clicker) {
		  	if (err || !clicker)
			    return res.send(500, Error.log(req, "Clicker doesn't exitst."));

		  	if (choice_number > clicker.choice_count)
			    return res.send(500, Error.log(req, "Clicker choice is out of bound."));

			  if (clicker.a_students.indexOf(user.id) != -1)
			    return res.send(500, Error.toast(req, "You've already chosen A as a choice."));
			  if (clicker.b_students.indexOf(user.id) != -1)
			    return res.send(500, Error.toast(req, "You've already chosen B as a choice."));
			  if (clicker.c_students.indexOf(user.id) != -1)
			    return res.send(500, Error.toast(req, "You've already chosen C as a choice."));
			  if (clicker.d_students.indexOf(user.id) != -1)
			    return res.send(500, Error.toast(req, "You've already chosen D as a choice."));
			  if (clicker.e_students.indexOf(user.id) != -1)
			    return res.send(500, Error.toast(req, "You've already chosen E as a choice."));

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

			  return res.send(clicker.toWholeObject());
		  });
		});
	}
	
};
