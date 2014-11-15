/**
 * AttendanceClusterController
 *
 * @description :: Server-side logic for managing attendanceclusters
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var Moment = require('moment');

module.exports = {

	create: function(req, res) {
		AttendanceCluster.create({
			attendanceID: 1,
			email: 'contact@thefinestartist.com',
			uuid: 'asdf1234'
		}).exec(function callback(err, attendanceCluster) {
			// console.log(Moment().format('YYYY-MM-DD HH:mm ss SSS Z'));
  		return res.send(JSON.stringify(attendanceCluster));
		});
	},

	create2: function(req, res) {

    for (var i =  1; i <= 200; i++) {
			var request = require('request');
			request('http://bttendance-dev.herokuapp.com/attendancecluster/create', function (error, response, body) {
			    if (!error && response.statusCode == 200) {
		        console.log('success : ' + Moment().format('YYYY-MM-DD HH:mm ss SSS Z'));
		     	} else {
		        console.log('failure : ' + Moment().format('YYYY-MM-DD HH:mm ss SSS Z'));
		     	}
			});
    };

	},

	feed: function(req, res) {

    for (var i =  1; i <= 200; i++) {
			var request = require('request');
			request('http://bttendance-dev.herokuapp.com/api/attendances/from/courses?email=thefinestartist@bttendance.com&password=sha1$619b09ad$1$aef9fb0debecd0b01464039206196e3484f798dd&course_ids=1&course_ids=100', function (error, response, body) {
			    if (!error && response.statusCode == 200) {
		        console.log('success : ' + Moment().format('YYYY-MM-DD HH:mm ss SSS Z'));
		     	} else {
		        console.log('failure : ' + Moment().format('YYYY-MM-DD HH:mm ss SSS Z'));
		     	}
			});
    };

	},

	info: function(req, res) {

    for (var i =  1; i <= 200; i++) {
			var request = require('request');
			request('http://bttendance-dev.herokuapp.com/api/courses/info?email=heehwan.park@bttendance.com&password=sha1$7df4eacb$1$6886cbed77b7cb33d7b9d12986303769dd53647a&course_id=1', function (error, response, body) {
			    if (!error && response.statusCode == 200) {
		        console.log('success : ' + Moment().format('YYYY-MM-DD HH:mm ss SSS Z'));
		     	} else {
		        console.log('failure : ' + Moment().format('YYYY-MM-DD HH:mm ss SSS Z'));
		     	}
			});
    };

	}
	
};

