/**
 * BttendanceController
 *
 * @description :: Server-side logic for managing bttendance
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	test: function(req, res) {
		Devices
		.findByUuidIn(["B0:D0:9C:83:07:37", 'ac9d3b01-59d5-4937-a827-2dbc39349fab'])
		.exec(function callback(err, devices) {
			console.log(devices);
		});
	}
	
};
