'use strict';

/**
 * DeviceController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var error = require('../utils/errors');

module.exports = {

  updateNotificationKey: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var email = req.param('email'),
        deviceUuid = req.param('deviceUuid'),
        notificationKey = req.param('notificationKey');

    if (!notificationKey) {
      return res.send(400, error.log(req, "Notification Key Update Error", "Key is required."));
    }

    User.findOneByEmail(email)
      .populateAll()
      .exec(function (err, user) {
        if (err || !user) {
          return res.send(404, error.log(req, "Notification Key Update Error", "User doesn't exist."));
        }

        if (deviceUuid !== user.device.uuid) {
          return res.send(404, error.log(req, "Notification Key Update Error", "Device doesn't match."));
        }

        Device.update({ id : user.device.id }, { notificationKey : notificationKey })
          .exec(function (err, device) {
            if (err || !device) {
              return res.send(404, error.log(req, "Notification Key Update Error", "Updating Device Failed."));
            }

            User.findOneById(user.id)
              .populateAll()
              .exec(function (err, user) {
                if (err || !user) {
                  return res.send(404, error.log(req, "Notification Key Update Error", "User doesn't exist."));
                }

                return res.send(user.toWholeObject());
              });
          });
      });
  }
};
