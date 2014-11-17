/**
 * BttendanceController
 *
 * @description :: Server-side logic for managing bttendance
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	test: function(req, res) {
		Devices
		.findOneByUuid('54:E4:3A:05:8E:F6')
		.exec(function callback(err, devices) {
			console.log(devices);
		});
	}
	
};

