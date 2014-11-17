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
		.findOneByUuid('C8:19:F7:70:77:73')
		.exec(function callback(err, devices) {
			console.log(err);
			console.log(devices);
		});
	}
	
};

