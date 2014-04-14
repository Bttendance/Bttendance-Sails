/**
 * SerialController
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

var nodemailer = require("nodemailer");

module.exports = {

	validate: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var serial = req.param('serial');

		Serials
		.findOneByKey(serial)
		.exec(function callback(err, serial) {
			if (err || !serial) 
	    	return res.send(404, { message: "Serial Found Error" });

			Schools
			.findOneById(serial.school)
			.populate('serials')
			.populate('courses')
			.populate('professors')
			.populate('students')
			.exec(function callback(err, school) {
				if (err || !school) 
	    		return res.send(404, { message: "No School Found Error" });

		  	return res.send(school.toOldObject());
			});
		});

	},

	request: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var email = req.param('email');
		var school_id = req.param('school_id');

		if (!email || email.indexOf("@") == -1)
	    	return res.send(404, { message: "No Email Sent Error" });

	  if (!school_id)
	  	school_id = 1;

		Serials.create({
		  school: school_id
		}).exec(function callback(err, serial) {

		  // Error handling
		  if (err || !serial)
	    	return res.send(404, { message: "No Serial Created Error" });

			// create reusable transport method (opens pool of SMTP connections)
			var smtpTransport = nodemailer.createTransport("SMTP",{
			    service: "Gmail",
			    auth: {
			        user: "no-reply@bttendance.com",
			        pass: "N0n0r2ply"
			    }
			});

			var text = "Dear " + email.split("@")[0] + ",\n\nThank you for registering with team Bttendance!\nYour serial code is following.\n\nSerial Code : " + serial.key + "\n\nNow you can create your personal course in the “Bttendance School”.\nUsing Bttendance for personal purpose is for free under the current pricing policy.\n\nYours sincerely,\nTeam Bttendance."

			// setup e-mail data with unicode symbols
			var mailOptions = {
			    from: "Bttendance<no-reply@bttendance.com>", // sender address
			    to: email, // list of receivers
			    subject: "Welcome to Bttendance", // Subject line
			    text: text, // plaintext body
			}

			// send mail with defined transport object
			smtpTransport.sendMail(mailOptions, function(error, response) {
			    if(error || !response || !response.message) {
			      console.log(error);
			      return;
			    }
					
					console.log("Message sent: " + response.message);
			});

	  	return res.send(serial);
		});
	}
  
};
