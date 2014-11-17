/**
 * BttendanceController
 *
 * @description :: Server-side logic for managing bttendance
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	test: function(req, res) {
		console.log('hello');
		Devices
		.findByUuid([ '54:E4:3A:05:8E:F6', '40:B0:FA:62:55:CE', 'CC:05:1B:6E:8E:71' ] )
		.exec(function callback(err, devices) {
			console.log(err);
			console.log(devices);
		});
	}
	
};

