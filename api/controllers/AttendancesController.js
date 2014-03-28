/**
 * AttendancesController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
	
	all: function(req, res) {
		res.contentType('application/json; charset=utf-8');

		Attendances.find().populate('clusters').sort('id ASC').exec(function callback(err, attendance) {
			for (var i = 0; i < attendance.length; i++)
				attendance[i] = attendance[i].toWholeObject();
	  	return res.send(attendance);
		});
	}
};
