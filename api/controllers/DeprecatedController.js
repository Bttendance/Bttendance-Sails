'use strict';

/**
 * DeprecatedController
 *
 * @description :: Server-side logic for managing deprecateds
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  updateApp: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var locale = req.param('locale');

    if (!locale || locale !== 'ko') {
      locale = 'en';
    }

    return res.send(442, error.alert(req, sails.__({ phrase: "Update Available", locale: locale }), sails.__({ phrase: "New version of Bttendance has been updated. Please update the app for new features.", locale: locale })));
  }

};
