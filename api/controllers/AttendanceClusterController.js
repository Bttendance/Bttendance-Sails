/**
 * AttendanceClusterController
 *
 * @description :: Server-side logic for managing attendanceclusters
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var Moment = require('moment');

module.exports = {

	create: function(req, res) {
		console.log('start : ' + Moment().format('YYYY-MM-DD HH:mm ss SSS Z'));
		for (var i = 0; i < 1000; i++) {
			AttendanceCluster
			.destroy({id:i+1})
			.exec(function callback(err, attendanceCluster) {
				console.log('update' + i + ' : ' + Moment().format('YYYY-MM-DD HH:mm ss SSS Z'));
			});
		}
	},

	create2: function(req, res) {
		console.log('start : ' + Moment().format('YYYY-MM-DD HH:mm ss SSS Z'));
		for (var i = 0; i < 1000; i++) {
			Attendances
			.findOneById(i+1)
			.exec(function callback(err, attendances) {
				console.log('get' + i + ' : ' + Moment().format('YYYY-MM-DD HH:mm ss SSS Z'));
			});
		}
	}
	
};

