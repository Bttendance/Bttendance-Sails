/**
 * AttendanceClusterController
 *
 * @description :: Server-side logic for managing attendanceclusters
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var Moment = require('moment');

module.exports = {

	create: function(req, res) {
		for (var i = 0; i < 1000; i++) {
			AttendanceCluster.create({
				attendanceID: 1,
				email: 'contact@thefinestartist.com',
				uuid: 'asdf1234'
			}).exec(function callback(err, attendanceCluster) {
				console.log(Moment().format('YYYY-MM-DD HH:mm ss SSS Z'));
			});
		}
	},

	create2: function(req, res) {
		for (var i = 0; i < 1000; i++) {
			console.log(Moment().format('YYYY-MM-DD HH:mm ss SSS Z'));
			Attendances
			.update({id:i+1},{uuid:'asdf'})
			.exec(function callback(err, attendances) {
				console.log(Moment().format('YYYY-MM-DD HH:mm ss SSS Z'));
			});
		}
	}
	
};

