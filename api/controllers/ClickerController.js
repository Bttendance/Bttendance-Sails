'use strict';

/**
 * ClickerController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var error = require('../utils/errors');

module.exports = {

  click: function (req, res) {
    res.contentType('application/json; charset=utf-8');
    var email = req.param('email'),
        clickerId = req.param('clickerId'),
        choiceNumber = req.param('choiceNumber');

    User.findOneByEmail(email)
      .exec(function (err, user) {
        if (err || !user) {
          return res.send(500, error.log(req, "Clicker Click Error", "User doesn't exitst."));
        }

        Clicker.findOneById(clickerId)
          .populateAll()
          .exec(function (err, clicker) {
            if (err || !clicker) {
              return res.send(500, error.log(req, "Clicker Click Error", "Clicker doesn't exitst."));
            }

            if (choiceNumber > clicker.choiceCount) {
              return res.send(500, error.log(req, "Clicker Click Error", "Clicker choice is out of bound."));
            }

            if (clicker.a_students.indexOf(user.id) !== -1) {
              return res.send(500, error.toast(req, "Clicker Click Error", "You've already chosen A as a choice."));
            }
            if (clicker.b_students.indexOf(user.id) !== -1) {
              return res.send(500, error.toast(req, "Clicker Click Error", "You've already chosen B as a choice."));
            }
            if (clicker.c_students.indexOf(user.id) !== -1) {
              return res.send(500, error.toast(req, "Clicker Click Error", "You've already chosen C as a choice."));
            }
            if (clicker.d_students.indexOf(user.id) !== -1) {
              return res.send(500, error.toast(req, "Clicker Click Error", "You've already chosen D as a choice."));
            }
            if (clicker.e_students.indexOf(user.id) !== -1) {
              return res.send(500, error.toast(req, "Clicker Click Error", "You've already chosen E as a choice."));
            }

            switch (choiceNumber) {
              case 1:
                clicker.a_students.push(user.id);
                break;
              case 2:
                clicker.b_students.push(user.id);
                break;
              case 3:
                clicker.c_students.push(user.id);
                break;
              case 4:
                clicker.d_students.push(user.id);
                break;
              case 5:
                clicker.e_students.push(user.id);
                break;
            }

            clicker.save();

            return res.send(clicker.toWholeObject());
          });
      });
  }

};
