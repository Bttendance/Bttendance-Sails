'use strict';

/**
 * TutorialController
 *
 * @description :: Server-side logic for managing tutorials
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  clicker: function (req, res) {
    var deviceType = req.param('deviceType'),
        locale = req.param('locale'),
        appVersion = req.param('appVersion');

    res.contentType('text/html; charset=utf-8');
    if (locale ==='ko')
      return res.view('guide/guide-clicker.ejs');
    else
      return res.view('guide/guide-clicker-en.ejs');
  },

  attendance: function (req, res) {
    var deviceType = req.param('deviceType'),
        locale = req.param('locale'),
        appVersion = req.param('appVersion');

    res.contentType('text/html; charset=utf-8');
    if (locale === 'ko') {
      return res.view('guide/guide-attendance.ejs');
    } else {
      return res.view('guide/guide-attendance-en.ejs');
    }
  },

  notice: function (req, res) {
    var deviceType = req.param('deviceType'),
        locale = req.param('locale'),
        appVersion = req.param('appVersion');

    res.contentType('text/html; charset=utf-8');
    if (locale === 'ko') {
      return res.view('guide/guide-notice.ejs');
    } else {
      return res.view('guide/guide-notice-en.ejs');
    }
  }

};
