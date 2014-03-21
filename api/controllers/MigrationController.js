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

		User.find().exec(function callback(err, users) {
			if (err || !users)
				return;

			//done
			for (var i = 0; i < users.length; i++) {
				Users.create({
					id: users[i].id,
					username: users[i].username,
					password: users[i].password,
					email: users[i].email,
					full_name: users[i].full_name,
					profile_image : users[i].profile_image,
					createdAt: users[i].createdAt,
					updatedAt: users[i].updatedAt					
				}).exec(function callback(err, user) {
					console.log(user);
				});
			}

			//done
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

		//done
		School.find().exec(function callback(err, schools) {
			if (err || !schools)
				return;

			for (var i = 0; i < schools.length; i++) {
				Schools.create({
					id: schools[i].id,
					name: schools[i].name,
					logo_image: schools[i].logo_image,
					website: schools[i].website,
					type: schools[i].type,
					createdAt: schools[i].createdAt,
					updatedAt: schools[i].updatedAt
				}).exec(function callback(err, school) {
					console.log(school);
				});
			}
		});

		//done
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

		//done
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

		//done
		Post.find().exec(function callback(err, posts) {
			if (err || !posts)
				return;

			for (var i = 0; i < posts.length; i++) {
				Posts.create({
					id: posts[i].id,
					type: posts[i].type,
					checks: posts[i].checks,
					clusters: posts[i].clusters,
					createdAt: posts[i].createdAt,
					updatedAt: posts[i].updatedAt
				}).exec(function callback(err, post) {
					console.log(post);
				});
			}
		})
	},

	associate: function(req, res) {

		//User-Device
		User.find().exec(function callback(err, users) {
			if (err || !users)
				return;

			for (var i = 0; i < users.length; i++) {

			}
		});
		
		//User-SuvpCourse
		//User-AttdCourse
		//User-EmpySchool
		//User-EnrlSchool
		//School-Serials
		//School-Course
		//Course-Posts
		//Post-Author
	},

	grade: function(req, res) {
		//post grade & message
		//course grade
	}
  
};
