/**
 * TutorialController
 *
 * @description :: Server-side logic for managing tutorials
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  clicker: function (req, res) {
    var device_type = req.param('device_type');
    var locale = req.param('locale');
    var app_version = req.param('app_version');

    res.contentType('text/html; charset=utf-8');
    if (locale == 'ko')
      return res.view('tutorial/tutorial-clicker.ejs');
    else
      return res.view('tutorial/tutorial-clicker-en.ejs');
  },

  attendance: function (req, res) {
    var device_type = req.param('device_type');
    var locale = req.param('locale');
    var app_version = req.param('app_version');

    res.contentType('text/html; charset=utf-8');
    if (locale == 'ko')
      return res.view('tutorial/tutorial-attendance.ejs');
    else
      return res.view('tutorial/tutorial-attendance-en.ejs');
  },

  notice: function (req, res) {
    var device_type = req.param('device_type');
    var locale = req.param('locale');
    var app_version = req.param('app_version');

    res.contentType('text/html; charset=utf-8');
    if (locale == 'ko')
      return res.view('tutorial/tutorial-notice.ejs');
    else
      return res.view('tutorial/tutorial-notice-en.ejs');
  }

};
