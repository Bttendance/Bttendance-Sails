/**
 * MigrationController
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

	migrate: function(req, res) {
		res.contentType('application/json');

		User.find().exec(function callback(err, users) {
			if (err || !users)
				return;

			for (var i = 0; i < users.length; i++) {
				Users.create({
					id: users[i].id,
					username: users[i].username,
					password: users[i].password,
					email: users[i].email,
					full_name: users[i].full_name,
					createdAt: users[i].createdAt,
					updatedAt: users[i].updatedAt					
				}).exec(function callback(err, user) {
					console.log(user);
				});
			}

			for (var i = 0; i < users.length; i++) {
				Devices.create({
					id: users[i].id,
					type: users[i].device_type,
					uuid: users[i].device_uuid,
					notification_key: users[i].notification_key,
					createdAt: users[i].createdAt,
					updatedAt: users[i].updatedAt
				}).exec(function callback(err, device) {
					console.log(device);
				});
			}
		});

		School.find().exec(function callback(err, schools) {
			if (err || !schools)
				return;

			for (var i = 0; i < schools.length; i++) {
				Schools.create({
					id: schools[i].id,
					name: schools[i].name,
					logo_image: schools[i].logo_image,
					type: schools[i].type,
					createdAt: schools[i].createdAt,
					updatedAt: schools[i].updatedAt
				}).exec(function callback(err, school) {
					console.log(school);
				});
			}
		});

		Serial.find().exec(function callback(err, serials) {
			if (err || !serials)
				return;

			for (var i = 0; i < serials.length; i++) {
				Serials.create({
					id: serials[i].id,
					key: serials[i].key,
					createdAt: serials[i].createdAt,
					updatedAt: serials[i].updatedAt
				}).exec(function callback(err, serial) {
					console.log(serial);
				});
			}
		})

		Course.find().exec(function callback(err, courses) {
			if (err || !courses)
				return;

			for (var i = 0; i < courses.length; i++) {
				Courses.create({
					id: courses[i].id,
					name: courses[i].name,
					professor_name: courses[i].professor_name,
					attdCheckedAt: courses[i].attdCheckedAt,
					createdAt: courses[i].createdAt,
					updatedAt: courses[i].updatedAt
				}).exec(function callback(err, course) {
					console.log(course);
				});
			}
		});

		Post.find().exec(function callback(err, posts) {
			if (err || !posts)
				return;

			for (var i = 0; i < posts.length; i++) {
				Posts.create({
					id: posts[i].id,
					type: posts[i].type,
					message: posts[i].message,
					checks: posts[i].checks,
					clusters: posts[i].clusters,
					createdAt: posts[i].createdAt,
					updatedAt: posts[i].updatedAt
				})
			}
		})
	},

	associate: function(req, res) {

		User.find().exec(function callback(err, users) {
			if (err || !users)
				return;

			for (var i = 0; i < users.length; i++) {
				Users.create({
					id: users[i].id,
					username: users[i].username,
					password: users[i].password,
					email: users[i].email,
					full_name: users[i].full_name
				}).exec(function callback(err, user) {
					console.log(user);
				});
			}

			for (var i = 0; i < users.length; i++) {
				Devices.create({
					id: users[i].id,
					type: users[i].device_type,
					uuid: users[i].device_uuid,
					notification_key: users[i].notification_key
				}).exec(function callback(err, device) {
					console.log(device);
				});
			}
		});
	}
  
};
