/**
 * IdentificationController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var Error = require('../utils/errors');

module.exports = {

  update_identity: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var email = req.param('email');
    var school_id = req.param('school_id');
    var identity = req.param('identity');

    if (!identity)
      return res.send(400, Error.log(req, "Identity Update Error", "Identity is required."));

    User
    .findOneByEmail(email)
    .populateAll()
    .exec(function (err, user) {
      if (err || !user)
        return res.send(500, Error.log(req, "Identity Update Error", "User doesn't exist."));

      var found = false;
      for (var i = 0; i < user.identifications.length; i++) {
        if (user.identifications[i].school == Number(school_id)) {
          user.identifications[i].identity = identity;
          user.identifications[i].save(function (err, updated_user) {
            if (err || !updated_user)
              return res.send(500, Error.alert(req, "Identity Update Error", "Updating identity has been failed."));
            return res.send(user.toWholeObject());
          });
          found = true;
          break;
        }
      }

      if (!found) {
        Identification.create({
          identity: identity,
          school: school_id,
          owner: user.id
        }).exec(function (err, identification) {
            if (err || !identification)
              return res.send(500, Error.alert(req, "Identity Update Error", "Updating identity has been failed."));
            User
            .findOneById(user.id)
            .populateAll()
            .exec(function (err, user) {
              if (err || !user)
                return res.send(500, Error.log(req, "Identity Update Error", "User doesn't exist."));
              return res.send(user.toWholeObject());
            });
        });
      }
    });
  }

};
