/**
 * BttendanceController
 *
 * @description :: Server-side logic for managing bttendance
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	test: function(req, res) {
		Devices
		.findByUuid(['B0:D0:9C:83:07:37'])
		.exec(function callback(err, devices) {
			console.log(devices);
		});
	}
	
};

