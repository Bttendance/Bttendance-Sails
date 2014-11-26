'use strict';

/**
 * AttendanceAlarmController
 *
 * @description :: Server-side logic for managing alarms
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var error = require('../utils/Errors'),
    moment = require('moment-timezone');

module.exports = {

  course: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var courseId = req.param('courseId');

    AttendanceAlarm.find({ course: courseId })
      .sort('id DESC')
      .populateAll()
      .exec(function (err, attendanceAlarms) {
        if (err || !attendanceAlarms) {
          return res.send(500, error.log(req, 'Get Alarms Error', 'Alarms don\'t exist.'));
        }

        for (var i = 0; i < attendanceAlarms.length; i++) {
          attendanceAlarms[i] = attendanceAlarms[i].toWholeObject();
        }

        return res.send(attendanceAlarms);
      });
  },

  createManual: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var email = req.param('email'),
        courseId = req.param('courseId'),
        scheduledAt = req.param('scheduledAt');

    User.findOneByEmail(email)
      .exec(function (err, user) {
        if (err || !user) {
          return res.send(500, error.log(req, 'Create Alarms Error', 'User doesn\'t exist.'));
        }

        AttendanceAlarm.create({
            scheduledAt: scheduledAt,
            author: user.id,
            course: courseId,
            type: 'manual'
          }).exec(function (err, attendanceAlarm) {
            if (err || !attendanceAlarm) {
              return res.send(500, error.log(req, 'Create Alarms Error', 'Fail to create alarm.'));
            }

            AttendanceAlarm.findOneById(attendanceAlarm.id)
              .populateAll()
              .exec(function (err, attendanceAlarm) {
                if (err || !attendanceAlarm) {
                  return res.send(500, error.log(req, 'Create Alarms Error', 'Alarm doesn\'t exist.'));
                }

                return res.send(attendanceAlarm.toWholeObject());
              });
          });
      });
  },

  removeManual: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var attendanceAlarmId = req.param('attendanceAlarmId');

    AttendanceAlarm.findOneById(attendanceAlarmId)
      .populateAll()
      .exec(function (err, attendanceAlarm) {
        if (err || !attendanceAlarm) {
          return res.send(500, error.alert(req, 'Delete Alarms Error', 'Fail to find current alarm.'));
        }

        attendanceAlarm.course = null;
        attendanceAlarm.save(function (err) {
          if (err) {
            return res.send(500, error.alert(req, 'Delete Alarms Error', 'Deleting alarm error.'));
          }

          return res.send(attendanceAlarm.toWholeObject());
        });
      });
  },

  on: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var attendanceAlarmId = req.param('attendanceAlarmId');

    AttendanceAlarm.findOneById(attendanceAlarmId)
      .populateAll()
      .exec(function (err, attendanceAlarm) {
        if (err || !attendanceAlarm) {
          return res.send(500, error.alert(req, 'Update Alarms Error', 'Fail to find current alarm.'));
        }

        if (attendanceAlarm.type !== 'bundle') {
          return res.send(500, error.alert(req, 'Update Alarms Error', 'Current alarm is not albe to turn on.'));
        }

        attendanceAlarm.on = true;
        attendanceAlarm.save(function (err) {
          if (err) {
            return res.send(500, error.alert(req, 'Update Alarms Error', 'Updating alarm error.'));
          }

          return res.send(attendanceAlarm.toWholeObject());
        });
      });
  },

  off: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var attendanceAlarmId = req.param('attendanceAlarmId');

    AttendanceAlarm.findOneById(attendanceAlarmId)
      .populateAll()
      .exec(function (err, attendanceAlarm) {
        if (err || !attendanceAlarm) {
          return res.send(500, error.alert(req, 'Update Alarms Error', 'Fail to find current alarm.'));
        }

        if (attendanceAlarm.type !== 'bundle') {
          return res.send(500, error.alert(req, 'Update Alarms Error', 'Current alarm is not albe to turn off.'));
        }

        attendanceAlarm.on = false;
        attendanceAlarm.save(function (err) {
          if (err) {
            return res.send(500, error.alert(req, 'Update Alarms Error', 'Updating alarm error.'));
          }

          return res.send(attendanceAlarm.toWholeObject());
        });
      });
  }

};
