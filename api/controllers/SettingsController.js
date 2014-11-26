'use strict';

/**
 * SettingsController
 *
 * @description :: Server-side logic for managing settings
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var error = require('../utils/Errors');

module.exports = {

  updateAttendance: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var email = req.param('email'),
        attendance = req.param('attendance');

    User.findOneByEmail(email)
      .populateAll()
      .exec(function (err, user) {
        if (err || !user || !user.setting) {
          return res.send(500, error.alert(req, "Update Setting Error", "Attendance notification setting update has some error."));
        }

        if (attendance === 'false' || attendance === 'NO') {
          user.setting.attendance = false;
        } else {
          user.setting.attendance = true;
        }

        user.setting.save(function (err) {
          if (err) {
            return res.send(500, error.alert(req, "Update Setting Error", "Attendance notification setting update has some error."));
          }

          return res.send(user.toWholeObject());
        });
      });
  },

  updateClicker: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var email = req.param('email'),
        clicker = req.param('clicker');

    User.findOneByEmail(email)
      .populateAll()
      .exec(function (err, user) {
        if (err || !user || !user.setting) {
          return res.send(500, error.alert(req, "Update Setting Error", "Poll notification setting update has some error."));
        }

        if (clicker === 'false' || clicker === 'NO') {
          user.setting.clicker = false;
        } else {
          user.setting.clicker = true;
        }

        user.setting.save(function (err) {
          if (err) {
            return res.send(500, error.alert(req, "Update Setting Error", "Poll notification setting update has some error."));
          }

          return res.send(user.toWholeObject());
        });
      });
  },

  updateNotice: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var email = req.param('email'),
        notice = req.param('notice');

    User.findOneByEmail(email)
      .populateAll()
      .exec(function (err, user) {
        if (err || !user || !user.setting) {
          return res.send(500, error.alert(req, "Update Setting Error", "Notice notification setting update has some error."));
        }

        if (notice === 'false' || notice === 'NO') {
          user.setting.notice = false;
        } else {
          user.setting.notice = true;
        }

        user.setting.save(function (err) {
          if (err) {
            return res.send(500, error.alert(req, "Update Setting Error", "Notice notification setting update has some error."));
          }

          return res.send(user.toWholeObject());
        });
      });
  },

  updateCurious: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var email = req.param('email'),
        curious = req.param('curious');

    User.findOneByEmail(email)
      .populateAll()
      .exec(function (err, user) {
        if (err || !user || !user.setting) {
          return res.send(500, error.alert(req, "Update Setting Error", "Notice notification setting update has some error."));
        }

        if (curious === 'false' || curious === 'NO') {
          user.setting.curious = false;
        } else {
          user.setting.curious = true;
        }

        user.setting.save(function (err) {
          if (err) {
            return res.send(500, error.alert(req, "Update Setting Error", "Notice notification setting update has some error."));
          }

          return res.send(user.toWholeObject());
        });
      });
  },

  updateClickerDefaults: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var email = req.param('email'),
        progressTime = req.param('progressTime'),
        detailPrivacy = req.param('detailPrivacy'),
        showInfoOnSelect = req.param('showInfoOnSelect');

    User.findOneByEmail(email)
      .populateAll()
      .exec(function (err, user) {
        if (err || !user || !user.setting) {
          return res.send(500, error.alert(req, "Update Setting Error", "Clicker default setting update has some error."));
        }

        user.setting.progressTime = Number(progressTime);
        user.setting.detailPrivacy = detailPrivacy;

        if (showInfoOnSelect === 'false' || showInfoOnSelect === 'NO') {
          user.setting.showInfoOnSelect = false;
        } else {
          user.setting.showInfoOnSelect = true;
        }

        user.setting.save(function (err) {
          if (err) {
            return res.send(500, error.alert(req, "Update Setting Error", "Clicker default setting update has some error."));
          }

          return res.send(user.toWholeObject());
        });
      });
  }

};
